package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    @Query("SELECT p FROM Promotion p JOIN p.products prod WHERE prod.id = :productId AND p.status = 'ACTIVE' AND (p.startsAt IS NULL OR p.startsAt <= :now) AND (p.endsAt IS NULL OR p.endsAt >= :now)")
    List<Promotion> findActivePromotionsForProduct(@Param("productId") Integer productId, @Param("now") LocalDateTime now);

    @Query("SELECT prod.id, p FROM Promotion p JOIN p.products prod WHERE prod.id IN :productIds AND p.status = 'ACTIVE' AND (p.startsAt IS NULL OR p.startsAt <= :now) AND (p.endsAt IS NULL OR p.endsAt >= :now)")
    List<Object[]> findActivePromotionsForProducts(@Param("productIds") List<Integer> productIds, @Param("now") LocalDateTime now);
}
