package cyan.project.twinkle.service;

import cyan.project.twinkle.event.OrderDeliveredEvent;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@RequiredArgsConstructor
public class OrderDeliveryNotificationService {
    private final OrderRepository orders;
    private final OrderStatusHistoryRepository histories;
    private final PaymentRepository payments;
    private final EmailService emails;

    /** The business delivery already committed. This separate lock serializes notifications. */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void send(OrderDeliveredEvent event, AtomicBoolean smtpAccepted) {
        var order = orders.findForUpdate(event.orderId()).orElseThrow();
        if (!"Đã giao".equals(order.getStatus()) || order.getDeliveryMailSentAt() != null) return;
        var history = histories.findById(event.historyId()).orElseThrow();
        if (!history.getOrder().getId().equals(order.getId()) || !"Đã giao".equals(history.getStatus()))
            throw new IllegalStateException("Invalid delivery history reference");
        var payment = payments.findByOrderId(order.getId()).orElseThrow();
        emails.sendDeliveredOrderEmail(order, payment, history.getCreatedAt());
        smtpAccepted.set(true);
        if (orders.markDeliveryMailSent(order.getId(), LocalDateTime.now()) != 1)
            throw new IllegalStateException("Delivery notification marker was not stored");
    }
}
