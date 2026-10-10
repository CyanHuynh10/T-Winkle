package cyan.project.twinkle.component;

import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.CartService;
import cyan.project.twinkle.service.StorefrontUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalModelAttributes {
    @ModelAttribute("showFloatingActions")
    public boolean floatingActions(HttpServletRequest request) {
        String path=request.getRequestURI().substring(request.getContextPath().length());
        return !path.startsWith("/chat") && !path.startsWith("/manager") && !path.startsWith("/admin") && !path.startsWith("/support");
    }
    @ModelAttribute("currentAvatarUrl")
    public String currentAvatarUrl(Authentication authentication) {
        if (isAuthenticated(authentication) && authentication.getPrincipal() instanceof CustomUserDetails user) {
            return user.getAvatarUrl();
        }
        return null;
    }

    @Autowired
    private CartService cartService;
    
    @Autowired
    private StorefrontUserService userService;


    @ModelAttribute("isAuthenticated")
    public boolean isAuthenticated(Authentication authentication) {
        return authentication != null 
                && authentication.isAuthenticated() 
                && !(authentication instanceof AnonymousAuthenticationToken);
    }

    @ModelAttribute("currentUsername")
    public String currentUsername(Authentication authentication) {
        if (isAuthenticated(authentication)) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails customUserDetails) {
                return customUserDetails.getDisplayName();
            }
            return null;
        }
        return null;
    }

    @ModelAttribute("isAuthPage")
    public boolean isAuthPage(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri == null) return false;
        return uri.startsWith("/login") || 
               uri.startsWith("/register") || 
               uri.startsWith("/otp") || 
               uri.startsWith("/forgot-password") || 
               uri.startsWith("/reset-password");
    }


    @ModelAttribute("cartCount")
    public long cartCount(Authentication authentication) {
        if (isAuthenticated(authentication)) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails customUserDetails) {
                return cartService.quantityCount(customUserDetails.getUsername());
            }
        }
        return 0;
    }

    @ModelAttribute("wishlistCount")
    public int wishlistCount(Authentication authentication) {
        if (isAuthenticated(authentication)) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails customUserDetails) {
                return (int) userService.getWishlist(customUserDetails.getUsername(), 0).getTotalElements();
            }
        }
        return 0;
    }
}
