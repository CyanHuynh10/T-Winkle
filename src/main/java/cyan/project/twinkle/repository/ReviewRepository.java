package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("""
        SELECT r.orderItem.variant.id, AVG(CAST(r.rating AS double)), COUNT(r),
          SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END), SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END),
          SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END), SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END),
          SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END)
        FROM Review r WHERE r.product.id = :productId AND r.status = 'APPROVED'
          AND r.orderItem.product = r.product AND r.orderItem.order = r.order
        GROUP BY r.orderItem.variant.id
        """)
    List<Object[]> getVariantRatings(@Param("productId") Integer productId);
    @Query("SELECT r.product.id FROM Review r WHERE r.user.email = :email")
    java.util.Set<Integer> findReviewedProductIds(@Param("email") String email);
    @Query("SELECT new cyan.project.twinkle.dto.ProductDetailDTO$ReviewDTO(" +
            "CASE WHEN u.fullName IS NULL OR TRIM(u.fullName) = '' THEN u.username ELSE u.fullName END, " +
            "r.rating, r.comment, r.createdAt) FROM Review r JOIN r.user u " +
            "WHERE r.product.id = :productId AND r.status = 'APPROVED' ORDER BY r.createdAt DESC, r.id DESC")
    List<cyan.project.twinkle.dto.ProductDetailDTO.ReviewDTO> findStorefrontReviews(@Param("productId") Integer productId);
    Page<Review> findByOrderItemProductIdOrderByIdDesc(Integer productId, Pageable pageable);
    
    boolean existsByUserEmailAndProductId(String email, Integer productId);

    @Query("SELECT AVG(CAST(r.rating AS double)) FROM Review r WHERE r.product.id = :productId AND r.status = 'APPROVED'")
    Double getAverageRatingForProduct(@Param("productId") Integer productId);

    @Query("SELECT r.product.id, AVG(CAST(r.rating AS double)) FROM Review r WHERE r.product.id IN :productIds AND r.status = 'APPROVED' GROUP BY r.product.id")
    List<Object[]> getAverageRatingsForProducts(@Param("productIds") List<Integer> productIds);
}
