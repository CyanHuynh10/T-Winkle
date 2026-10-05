package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT oi.variant.id, SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.status = 'Đã giao' GROUP BY oi.variant.id")
    List<Object[]> getVariantSales(@Param("productId") Integer productId);
    boolean existsByOrderUserEmailAndProductIdAndOrderStatus(String email, Integer productId, String status);
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi JOIN oi.order o WHERE oi.product.id = :productId AND o.status = :deliveredStatus")
    Long getSoldCountForProduct(@Param("productId") Integer productId, @Param("deliveredStatus") String deliveredStatus);

    @Query("SELECT oi.product.id, COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi JOIN oi.order o WHERE oi.product.id IN :productIds AND o.status = :deliveredStatus GROUP BY oi.product.id")
    List<Object[]> getSoldCountsForProducts(@Param("productIds") List<Integer> productIds, @Param("deliveredStatus") String deliveredStatus);
}
