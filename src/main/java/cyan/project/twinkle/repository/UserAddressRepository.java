package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByUserEmail(String email);
    Optional<UserAddress> findByIdAndUserEmail(Long id, String email);
    List<UserAddress> findByUserEmailAndIsDefaultTrue(String email);
}
