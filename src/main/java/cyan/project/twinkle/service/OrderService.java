package cyan.project.twinkle.service;

import cyan.project.twinkle.entity.*;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderCancellationRepository orderCancellationRepository;
    private final org.springframework.jdbc.core.JdbcTemplate sql;
    private Order decorate(Order order) {
        var payment=sql.queryForList("SELECT status FROM PAYMENTS WHERE order_id=?",String.class,order.getId());
        order.setPaymentStatus(payment.isEmpty()?null:payment.getFirst());
        var refunds=sql.queryForList("SELECT status FROM PAYMENT_REFUNDS WHERE order_id=?",String.class,order.getId());
        order.setRefundStatus(refunds.isEmpty()?null:refunds.getFirst());
        order.setCancellationPending(orderCancellationRepository.existsByOrderIdAndStatus(order.getId(),"PENDING"));
        return order;
    }

    @Transactional(readOnly = true)
    public Page<Order> getUserOrders(String email, int page) {
        return orderRepository.findByUserEmailOrderByIdDesc(email, PageRequest.of(page, 9)).map(this::decorate);
    }

    @Transactional(readOnly = true)
    public Order getOrderDetail(Long orderId, String email) {
        return decorate(orderRepository.findByIdAndUserEmail(orderId, email)
                .orElseThrow(() -> new BusinessRuleException("Đơn hàng không tồn tại hoặc không thuộc quyền sở hữu")));
    }

    @Transactional(readOnly = true)
    public List<OrderStatusHistory> getOrderTracking(Long orderId, String email) {
        Order order = getOrderDetail(orderId, email); // Verify ownership
        return orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(order.getId());
    }

    @Transactional
    public void cancelOrder(Long orderId, String email, String reason, String otherReason) {
        Order order = orderRepository.findForUpdate(orderId).filter(o -> o.getUser().getEmail().equals(email))
                .orElseThrow(() -> new BusinessRuleException("Đơn hàng không thuộc quyền sở hữu"));

        if (java.util.List.of("Đang giao","Đã giao","Đã hủy").contains(order.getStatus()) || sql.queryForObject("SELECT COUNT(*) FROM ORDER_STORE_FULFILLMENTS WHERE order_id=? AND status IN(N'Đang giao',N'Đã giao')",Integer.class,orderId)>0) {
            throw new BusinessRuleException("Không thể hủy đơn đã giao hoặc đang giao");
        }

        if (orderCancellationRepository.existsByOrderIdAndStatus(orderId, "PENDING")) {
            throw new BusinessRuleException("Đơn hàng này đã có yêu cầu hủy đang chờ xử lý");
        }
        if(orderCancellationRepository.existsByOrderId(orderId)) throw new BusinessRuleException("Yêu cầu hủy của đơn hàng đã được xử lý, vui lòng liên hệ cửa hàng");

        String finalReason = (reason != null && !reason.trim().isEmpty()) ? reason.trim() : "Khác";
        String customReason = "Khác".equalsIgnoreCase(finalReason) ? otherReason : null;
        if ("Khác".equalsIgnoreCase(finalReason) && (customReason == null || customReason.isBlank())) {
            throw new BusinessRuleException("Vui lòng nhập lý do khác");
        }

        OrderCancellation cancellation = OrderCancellation.builder()
                .order(order)
                .requestedByEmail(email)
                .reason(finalReason)
                .otherReason(customReason)
                .status("PENDING") // Pending Store Confirmation
                .build();
        orderCancellationRepository.save(cancellation);
        
        // Khách hàng bấm huỷ chỉ tạo yêu cầu Pending, Order Status VẪN GIỮ "Chờ xác nhận đơn hàng"
    }

    @Transactional(readOnly = true)
    public boolean hasPendingCancellation(Long id) {return orderCancellationRepository.existsByOrderIdAndStatus(id, "PENDING");}
}
