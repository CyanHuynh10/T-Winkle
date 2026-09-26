package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.OtpVerification;
import cyan.project.twinkle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    List<OtpVerification> findByUserAndTypeAndIsUsedFalseOrderByCreatedAtDesc(User user, String type);
}
