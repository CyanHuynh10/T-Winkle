import re

path = 'src/main/java/cyan/project/twinkle/component/GlobalModelAttributes.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

import_replacement = """package cyan.project.twinkle.component;

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

    @Autowired
    private CartService cartService;
    
    @Autowired
    private StorefrontUserService userService;
"""

content = re.sub(r'package cyan.project.twinkle.component;.*?public class GlobalModelAttributes \{', import_replacement, content, flags=re.DOTALL)

methods_replacement = """
    @ModelAttribute("cartCount")
    public int cartCount(Authentication authentication) {
        if (isAuthenticated(authentication)) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails customUserDetails) {
                return cartService.getCartItems(customUserDetails.getUsername()).stream()
                        .mapToInt(cyan.project.twinkle.entity.CartItem::getQuantity)
                        .sum();
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
"""

content = re.sub(r'\}\s*$', methods_replacement, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated GlobalModelAttributes.java")
