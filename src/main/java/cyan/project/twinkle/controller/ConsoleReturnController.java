package cyan.project.twinkle.controller;
import cyan.project.twinkle.service.ConsoleReturnService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
@Controller
public class ConsoleReturnController {
 private final ConsoleReturnService returns;
 public ConsoleReturnController(ConsoleReturnService returns){this.returns=returns;}
 @PostMapping("/console-storefront/enter")
 public String enter(HttpServletRequest request,Authentication auth){
  if(!returns.enter(request.getSession(),auth))throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN);
  return "redirect:/";
 }
 @GetMapping("/console-storefront/return")
 public String back(HttpServletRequest request,Authentication auth){return "redirect:"+returns.finish(request.getSession(false),auth);}
}
