package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.PasswordResetToken;
import cyan.project.twinkle.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    List<PasswordResetToken> findByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);
}
