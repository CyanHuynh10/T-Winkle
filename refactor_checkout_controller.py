import re

path = 'src/main/java/cyan/project/twinkle/controller/StorefrontCheckoutController.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

import_replacement = """import cyan.project.twinkle.dto.CheckoutForm;
import cyan.project.twinkle.entity.Order;
import cyan.project.twinkle.entity.CartItem;
import cyan.project.twinkle.entity.UserAddress;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.CheckoutService;
import cyan.project.twinkle.service.CartService;
import cyan.project.twinkle.repository.UserAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
"""

content = re.sub(r'import cyan.project.twinkle.dto.CheckoutForm;.*?import org.springframework.web.bind.annotation.\*;', import_replacement, content, flags=re.DOTALL)

controller_replacement = """
    private final CheckoutService checkoutService;
    private final CartService cartService;
    private final UserAddressRepository userAddressRepository;

    @GetMapping
    public String checkoutPage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Model model) {
        if (userDetails == null) return "redirect:/login";
        
        List<CartItem> allItems = cartService.getCartItems(userDetails.getUsername());
        List<CartItem> selectedItems = allItems.stream().filter(CartItem::getSelected).collect(Collectors.toList());
        if (selectedItems.isEmpty()) return "redirect:/cart";
        
        List<UserAddress> addresses = userAddressRepository.findByUserEmail(userDetails.getUsername());
        
        model.addAttribute("selectedItems", selectedItems);
        model.addAttribute("addresses", addresses);
        model.addAttribute("checkoutForm", new CheckoutForm());
        return "storefront/checkout/checkout";
    }
"""

content = re.sub(r'private final CheckoutService checkoutService;.*?return "storefront/checkout/checkout";\s*}', controller_replacement, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated StorefrontCheckoutController.java")
