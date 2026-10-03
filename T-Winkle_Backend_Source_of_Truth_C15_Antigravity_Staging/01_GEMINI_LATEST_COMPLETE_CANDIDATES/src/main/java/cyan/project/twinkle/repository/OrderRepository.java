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
    
    @Query(value = "SELECT o FROM Order o WHERE o.user.email = :email",
           countQuery = "SELECT COUNT(o) FROM Order o WHERE o.user.email = :email")
    Page<Order> findByUserEmailOrderByCreatedAtDesc(@Param("email") String email, Pageable pageable);

    @EntityGraph(attributePaths = {"orderItems", "orderItems.product", "orderItems.variant", "orderItems.store", "coupon"})
    Optional<Order> findByIdAndUserEmail(Long id, String email);
}
