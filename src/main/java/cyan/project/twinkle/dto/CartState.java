package cyan.project.twinkle.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartState(List<Item> items, boolean checkoutEligible, BigDecimal selectedTotal) {
    public record Item(Long id, int quantity, boolean selected, int stock, boolean available,
                       String reason, BigDecimal unitPrice, BigDecimal lineTotal) {}
}
