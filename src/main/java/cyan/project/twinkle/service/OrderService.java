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

    @Transactional(readOnly = true)
    public Page<Order> getUserOrders(String email, int page) {
        return orderRepository.findByUserEmailOrderByIdDesc(email, PageRequest.of(page, 9));
    }

    @Transactional(readOnly = true)
    public Order getOrderDetail(Long orderId, String email) {
        return orderRepository.findByIdAndUserEmail(orderId, email)
                .orElseThrow(() -> new BusinessRuleException("Đơn hàng không tồn tại hoặc không thuộc quyền sở hữu."));
    }

    @Transactional(readOnly = true)
    public List<OrderStatusHistory> getOrderTracking(Long orderId, String email) {
        Order order = getOrderDetail(orderId, email); // Verify ownership
        return orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(order.getId());
    }

    @Transactional
    public void cancelOrder(Long orderId, String email, String reason, String otherReason) {
        Order order = orderRepository.findForUpdate(orderId).filter(o -> o.getUser().getEmail().equals(email))
                .orElseThrow(() -> new BusinessRuleException("Đơn hàng không thuộc quyền sở hữu."));

        if (!"Chờ xác nhận".equals(order.getStatus())) {
            throw new BusinessRuleException("Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận.");
        }

        if (orderCancellationRepository.existsByOrderIdAndStatus(orderId, "PENDING")) {
            throw new BusinessRuleException("Đơn hàng này đã có yêu cầu hủy đang chờ xử lý.");
        }

        String finalReason = (reason != null && !reason.trim().isEmpty()) ? reason.trim() : "Khác";
        String customReason = "Khác".equalsIgnoreCase(finalReason) ? otherReason : null;
        if ("Khác".equalsIgnoreCase(finalReason) && (customReason == null || customReason.isBlank())) {
            throw new BusinessRuleException("Vui lòng nhập lý do khác.");
        }

        OrderCancellation cancellation = OrderCancellation.builder()
                .order(order)
                .requestedByEmail(email)
                .reason(finalReason)
                .otherReason(customReason)
                .status("PENDING") // Pending Store Confirmation
                .build();
        orderCancellationRepository.save(cancellation);
        
        // Khách hàng bấm huỷ chỉ tạo yêu cầu Pending, Order Status VẪN GIỮ "Chờ xác nhận"
    }

    @Transactional(readOnly = true)
    public boolean hasPendingCancellation(Long id) {return orderCancellationRepository.existsByOrderIdAndStatus(id, "PENDING");}
}
