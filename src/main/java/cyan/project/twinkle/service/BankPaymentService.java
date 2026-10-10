package cyan.project.twinkle.service;

import cyan.project.twinkle.entity.Payment;
import cyan.project.twinkle.entity.User;
import cyan.project.twinkle.repository.PaymentRepository;
import cyan.project.twinkle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BankPaymentService {
    private final PaymentRepository payments;
    private final UserRepository users;
    private final cyan.project.twinkle.payment.PaymentVerificationService verification;

    @Transactional(readOnly = true)
    public Payment ownedByOrder(Long orderId, String email) {
        return payments.findOwnedByOrder(orderId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thanh toán thuộc quyền sở hữu"));
    }

    @Transactional(readOnly = true)
    public List<Payment> manageable(String email) {
        var actor = authorizedActor(email);
        return payments.findManageableBanking(email, isAdmin(actor), org.springframework.data.domain.PageRequest.of(0, 50));
    }

    @Transactional
    public void confirm(Long paymentId, String email) {
        verification.review(paymentId,email,true,"Staff manually verified bank receipt.");
    }

    private User authorizedActor(String email) {
        var actor = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        if (!Boolean.TRUE.equals(actor.getIsEnabled()) || actor.getRoles().stream()
                .noneMatch(role -> role.getName().equals("ROLE_MANAGER") || role.getName().equals("ROLE_ADMIN")))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền xác nhận thanh toán");
        return actor;
    }
    private boolean isAdmin(User user) { return user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN")); }
}
