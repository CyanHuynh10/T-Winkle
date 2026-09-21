package cyan.project.twinkle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/support")
public class SupportController {

    @GetMapping({"", "/", "/dashboard"})
    public String dashboard(Model model) {
        return "support/dashboard";
    }

    @GetMapping("/chat")
    public String chat(Model model) {
        return "support/chat";
    }

    @GetMapping("/account")
    public String account(Model model) {
        return "support/account/profile";
    }
}
