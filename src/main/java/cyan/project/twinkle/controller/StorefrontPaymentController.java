package cyan.project.twinkle.controller;

import cyan.project.twinkle.config.BankTransferProperties;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.BankPaymentService;
import cyan.project.twinkle.service.VietQrService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/payments")
@RequiredArgsConstructor
public class StorefrontPaymentController {
    private final BankPaymentService payments;
    private final BankTransferProperties bank;
    private final VietQrService vietQr;

    /** Existing canonical order-ID route; GET never settles or creates commerce records. */
    @GetMapping("/{orderId}")
    public String page(@PathVariable Long orderId, @AuthenticationPrincipal CustomUserDetails user,
                       jakarta.servlet.http.HttpServletResponse response, Model model) {
        var payment = payments.ownedByOrder(orderId, user.getUsername());
        if (!"BANKING".equals(payment.getMethod())) return "redirect:/orders/" + orderId;
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Referrer-Policy", "no-referrer");
        model.addAttribute("order", payment.getOrder());model.addAttribute("payment", payment);model.addAttribute("bank", bank);
        if ("PENDING".equals(payment.getStatus())) {
            try { model.addAttribute("qrUrl", vietQr.imageUrl(payment.getOrder())); }
            catch (BusinessRuleException ex) { model.addAttribute("paymentError", ex.getMessage()); }
        }
        return "storefront/checkout/payment";
    }

    @GetMapping("/manage")
    public String management(@AuthenticationPrincipal CustomUserDetails user, Model model) {
        model.addAttribute("payments", payments.manageable(user.getUsername()));
        return "storefront/checkout/payment-management";
    }

    @PostMapping("/manage/{paymentId}/confirm")
    public String confirm(@PathVariable Long paymentId, @AuthenticationPrincipal CustomUserDetails actor,
                          org.springframework.web.servlet.mvc.support.RedirectAttributes flash) {
        payments.confirm(paymentId, actor.getUsername());
        flash.addFlashAttribute("success", "Đã xác nhận nhận tiền chuyển khoản.");
        return "redirect:/payments/manage";
    }
}
