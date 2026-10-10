package cyan.project.twinkle.service;

import cyan.project.twinkle.entity.OrderStatusHistory;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Store-scoped fulfillment through the existing manager area; no public testing route. */
@Service
@RequiredArgsConstructor
public class OrderFulfillmentService {
    private final OrderRepository orders;
    private final OrderPaymentRules paymentRules;
    private final UserRepository users;
    private final OrderStatusHistoryRepository histories;
    private final OrderCancellationRepository cancellations;
    private final org.springframework.context.ApplicationEventPublisher events;
    private final org.springframework.jdbc.core.JdbcTemplate sql;

    @Transactional
    public void transition(Long id, String actorEmail, String target) {
        var actor = users.findByEmail(actorEmail).orElseThrow(() -> new BusinessRuleException("Tài khoản không hợp lệ"));
        boolean admin = actor.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
        boolean manager = actor.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_MANAGER"));
        if (!Boolean.TRUE.equals(actor.getIsEnabled()) || (!admin && !manager)) throw new BusinessRuleException("Không có quyền cập nhật đơn hàng");
        var order = orders.findForUpdate(id).orElseThrow(() -> new BusinessRuleException("Đơn hàng không tồn tại"));
        if (!admin && order.getOrderItems().stream().anyMatch(i -> !actorEmail.equals(i.getStore().getManagerEmail()))) {
            throw new BusinessRuleException("Đơn hàng không thuộc cửa hàng bạn quản lý");
        }
        if (cancellations.existsByOrderIdAndStatus(id,"PENDING")) throw new BusinessRuleException("Cần xử lý yêu cầu hủy trước khi giao hàng");
        String expected = OrderStatus.next(order.getStatus(), order.getFulfillmentMode());
        if (expected == null || !expected.equals(target)) throw new BusinessRuleException("Chuyển trạng thái không hợp lệ");
        var fulfillmentStates=sql.queryForList("SELECT status FROM ORDER_STORE_FULFILLMENTS WHERE order_id=?",String.class,id);
        if(fulfillmentStates.stream().anyMatch(s -> !target.equals(OrderStatus.next(s,order.getFulfillmentMode())))) throw new BusinessRuleException("Các cửa hàng cần được xử lý theo từng trạng thái hiện tại");
        paymentRules.confirmAllowed(order,target);
        order.setStatus(target);
        sql.update("UPDATE ORDER_STORE_FULFILLMENTS SET status=?,updated_by=?,updated_at=SYSDATETIME(),confirmed_at=CASE WHEN ?=N'Đã xác nhận' THEN SYSDATETIME() ELSE confirmed_at END,delivered_at=CASE WHEN ?=N'Đã giao' THEN SYSDATETIME() ELSE delivered_at END WHERE order_id=?",target,actorEmail,target,target,id);
        var history = histories.save(OrderStatusHistory.builder().order(order).status(target).note("Cập nhật bởi " + actorEmail).build());
        if ("Đã giao".equals(target)) paymentRules.delivered(order);
        if ("Đã giao".equals(target))
            events.publishEvent(new cyan.project.twinkle.event.OrderDeliveredEvent(order.getId(), history.getId()));
    }
}
