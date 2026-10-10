package cyan.project.twinkle.controller;

import cyan.project.twinkle.service.AuthService;
import cyan.project.twinkle.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.security.Principal;

@Controller @RequiredArgsConstructor
public class SettingsController {
    private final AuthService auth;
    private final UserRepository users;
    @GetMapping("/settings")
    public String settings(HttpSession session, Model model) {
        model.addAttribute("awaitingOtp", session.getAttribute("PASSWORD_CHANGE_HASH") != null);
        return "storefront/user/settings";
    }
    @PostMapping("/settings/password/request")
    public String request(Principal actor, @RequestParam String currentPassword, @RequestParam String newPassword,
                          @RequestParam String confirmPassword, HttpSession session, RedirectAttributes flash) {
        try {
            var original = users.findByEmail(actor.getName()).orElseThrow().getPasswordHash();
            var hash = auth.requestPasswordChange(actor.getName(), currentPassword, newPassword, confirmPassword);
            session.setAttribute("PASSWORD_CHANGE_HASH", hash);
            session.setAttribute("PASSWORD_CHANGE_ORIGINAL", original);
            session.setAttribute("PASSWORD_CHANGE_EMAIL", actor.getName());
            flash.addFlashAttribute("success", "Mã OTP đã được gửi đến email của bạn");
        } catch (Exception e) { flash.addFlashAttribute("error", e instanceof RuntimeException ? "Chưa thể gửi OTP, vui lòng thử lại" : e.getMessage()); }
        return "redirect:/settings";
    }
    @PostMapping("/settings/password/confirm")
    public String confirm(Principal actor, @RequestParam String otp, HttpServletRequest request, RedirectAttributes flash) {
        var session = request.getSession();
        try {
            if (!actor.getName().equals(session.getAttribute("PASSWORD_CHANGE_EMAIL"))) throw new Exception("Yêu cầu đổi mật khẩu không hợp lệ");
            auth.confirmPasswordChange(actor.getName(), otp, (String) session.getAttribute("PASSWORD_CHANGE_HASH"), (String) session.getAttribute("PASSWORD_CHANGE_ORIGINAL"));
            new org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler().logout(request, null, null);
            return "redirect:/login?passwordChanged";
        } catch (Exception e) { flash.addFlashAttribute("error", e instanceof RuntimeException ? "Chưa thể đổi mật khẩu, vui lòng thử lại" : e.getMessage()); return "redirect:/settings"; }
    }
}
