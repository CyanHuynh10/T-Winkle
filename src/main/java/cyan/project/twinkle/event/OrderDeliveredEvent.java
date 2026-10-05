package cyan.project.twinkle.event;

/** IDs only; notification data is reloaded after the delivery transaction commits. */
public record OrderDeliveredEvent(Long orderId, Long historyId) {}
