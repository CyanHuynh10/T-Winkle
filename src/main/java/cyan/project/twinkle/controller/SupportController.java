package cyan.project.twinkle.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller public class SupportController {
 @GetMapping({"/support","/support/","/support/reviews","/support/conversations/{id}"}) public String console(){return "support/island";}
 @GetMapping("/support/inbox") public String legacy(){return "redirect:/support";}
}
