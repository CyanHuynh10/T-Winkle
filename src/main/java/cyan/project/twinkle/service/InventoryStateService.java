package cyan.project.twinkle.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class InventoryStateService {
    private final int lowStockThreshold;
    public InventoryStateService(@Value("${twinkle.inventory.low-stock-threshold:5}") int threshold) {
        this.lowStockThreshold = Math.max(0, threshold);
    }
    public String state(Integer quantity) {
        if (quantity == null || quantity <= 0) return "OUT";
        return quantity <= lowStockThreshold ? "LOW" : "AVAILABLE";
    }
}
