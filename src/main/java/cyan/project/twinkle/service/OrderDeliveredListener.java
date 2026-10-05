package cyan.project.twinkle.service;

import cyan.project.twinkle.event.OrderDeliveredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderDeliveredListener {
    private final OrderDeliveryNotificationService notifications;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDelivered(OrderDeliveredEvent event) {
        var smtpAccepted = new AtomicBoolean();
        try { notifications.send(event, smtpAccepted); }
        catch (Exception failure) {
            // Do not log exception messages/stacks: SMTP diagnostics can contain secrets or recipients.
            if (smtpAccepted.get())
                log.warn("Delivery email SMTP accepted for order {}, but sent timestamp could not be persisted ({}). No immediate retry.", event.orderId(), failure.getClass().getSimpleName());
            else
                log.warn("Delivery notification unsuccessful for order {} ({}). Delivery remains committed; no automatic retry.", event.orderId(), failure.getClass().getSimpleName());
        }
    }
}
