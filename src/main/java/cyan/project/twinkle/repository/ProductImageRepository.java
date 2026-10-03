package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    @Query("SELECT pi.product.id, pi.imageUrl, pi.isPrimary, pi.sortOrder FROM ProductImage pi WHERE pi.product.id IN :productIds")
    List<Object[]> findImageMetaDataByProductIds(@Param("productIds") List<Integer> productIds);
}
