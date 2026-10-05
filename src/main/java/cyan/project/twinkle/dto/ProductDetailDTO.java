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
    private List<ReviewDTO> reviews;
    private Boolean canReview;
    private List<Long> reviewCounts;

    @Data
    @AllArgsConstructor
    public static class ReviewDTO {
        private String displayName;
        private Integer rating;
        private String comment;
        private java.time.LocalDateTime createdAt;
    }

    @Data
    public static class VariantDTO {
        private Long id;
        private String size;
        private String color;
        private String sku;
        private BigDecimal priceAdjustment;
        private String imageUrl;
        private Long soldCount;
        private Double ratingAverage;
        private Long reviewCount;
        // Five counts in ascending star order, derived through the actual reviewed order item.
        private List<Long> starCounts;
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
        private String stockState;
        private String storeStatus;
        public StoreInventoryDTO(Integer storeId, String storeName, String storeAddress, Long variantId, Integer quantity, String storeStatus) {
            this(storeId, storeName, storeAddress, variantId, quantity); this.storeStatus = storeStatus;
        }
        public StoreInventoryDTO(Integer storeId, String storeName, String storeAddress, Long variantId, Integer quantity) {
            this.storeId = storeId; this.storeName = storeName; this.storeAddress = storeAddress;
            this.variantId = variantId; this.quantity = quantity;
        }
    }
}
