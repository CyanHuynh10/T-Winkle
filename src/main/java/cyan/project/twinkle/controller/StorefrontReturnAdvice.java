package cyan.project.twinkle.controller;
import cyan.project.twinkle.service.ConsoleReturnService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
@ControllerAdvice
public class StorefrontReturnAdvice {
 private final ConsoleReturnService returns;
 public StorefrontReturnAdvice(ConsoleReturnService returns){this.returns=returns;}
 @ModelAttribute
 public void context(HttpServletRequest request,Authentication auth,Model model){
  model.addAttribute("storefrontConsoleReturn",returns.active(request.getSession(false),auth));
 }
}
