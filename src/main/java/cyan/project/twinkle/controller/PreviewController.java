package cyan.project.twinkle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PreviewController {

    @GetMapping("/ui-preview")
    public String previewHub(Model model) {
        return "ui-preview";
    }

    @GetMapping("/test-card")
    public String testCard() {
        return "test-card";
    }
}
