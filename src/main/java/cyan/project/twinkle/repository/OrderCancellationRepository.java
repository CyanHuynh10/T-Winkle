package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.OrderCancellation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderCancellationRepository extends JpaRepository<OrderCancellation, Long> {
    boolean existsByOrderId(Long orderId);
    boolean existsByOrderIdAndStatus(Long orderId, String status);
}
