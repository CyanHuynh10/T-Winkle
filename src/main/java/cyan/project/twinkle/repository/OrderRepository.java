package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    @EntityGraph(attributePaths = {"orderItems"})
    @Query(value = "SELECT o FROM Order o WHERE o.user.email = :email ORDER BY o.createdAt DESC, o.id DESC",
           countQuery = "SELECT COUNT(o) FROM Order o WHERE o.user.email = :email")
    Page<Order> findByUserEmailOrderByIdDesc(@Param("email") String email, Pageable pageable);

    @EntityGraph(attributePaths = {"orderItems", "orderItems.product", "orderItems.variant", "orderItems.store", "coupon"})
    Optional<Order> findByIdAndUserEmail(Long id, String email);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findForUpdate(@Param("id") Long id);

    // Update only the notification marker, preserving the delivery updatedAt snapshot.
    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Order o SET o.deliveryMailSentAt = :sentAt WHERE o.id = :id AND o.deliveryMailSentAt IS NULL")
    int markDeliveryMailSent(@Param("id") Long id, @Param("sentAt") java.time.LocalDateTime sentAt);
}
