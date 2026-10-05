package cyan.project.twinkle.dto;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutQuote(List<Item> items, BigDecimal subtotal, BigDecimal productDiscount,
                            BigDecimal couponDiscount, BigDecimal shippingFee, BigDecimal total) {
    public record Item(Long cartItemId, Integer productId, String productName, Long variantId,
                       String variantName, Integer storeId, String storeName, String imageUrl,
                       int quantity, BigDecimal originalUnitPrice, BigDecimal effectiveUnitPrice) {}
}
