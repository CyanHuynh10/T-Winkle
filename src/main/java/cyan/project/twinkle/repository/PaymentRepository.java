package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    java.util.Optional<Payment> findByOrderId(Long orderId);
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Payment p JOIN FETCH p.order WHERE p.id = :id")
    java.util.Optional<Payment> findForUpdate(@org.springframework.data.repository.query.Param("id") Long id);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Payment p JOIN FETCH p.order o WHERE o.id = :orderId AND o.user.email = :email")
    java.util.Optional<Payment> findOwnedByOrder(@org.springframework.data.repository.query.Param("orderId") Long orderId,
            @org.springframework.data.repository.query.Param("email") String email);

    @org.springframework.data.jpa.repository.Query("""
        SELECT p FROM Payment p JOIN FETCH p.order o
        WHERE p.method = 'BANKING' AND o.user.email <> :email AND (:admin = true OR NOT EXISTS
          (SELECT i FROM OrderItem i WHERE i.order = o AND (i.store.managerEmail IS NULL OR i.store.managerEmail <> :email)))
        ORDER BY p.createdAt DESC, p.id DESC
        """)
    java.util.List<Payment> findManageableBanking(@org.springframework.data.repository.query.Param("email") String email,
            @org.springframework.data.repository.query.Param("admin") boolean admin, org.springframework.data.domain.Pageable pageable);
}
