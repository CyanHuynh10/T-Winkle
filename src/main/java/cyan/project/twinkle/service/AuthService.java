package cyan.project.twinkle.service;

import cyan.project.twinkle.dto.RegisterRequest;
import cyan.project.twinkle.dto.ResetPasswordRequest;
import cyan.project.twinkle.entity.OtpVerification;
import cyan.project.twinkle.entity.PasswordResetToken;
import cyan.project.twinkle.entity.Role;
import cyan.project.twinkle.entity.User;
import cyan.project.twinkle.repository.OtpVerificationRepository;
import cyan.project.twinkle.repository.PasswordResetTokenRepository;
import cyan.project.twinkle.repository.RoleRepository;
import cyan.project.twinkle.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OtpVerificationRepository otpRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       OtpVerificationRepository otpRepository, PasswordResetTokenRepository resetTokenRepository,
                       PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.otpRepository = otpRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void registerUser(RegisterRequest request) throws Exception {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new Exception("Xác nhận mật khẩu không khớp.");
        }
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new Exception("Email đã tồn tại.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsEnabled(false);

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new Exception("Lỗi hệ thống: Chưa khởi tạo ROLE_USER"));
        user.getRoles().add(userRole);

        userRepository.save(user);

        generateAndSendOtp(user, "REGISTER");
    }

    @Transactional
    public void resendOtp(String email, String type) throws Exception {
        if (!"REGISTER".equals(type) && !"FORGOT_PASSWORD".equals(type)) {
            throw new Exception("Loại OTP không hợp lệ.");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            if ("FORGOT_PASSWORD".equals(type)) {
                return; // Enumeration protection
            }
            throw new Exception("Tài khoản không tồn tại.");
        }
        generateAndSendOtp(userOpt.get(), type);
    }

    @Transactional
    public void generateAndSendOtp(User user, String type) throws Exception {
        List<OtpVerification> oldOtps = otpRepository.findByUserAndTypeAndIsUsedFalseOrderByCreatedAtDesc(user, type);
        for (OtpVerification otp : oldOtps) {
            if (otp.getCreatedAt().plusSeconds(60).isAfter(LocalDateTime.now())) {
                throw new Exception("Vui lòng đợi 60 giây trước khi yêu cầu gửi lại OTP.");
            }
            otp.setIsUsed(true);
            otpRepository.save(otp);
        }

        SecureRandom random = new SecureRandom();
        int otpCode = 100000 + random.nextInt(900000);
        String rawOtp = String.valueOf(otpCode);

        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setUser(user);
        otpVerification.setHashedOtp(passwordEncoder.encode(rawOtp));
        otpVerification.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpVerification.setType(type);
        otpRepository.save(otpVerification);

        emailService.sendEmail(user.getEmail(), "Mã OTP xác thực T-Winkle", "Mã OTP của bạn là: " + rawOtp + ". Mã có hiệu lực trong 5 phút.");
    }

    @Transactional
    public void verifyOtp(String email, String otpCode, String expectedType) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Thông tin xác thực không hợp lệ.")); // Generic message

        List<OtpVerification> otps = otpRepository.findByUserAndTypeAndIsUsedFalseOrderByCreatedAtDesc(user, expectedType);
        if (otps.isEmpty()) {
            throw new Exception("Không tìm thấy mã OTP hoặc mã đã hết hạn.");
        }

        OtpVerification latestOtp = otps.get(0);

        if (latestOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            latestOtp.setIsUsed(true);
            otpRepository.save(latestOtp);
            throw new Exception("Mã OTP đã hết hạn..");
        }

        if (latestOtp.getAttempts() >= 5) {
            latestOtp.setIsUsed(true);
            otpRepository.save(latestOtp);
            throw new Exception("Mã OTP đã bị khóa do nhập sai quá nhiều lần.");
        }

        if (!passwordEncoder.matches(otpCode, latestOtp.getHashedOtp())) {
            latestOtp.setAttempts(latestOtp.getAttempts() + 1);
            if (latestOtp.getAttempts() >= 5) {
                latestOtp.setIsUsed(true);
            }
            otpRepository.save(latestOtp);
            throw new Exception("OTP không chính xác..");
        }

        latestOtp.setIsUsed(true);
        otpRepository.save(latestOtp);

        if ("REGISTER".equals(expectedType)) {
            user.setIsEnabled(true);
            userRepository.save(user);
        }
    }

    @Transactional
    public void processForgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            try {
                generateAndSendOtp(userOpt.get(), "FORGOT_PASSWORD");
            } catch (Exception ignored) {
                // Enumeration protection
            }
        }
    }

    @Transactional
    public String generateResetTokenAfterOtp(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Lỗi hệ thống."));
        
        List<PasswordResetToken> oldTokens = resetTokenRepository.findByUserAndIsUsedFalseOrderByCreatedAtDesc(user);
        for (PasswordResetToken token : oldTokens) {
            token.setIsUsed(true);
            resetTokenRepository.save(token);
        }

        String rawToken = UUID.randomUUID().toString() + "-" + new SecureRandom().nextLong();
        
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setHashedToken(passwordEncoder.encode(rawToken));
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        resetTokenRepository.save(resetToken);

        return rawToken;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) throws Exception {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new Exception("Xác nhận mật khẩu không khớp.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new Exception("Token hoặc email không hợp lệ.")); // Generic message

        List<PasswordResetToken> tokens = resetTokenRepository.findByUserAndIsUsedFalseOrderByCreatedAtDesc(user);
        if (tokens.isEmpty()) {
            throw new Exception("Token không hợp lệ hoặc đã hết hạn.");
        }

        PasswordResetToken validToken = null;
        for (PasswordResetToken t : tokens) {
            if (passwordEncoder.matches(request.getToken(), t.getHashedToken())) {
                validToken = t;
                break;
            }
        }

        if (validToken == null || validToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new Exception("Token không hợp lệ hoặc đã hết hạn.");
        }

        validToken.setIsUsed(true);
        resetTokenRepository.save(validToken);

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
