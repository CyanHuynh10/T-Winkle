package cyan.project.twinkle.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.core.Authentication;
@Controller public class SupportController {
 private final cyan.project.twinkle.chat.support.SupportAuthorizationService access;
 public SupportController(cyan.project.twinkle.chat.support.SupportAuthorizationService access){this.access=access;}
 @GetMapping({"/support","/support/","/support/reviews","/support/conversations/{id}"}) public String console(@PathVariable(required=false) Long id,Authentication auth){if(id!=null)access.require(id,auth);return "console/page";}
 @GetMapping("/support/inbox") public String legacy(){return "redirect:/support";}
}
