package cyan.project.twinkle.controller;

import cyan.project.twinkle.dto.CheckoutForm;
import cyan.project.twinkle.entity.Order;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/checkout")
@RequiredArgsConstructor
public class StorefrontCheckoutController {

    private final CheckoutService checkoutService;

    @GetMapping
    public String checkoutPage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("checkoutForm", new CheckoutForm());
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
