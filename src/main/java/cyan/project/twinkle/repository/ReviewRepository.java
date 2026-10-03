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
    Page<Review> findByOrderItemProductIdOrderByIdDesc(Integer productId, Pageable pageable);
    
    boolean existsByUserEmailAndProductId(String email, Integer productId);

    @Query("SELECT AVG(CAST(r.rating AS double)) FROM Review r WHERE r.product.id = :productId AND r.status = 'APPROVED'")
    Double getAverageRatingForProduct(@Param("productId") Integer productId);

    @Query("SELECT r.product.id, AVG(CAST(r.rating AS double)) FROM Review r WHERE r.product.id IN :productIds AND r.status = 'APPROVED' GROUP BY r.product.id")
    List<Object[]> getAverageRatingsForProducts(@Param("productIds") List<Integer> productIds);
}
