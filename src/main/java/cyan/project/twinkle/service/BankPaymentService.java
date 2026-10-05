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

    @Transactional(readOnly = true)
    public Payment ownedByOrder(Long orderId, String email) {
        return payments.findOwnedByOrder(orderId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thanh toán thuộc quyền sở hữu."));
    }

    @Transactional(readOnly = true)
    public List<Payment> manageable(String email) {
        var actor = authorizedActor(email);
        return payments.findManageableBanking(email, isAdmin(actor), org.springframework.data.domain.PageRequest.of(0, 50));
    }

    @Transactional
    public void confirm(Long paymentId, String email) {
        var actor = authorizedActor(email);
        var payment = payments.findForUpdate(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thanh toán."));
        if (email.equals(payment.getOrder().getUser().getEmail()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Người mua không được tự xác nhận thanh toán.");
        if (!isAdmin(actor) && payment.getOrder().getOrderItems().stream()
                .anyMatch(item -> !email.equals(item.getStore().getManagerEmail())))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Đơn hàng không thuộc các cửa hàng bạn quản lý.");
        if (!"BANKING".equals(payment.getMethod()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Chỉ xác nhận thanh toán chuyển khoản.");
        if (payment.getAmount().compareTo(payment.getOrder().getTotal()) != 0)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Số tiền thanh toán không khớp đơn hàng.");
        if ("PAID".equals(payment.getStatus())) return;
        if (!"PENDING".equals(payment.getStatus()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Trạng thái thanh toán không cho phép xác nhận.");
        payment.setStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());
    }

    private User authorizedActor(String email) {
        var actor = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        if (!Boolean.TRUE.equals(actor.getIsEnabled()) || actor.getRoles().stream()
                .noneMatch(role -> role.getName().equals("ROLE_MANAGER") || role.getName().equals("ROLE_ADMIN")))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền xác nhận thanh toán.");
        return actor;
    }
    private boolean isAdmin(User user) { return user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN")); }
}
