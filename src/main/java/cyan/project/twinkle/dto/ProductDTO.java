package cyan.project.twinkle.dto;

import cyan.project.twinkle.entity.Product;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Integer productId;
    private String slug;
    private String name;
    private String categoryName;
    private String brandName;
    private BigDecimal originalPrice;
    private BigDecimal effectivePrice;
    private Double ratingAverage;
    private Integer soldCount;
    private Boolean inWishlist;
    private String primaryImagePath;

    public ProductDTO(Product product, Double ratingAverage, Integer soldCount,
                      BigDecimal effectivePrice, Boolean inWishlist) {
        this.productId = product.getId();
        this.slug = product.getSlug();
        this.name = product.getName();
        this.categoryName = product.getCategory().getName();
        this.brandName = product.getBrand().getName();
        this.originalPrice = product.getBasePrice();
        this.effectivePrice = effectivePrice;
        this.ratingAverage = ratingAverage;
        this.soldCount = soldCount;
        this.inWishlist = inWishlist;
    }
}
