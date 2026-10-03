package cyan.project.twinkle.controller;

import cyan.project.twinkle.dto.CheckoutForm;
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


@Controller
@RequestMapping("/checkout")
@RequiredArgsConstructor
public class StorefrontCheckoutController {

    
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
        
        java.math.BigDecimal subtotal = selectedItems.stream()
                .map(item -> item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("shippingFee", java.math.BigDecimal.valueOf(30000));
        model.addAttribute("total", subtotal.add(java.math.BigDecimal.valueOf(30000)));

        return "storefront/checkout/checkout";
    }


    @PostMapping("/process")
    public String processCheckout(
            @ModelAttribute CheckoutForm form,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) return "redirect:/login";

        Order order = checkoutService.processCheckout(
                userDetails.getUsername(),
                form
        );

        return "redirect:/orders/" + order.getId();
    }
}
