package cyan.project.twinkle.service;

import cyan.project.twinkle.exception.BusinessRuleException;
import java.util.*;

/** Canonical fulfillment vocabulary and the only definition of valid next steps. */
public enum OrderStatus {
    PENDING("Chờ xác nhận đơn hàng", "waiting"),
    CONFIRMED("Đã xác nhận", "confirmed"),
    PREPARING("Đang chuẩn bị đơn hàng", "preparing"),
    READY("Đơn hàng đã sẵn sàng", "ready"),
    SHIPPING("Đang giao", "shipping"),
    DELIVERED("Đã giao", "delivered"),
    CANCELLED("Đã hủy", "cancelled");
    private final String label;
    private final String style;
    OrderStatus(String label, String style) { this.label=label; this.style=style; }
    public String label() { return label; }
    public String style() { return style; }
    public static OrderStatus of(String label) {
        return Arrays.stream(values()).filter(s -> s.label.equals(label)).findFirst()
                .orElseThrow(() -> new BusinessRuleException("Trạng thái đơn hàng không hợp lệ"));
    }
    public static List<String> sequence(String mode) {
        return Arrays.stream(values()).filter(s -> s!=CANCELLED && (!"PICKUP".equals(mode) || s!=SHIPPING)).map(OrderStatus::label).toList();
    }
    public static String next(String label, String mode) {
        var sequence=sequence(mode); int index=sequence.indexOf(label);
        return index<0 || index+1>=sequence.size()?null:sequence.get(index+1);
    }
    public static String aggregate(List<String> statuses) {
        if (statuses.isEmpty()) throw new BusinessRuleException("Đơn hàng không có mặt hàng");
        var active=statuses.stream().map(OrderStatus::of).filter(s -> s!=CANCELLED).toList();
        return active.isEmpty()?CANCELLED.label:active.stream().min(Comparator.comparingInt(Enum::ordinal)).orElseThrow().label;
    }
}
