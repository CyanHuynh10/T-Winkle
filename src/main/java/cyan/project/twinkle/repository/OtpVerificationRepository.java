package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.OtpVerification;
import cyan.project.twinkle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    java.util.List<OtpVerification> findByUserAndTypeOrderByIdDesc(User user, String type);
    List<OtpVerification> findByUserAndTypeAndIsUsedFalseOrderByIdDesc(User user, String type);
}
