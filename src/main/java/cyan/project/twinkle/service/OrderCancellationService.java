package cyan.project.twinkle.service;

import cyan.project.twinkle.admin.AdminAuditService;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor
public class OrderCancellationService {
    private final JdbcTemplate sql;
    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final UserRepository users;
    private final AdminAuditService audit;
    public record Decision(boolean approve, boolean refundTransferred, String reference, String note) {}
    @Transactional
    public void review(long id, String actor, Decision input) {
        var user=users.findByEmail(actor).orElseThrow(() -> new BusinessRuleException("Tài khoản không hợp lệ"));
        var order=orders.findForUpdate(id).orElseThrow(() -> new BusinessRuleException("Đơn hàng không tồn tại"));
        boolean admin=user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        boolean manager=user.getRoles().stream().anyMatch(r -> "ROLE_MANAGER".equals(r.getName()));
        if (!Boolean.TRUE.equals(user.getIsEnabled()) || (!admin && (!manager || order.getOrderItems().stream().anyMatch(i -> !actor.equals(i.getStore().getManagerEmail())))))
            throw new org.springframework.security.access.AccessDeniedException("NOT_AUTHORIZED");
        if (actor.equals(order.getUser().getEmail())) throw new org.springframework.security.access.AccessDeniedException("NOT_AUTHORIZED");
        if (input.note()==null || input.note().isBlank() || input.note().length()>500 || (input.reference()!=null && input.reference().length()>150)) throw new BusinessRuleException("Cần ghi chú xử lý không quá 500 ký tự");
        var requests=sql.queryForList("SELECT id,status FROM ORDER_CANCELLATIONS WITH(UPDLOCK,HOLDLOCK) WHERE order_id=?",id);
        if (requests.isEmpty()) throw new BusinessRuleException("Không có yêu cầu hủy");
        var cancellation=requests.getFirst();
        var payment=payments.findByOrderId(id).orElseThrow(() -> new BusinessRuleException("Không tìm thấy thanh toán"));
        payment=payments.findForUpdate(payment.getId()).orElseThrow();
        if ("APPROVED".equals(cancellation.get("status")) && input.approve()) {
            if (input.refundTransferred()) completeRefund(id,payment.getId(),actor,input);
            return;
        }
        if (!"PENDING".equals(cancellation.get("status"))) throw new BusinessRuleException("Yêu cầu hủy đã được xử lý");
        if (!input.approve()) {
            sql.update("UPDATE ORDER_CANCELLATIONS SET status='REJECTED',responded_at=SYSDATETIME(),response_note=? WHERE order_id=?",input.note(),id);
            audit.record(actor,"CANCELLATION_REJECTED","ORDERS",id,input.note()); return;
        }
        var statuses=sql.queryForList("SELECT status FROM ORDER_STORE_FULFILLMENTS WITH(UPDLOCK,HOLDLOCK) WHERE order_id=?",String.class,id);
        if (List.of("Đã giao","Đang giao","Đã hủy").contains(order.getStatus()) || statuses.stream().anyMatch(s -> List.of("Đã giao","Đang giao").contains(s))) throw new BusinessRuleException("Không thể hủy đơn đã giao hoặc đang giao");
        if ("BANKING".equals(payment.getMethod()) && "PAID".equals(payment.getStatus())) {
            sql.update("INSERT PAYMENT_REFUNDS(payment_id,order_id,amount,status,reason) SELECT ?,?,?,'PENDING',? WHERE NOT EXISTS(SELECT 1 FROM PAYMENT_REFUNDS WITH(UPDLOCK,HOLDLOCK) WHERE payment_id=?)",payment.getId(),id,payment.getAmount(),input.note(),payment.getId());
            if(input.refundTransferred()) completeRefund(id,payment.getId(),actor,input);
        } else if (input.refundTransferred()) throw new BusinessRuleException("Đơn chưa nhận chuyển khoản không có khoản hoàn tiền");
        // Restore each exact checkout allocation once, under the canonical order lock.
        for(var item:order.getOrderItems().stream().sorted(java.util.Comparator.comparing((cyan.project.twinkle.entity.OrderItem item)->item.getStore().getId()).thenComparing(item->item.getVariant().getId())).toList()) {
            int old=sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WITH(UPDLOCK,HOLDLOCK) WHERE store_id=? AND variant_id=?",Integer.class,item.getStore().getId(),item.getVariant().getId());
            int next=Math.addExact(old,item.getQuantity());
            sql.update("UPDATE STORE_INVENTORY SET quantity=?,updated_at=SYSDATETIME() WHERE store_id=? AND variant_id=?",next,item.getStore().getId(),item.getVariant().getId());
            sql.update("INSERT INVENTORY_MOVEMENTS(store_id,variant_id,old_quantity,quantity_delta,new_quantity,movement_type,reason,reference_type,reference_id,performed_by) VALUES(?,?,?,?,?,'RETURN',?,'ORDER_CANCELLATION',?,?)",item.getStore().getId(),item.getVariant().getId(),old,item.getQuantity(),next,input.note(),id,actor);
        }
        order.setStatus(OrderStatus.CANCELLED.label()); orders.saveAndFlush(order);
        sql.update("UPDATE ORDER_STORE_FULFILLMENTS SET status=N'Đã hủy',cancelled_at=SYSDATETIME(),updated_at=SYSDATETIME(),updated_by=? WHERE order_id=?",actor,id);
        sql.update("UPDATE ORDER_CANCELLATIONS SET status='APPROVED',responded_at=SYSDATETIME(),response_note=? WHERE order_id=?",input.note(),id);
        sql.update("INSERT ORDER_STATUS_HISTORY(order_id,status,note,created_at) VALUES(?,N'Đã hủy',?,SYSDATETIME())",id,input.note());
        audit.record(actor,"CANCELLATION_APPROVED","ORDERS",id,input.note());
    }
    private void completeRefund(long id, long paymentId, String actor, Decision input) {
        var refunds=sql.queryForList("SELECT id,status,amount FROM PAYMENT_REFUNDS WITH(UPDLOCK,HOLDLOCK) WHERE payment_id=? AND order_id=?",paymentId,id);
        if(refunds.isEmpty()) throw new BusinessRuleException("Không có khoản hoàn tiền chờ xử lý");
        var refund=refunds.getFirst(); if("COMPLETED".equals(refund.get("status"))) return;
        if(!"PENDING".equals(refund.get("status"))) throw new BusinessRuleException("Trạng thái hoàn tiền không hợp lệ");
        if(sql.update("UPDATE PAYMENTS SET status='REFUNDED' WHERE id=? AND method='BANKING' AND status='PAID'",paymentId)!=1) throw new BusinessRuleException("Thanh toán không hợp lệ để hoàn tiền");
        sql.update("UPDATE PAYMENT_REFUNDS SET status='COMPLETED',processed_by=?,processed_at=SYSDATETIME(),transaction_reference=?,note=?,updated_at=SYSDATETIME() WHERE id=?",actor,input.reference(),input.note(),refund.get("id"));
        audit.record(actor,"REFUND_COMPLETED","PAYMENT_REFUNDS",refund.get("id"),"Hoàn tiền đã được nhân viên xác nhận chuyển: "+refund.get("amount"));
    }
}
