package cyan.project.twinkle.controller;

import cyan.project.twinkle.dto.ForgotPasswordRequest;
import cyan.project.twinkle.dto.OtpRequest;
import cyan.project.twinkle.dto.RegisterRequest;
import cyan.project.twinkle.dto.ResetPasswordRequest;
import cyan.project.twinkle.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                            @RequestParam(value = "logout", required = false) String logout,
                            HttpSession session, Model model) {
        if (error != null) {
            Exception exception = (Exception) session.getAttribute("SPRING_SECURITY_LAST_EXCEPTION");
            if (exception != null && exception.getMessage() != null && exception.getMessage().contains("tạm khóa")) {
                model.addAttribute("error", exception.getMessage());
            } else {
                model.addAttribute("error", "Email hoặc mật khẩu không chính xác.");
            }
        }
        if (logout != null) {
            model.addAttribute("success", "Đăng xuất thành công.");
        }
        return "auth/login";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "auth/register";
    }

    @PostMapping("/register")
    public String processRegister(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                                  BindingResult bindingResult, HttpSession session, Model model, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            String errorMsg = bindingResult.getAllErrors().get(0).getDefaultMessage();
            model.addAttribute("error", errorMsg);
            return "auth/register";
        }
        try {
            authService.registerUser(request);
            session.setAttribute("AUTH_FLOW_EMAIL", request.getEmail());
            session.setAttribute("AUTH_FLOW_TYPE", "REGISTER");
            redirectAttributes.addFlashAttribute("success", "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để nhập mã OTP.");
            return "redirect:/otp";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "auth/register";
        }
    }

    @GetMapping("/otp")
    public String otpPage(HttpSession session, Model model) {
        String email = (String) session.getAttribute("AUTH_FLOW_EMAIL");
        String type = (String) session.getAttribute("AUTH_FLOW_TYPE");
        if (email == null || type == null) {
            return "redirect:/login";
        }
        OtpRequest otpRequest = new OtpRequest();
        otpRequest.setEmail(email);
        model.addAttribute("otpRequest", otpRequest);
        return "auth/otp";
    }

    @PostMapping("/otp")
    public String processOtp(@Valid @ModelAttribute("otpRequest") OtpRequest request,
                             BindingResult bindingResult, HttpSession session, Model model, RedirectAttributes redirectAttributes, HttpServletRequest httpServletRequest) {
        String email = (String) session.getAttribute("AUTH_FLOW_EMAIL");
        String type = (String) session.getAttribute("AUTH_FLOW_TYPE");

        if (email == null || type == null) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            String errorMsg = bindingResult.getAllErrors().get(0).getDefaultMessage();
            model.addAttribute("error", errorMsg);
            return "auth/otp";
        }

        try {
            authService.verifyOtp(email, request.getOtpCode(), type);
            if ("REGISTER".equals(type)) {
                session.removeAttribute("AUTH_FLOW_EMAIL");
                session.removeAttribute("AUTH_FLOW_TYPE");
                redirectAttributes.addFlashAttribute("success", "Xác thực tài khoản thành công. Vui lòng đăng nhập.");
                return "redirect:/login";
            } else if ("FORGOT_PASSWORD".equals(type)) {
                String resetToken = authService.generateResetTokenAfterOtp(email);
                session.removeAttribute("AUTH_FLOW_EMAIL");
                session.removeAttribute("AUTH_FLOW_TYPE");
                String baseUrl = org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
                redirectAttributes.addFlashAttribute("success", "Xác thực OTP thành công. Vui lòng tạo mật khẩu mới.");
                return "redirect:" + baseUrl + "/reset-password?token=" + resetToken + "&email=" + email;
            }
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            request.setEmail(email);
            return "auth/otp";
        }
        return "redirect:/login";
    }

    @PostMapping("/otp/resend")
    public String resendOtp(HttpSession session, RedirectAttributes redirectAttributes) {
        String email = (String) session.getAttribute("AUTH_FLOW_EMAIL");
        String type = (String) session.getAttribute("AUTH_FLOW_TYPE");
        if (email == null || type == null) {
            return "redirect:/login";
        }
        try {
            authService.resendOtp(email, type);
            redirectAttributes.addFlashAttribute("success", "Mã OTP mới đã được gửi đến email của bạn.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/otp";
    }

    @GetMapping("/forgot-password")
    public String forgotPasswordPage(Model model) {
        model.addAttribute("forgotPasswordRequest", new ForgotPasswordRequest());
        return "auth/forgot-password";
    }

    @PostMapping("/forgot-password")
    public String processForgotPassword(@Valid @ModelAttribute("forgotPasswordRequest") ForgotPasswordRequest request,
                                        BindingResult bindingResult, HttpSession session, Model model, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            String errorMsg = bindingResult.getAllErrors().get(0).getDefaultMessage();
            model.addAttribute("error", errorMsg);
            return "auth/forgot-password";
        }
        try {
            authService.processForgotPassword(request.getEmail());
        } catch (Exception ignored) {
        }
        session.setAttribute("AUTH_FLOW_EMAIL", request.getEmail());
        session.setAttribute("AUTH_FLOW_TYPE", "FORGOT_PASSWORD");
        redirectAttributes.addFlashAttribute("success", "Nếu email tồn tại trong hệ thống, mã OTP xác nhận đã được gửi.");
        return "redirect:/otp";
    }

    @GetMapping("/reset-password")
    public String resetPasswordPage(@RequestParam("token") String token, @RequestParam("email") String email, Model model) {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken(token);
        request.setEmail(email);
        model.addAttribute("resetPasswordRequest", request);
        return "auth/reset-password";
    }

    @PostMapping("/reset-password")
    public String processResetPassword(@Valid @ModelAttribute("resetPasswordRequest") ResetPasswordRequest request,
                                       BindingResult bindingResult, Model model, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            String errorMsg = bindingResult.getAllErrors().get(0).getDefaultMessage();
            model.addAttribute("error", errorMsg);
            return "auth/reset-password";
        }
        try {
            authService.resetPassword(request);
            redirectAttributes.addFlashAttribute("success", "Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập.");
            return "redirect:/login";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "auth/reset-password";
        }
    }
}
