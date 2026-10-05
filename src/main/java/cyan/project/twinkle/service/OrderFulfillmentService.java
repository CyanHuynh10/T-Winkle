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
    private final UserRepository users;
    private final OrderStatusHistoryRepository histories;
    private final OrderCancellationRepository cancellations;
    private final org.springframework.context.ApplicationEventPublisher events;

    @Transactional
    public void transition(Long id, String actorEmail, String target) {
        var actor = users.findByEmail(actorEmail).orElseThrow(() -> new BusinessRuleException("Tài khoản không hợp lệ."));
        boolean admin = actor.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
        boolean manager = actor.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_MANAGER"));
        if (!Boolean.TRUE.equals(actor.getIsEnabled()) || (!admin && !manager)) throw new BusinessRuleException("Không có quyền cập nhật đơn hàng.");
        var order = orders.findForUpdate(id).orElseThrow(() -> new BusinessRuleException("Đơn hàng không tồn tại."));
        if (!admin && order.getOrderItems().stream().anyMatch(i -> !actorEmail.equals(i.getStore().getManagerEmail()))) {
            throw new BusinessRuleException("Đơn hàng không thuộc cửa hàng bạn quản lý.");
        }
        if (cancellations.existsByOrderIdAndStatus(id,"PENDING")) throw new BusinessRuleException("Cần xử lý yêu cầu hủy trước khi giao hàng.");
        String expected = switch(order.getStatus()) {
            case "Chờ xác nhận" -> "Đã xác nhận";
            case "Đã xác nhận" -> "Đã giao";
            default -> null;
        };
        if (expected == null || !expected.equals(target)) throw new BusinessRuleException("Chuyển trạng thái không hợp lệ.");
        order.setStatus(target);
        var history = histories.save(OrderStatusHistory.builder().order(order).status(target).note("Cập nhật bởi " + actorEmail).build());
        if ("Đã giao".equals(target))
            events.publishEvent(new cyan.project.twinkle.event.OrderDeliveredEvent(order.getId(), history.getId()));
    }
}
