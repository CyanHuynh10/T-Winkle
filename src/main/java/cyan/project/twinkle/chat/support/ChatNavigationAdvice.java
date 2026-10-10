package cyan.project.twinkle.chat.support;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@ControllerAdvice
public class ChatNavigationAdvice {
    @ModelAttribute("storeInboxPath")
    public String inboxPath(Authentication auth){return role(auth,"ADMIN")?"/admin/support":role(auth,"SUPPORT")?"/support":"/manager/support";}
    @ModelAttribute("canUseAiChat")
    public boolean ai(Authentication auth) { return role(auth,"USER"); }
    @ModelAttribute("canUseStoreInbox")
    public boolean staff(Authentication auth) { return role(auth,"MANAGER") || role(auth,"SUPPORT") || role(auth,"ADMIN"); }
    private boolean role(Authentication auth,String role) {
        return auth!=null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_"+role));
    }
}
