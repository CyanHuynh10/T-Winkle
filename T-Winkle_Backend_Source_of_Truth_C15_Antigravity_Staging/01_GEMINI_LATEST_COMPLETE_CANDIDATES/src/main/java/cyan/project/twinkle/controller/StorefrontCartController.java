package cyan.project.twinkle.controller;

import cyan.project.twinkle.entity.CartItem;
import cyan.project.twinkle.entity.Store;
import cyan.project.twinkle.repository.CartItemRepository;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/cart")
@RequiredArgsConstructor
public class StorefrontCartController {

    private final CartService cartService;
    private final CartItemRepository cartItemRepository;

    @GetMapping
    public String viewCart(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null) return "redirect:/login";
        List<CartItem> cartItems = cartItemRepository.findByUserEmail(userDetails.getUsername());
        Map<Store, List<CartItem>> groupedCart = cartItems.stream()
                .collect(Collectors.groupingBy(CartItem::getStore));
        model.addAttribute("groupedCart", groupedCart);
        return "storefront/cart/cart";
    }

    @PostMapping("/add")
    public String addToCart(@RequestParam Long variantId,
                            @RequestParam Long storeId,
                            @RequestParam Integer quantity,
                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        cartService.addToCart(userDetails.getUser(), variantId, storeId, quantity);
        return "redirect:/cart";
    }

    @PostMapping("/update")
    public String updateQuantity(@RequestParam Long cartItemId,
                                 @RequestParam Integer quantity,
                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        cartService.updateQuantity(userDetails.getUser(), cartItemId, quantity);
        return "redirect:/cart";
    }

    @PostMapping("/toggle-select")
    public String toggleSelect(@RequestParam Long cartItemId,
                               @RequestParam Boolean isSelected,
                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        cartService.toggleSelect(userDetails.getUser(), cartItemId, isSelected);
        return "redirect:/cart";
    }

    @PostMapping("/remove")
    public String removeItem(@RequestParam Long cartItemId,
                             @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        cartService.removeCartItem(userDetails.getUser(), cartItemId);
        return "redirect:/cart";
    }
}
