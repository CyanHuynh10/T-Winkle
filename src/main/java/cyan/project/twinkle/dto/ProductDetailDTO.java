package cyan.project.twinkle.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDetailDTO {
    private Integer id;
    private String name;
    private String slug;
    private String description;
    private String categoryName;
    private String brandName;
    private BigDecimal basePrice;
    private BigDecimal effectivePrice;
    private Double ratingAverage;
    private Long soldCount;
    private Boolean inWishlist;

    private List<VariantDTO> variants;
    private List<ImageDTO> images;
    private List<StoreInventoryDTO> storeAvailability;

    @Data
    public static class VariantDTO {
        private Long id;
        private String size;
        private String color;
        private String sku;
        private BigDecimal priceAdjustment;
        private String imageUrl;
    }

    @Data
    public static class ImageDTO {
        private String imageUrl;
        private String altText;
        private Boolean isPrimary;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StoreInventoryDTO {
        private Integer storeId;
        private String storeName;
        private String storeAddress;
        private Long variantId;
        private Integer quantity;
    }
}
