package cyan.project.twinkle.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;
import cyan.project.twinkle.entity.Order;
import cyan.project.twinkle.entity.Payment;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templates;
    private final String baseUrl;
    private final String sender;

    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templates,
                        @Value("${app.base-url}") String baseUrl,
                        @Value("${spring.mail.username:}") String sender) {
        this.mailSender = mailSender;
        this.templates = templates;
        this.baseUrl = baseUrl;
        this.sender = sender;
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendDeliveredOrderEmail(Order order, Payment payment, LocalDateTime deliveredAt) {
        var context = new Context(Locale.forLanguageTag("vi-VN"));
        context.setVariable("order", order);
        context.setVariable("deliveredAt", deliveredAt);
        String name = order.getRecipientName();
        if (name == null || name.isBlank()) name = order.getUser().getFullName();
        context.setVariable("customerName", name == null || name.isBlank() ? "bạn" : name);
        context.setVariable("paymentMethod", switch (payment.getMethod()) {
            case "COD" -> "Thanh toán khi nhận hàng";
            case "BANKING" -> "Chuyển khoản ngân hàng";
            case "VNPAY" -> "VNPay (đơn hàng trước đây)";
            case "MOMO" -> "MoMo (đơn hàng trước đây)";
            default -> payment.getMethod();
        });
        context.setVariable("paymentStatus", switch (payment.getStatus()) {
            case "PAID" -> "Đã thanh toán";
            case "FAILED" -> "Thanh toán thất bại";
            case "REFUNDED" -> "Đã hoàn tiền";
            default -> "Chờ xác nhận thanh toán";
        });
        context.setVariable("orderUrl", baseUrl.replaceAll("/+$", "") + "/orders/" + order.getId());
        var message = mailSender.createMimeMessage();
        try {
            var helper = new MimeMessageHelper(message, false, "UTF-8");
            if (sender != null && !sender.isBlank()) helper.setFrom(sender);
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("[T-Winkle] Đơn hàng " + order.getOrderCode() + " đã được giao thành công");
            helper.setText(templates.process("mail/order-delivered", context), true);
        } catch (jakarta.mail.MessagingException failure) {
            throw new org.springframework.mail.MailPreparationException("Unable to prepare delivery notification", failure);
        }
        mailSender.send(message);
    }
}
