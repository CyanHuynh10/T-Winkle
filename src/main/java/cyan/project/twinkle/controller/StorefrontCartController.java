package cyan.project.twinkle.controller;

import cyan.project.twinkle.entity.CartItem;
import cyan.project.twinkle.entity.Store;
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

    @ExceptionHandler(cyan.project.twinkle.exception.BusinessRuleException.class)
    public String cartFailure(cyan.project.twinkle.exception.BusinessRuleException ex,
                             org.springframework.web.servlet.mvc.support.RedirectAttributes flash) {
        flash.addFlashAttribute("error", ex.getMessage());
        return "redirect:/cart";
    }

    @GetMapping
    public String viewCart(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null) return "redirect:/login";
        List<CartItem> cartItems = cartService.getCartItems(userDetails.getUsername());
        Map<Store, List<CartItem>> groupedCart = cartItems.stream()
                .collect(Collectors.groupingBy(CartItem::getStore));
        model.addAttribute("groupedCart", groupedCart);
        model.addAttribute("cartImages", cartService.getCartImages(cartItems));
        model.addAttribute("cartStock", cartService.getCartStock(cartItems));
        var state = cartService.state(userDetails.getUsername());
        model.addAttribute("cartState", state);
        model.addAttribute("cartAvailability", state.items().stream().collect(Collectors.toMap(cyan.project.twinkle.dto.CartState.Item::id, i -> i)));
        return "storefront/cart/cart";
    }

    @PostMapping("/add")
    public String addToCart(@RequestParam Long variantId,
                            @RequestParam(required = false) Integer productId,
                            @RequestParam Integer storeId,
                            @RequestParam Integer quantity,
                            @AuthenticationPrincipal CustomUserDetails userDetails,
                            org.springframework.web.servlet.mvc.support.RedirectAttributes flash) {
        if (userDetails == null) return "redirect:/login";
        cartService.addToCart(userDetails.getUsername(), productId, variantId, storeId, quantity);
        flash.addFlashAttribute("success", "Đã thêm sản phẩm vào giỏ hàng");
        return "redirect:/cart";
    }

    @PostMapping("/update")
    public String updateQuantity(@RequestParam Long cartItemId,
                                 @RequestParam Integer quantity,
                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        cartService.updateQuantity(userDetails.getUsername(), cartItemId, quantity);
        return "redirect:/cart";
    }

    @PostMapping("/toggle-select")
    public String toggleSelect(@RequestParam Long cartItemId,
                               @RequestParam Boolean isSelected,
                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        cartService.toggleSelect(userDetails.getUsername(), cartItemId, isSelected);
        return "redirect:/cart";
    }

    @PostMapping("/remove")
    public String removeItem(@RequestParam Long cartItemId,
                             @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        cartService.removeCartItem(userDetails.getUsername(), cartItemId);
        return "redirect:/cart";
    }

    @GetMapping("/api/state")
    @ResponseBody
    public cyan.project.twinkle.dto.CartState state(@AuthenticationPrincipal CustomUserDetails user) {
        return cartService.state(user.getUsername());
    }

    @PostMapping("/api/add")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> add(@RequestParam Integer productId,
            @RequestParam Long variantId, @RequestParam Integer storeId, @RequestParam Integer quantity,
            @AuthenticationPrincipal CustomUserDetails user) {
        try {
            cartService.addToCart(user.getUsername(), productId, variantId, storeId, quantity);
            return org.springframework.http.ResponseEntity.ok(java.util.Map.of("state", cartService.state(user.getUsername())));
        } catch (cyan.project.twinkle.exception.BusinessRuleException ex) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage(), "state", cartService.state(user.getUsername())));
        }
    }

    @PostMapping("/api/{operation}")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> mutate(@PathVariable String operation,
            @RequestParam Long cartItemId, @RequestParam(required=false) Integer quantity,
            @RequestParam(required=false) Boolean isSelected, @AuthenticationPrincipal CustomUserDetails user) {
        try {
            switch (operation) {
                case "update" -> cartService.updateQuantity(user.getUsername(), cartItemId, quantity);
                case "select" -> cartService.toggleSelect(user.getUsername(), cartItemId, isSelected);
                case "remove" -> cartService.removeCartItem(user.getUsername(), cartItemId);
                default -> throw new cyan.project.twinkle.exception.BusinessRuleException("Thao tác giỏ hàng không hợp lệ");
            }
            return org.springframework.http.ResponseEntity.ok(java.util.Map.of("state", cartService.state(user.getUsername())));
        } catch (cyan.project.twinkle.exception.BusinessRuleException ex) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage(), "state", cartService.state(user.getUsername())));
        }
    }
}
