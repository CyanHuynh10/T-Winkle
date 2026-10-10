package cyan.project.twinkle.chat.support;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;

@Controller @RequiredArgsConstructor
public class ChatPageController {
    private final SupportAuthorizationService access;
    @GetMapping("/chat")
    public String ai(Model model) { model.addAttribute("chatMode","ai"); return "chat/island"; }
    @GetMapping("/chat/start/{storeId}")
    public String start(@PathVariable int storeId, Model model) {
        model.addAttribute("chatMode","ai"); model.addAttribute("startStoreId",storeId); return "chat/island";
    }
    @GetMapping("/chat/store/{id}")
    public String user(@PathVariable long id,Model model,Authentication auth) {
        access.require(id,auth); model.addAttribute("chatMode","support"); model.addAttribute("conversationId",id); return "chat/island";
    }
}
