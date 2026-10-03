package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findFirstByUserEmailAndStatusOrderByCreatedAtDesc(String email, String status);
}
