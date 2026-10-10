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
    private final cyan.project.twinkle.service.VietQrService vietQr;

    @ExceptionHandler(cyan.project.twinkle.exception.BusinessRuleException.class)
    public String failure(cyan.project.twinkle.exception.BusinessRuleException ex, org.springframework.web.servlet.mvc.support.RedirectAttributes flash) {
        flash.addFlashAttribute("error", ex.getMessage()); return "redirect:/checkout";
    }

    @GetMapping("/quote")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> quote(@RequestParam(required=false) String couponCode, @RequestParam(defaultValue="DELIVERY") String fulfillmentMode,
                                                           @AuthenticationPrincipal CustomUserDetails user) {
        if (user == null) return org.springframework.http.ResponseEntity.status(401).build();
        try {return org.springframework.http.ResponseEntity.ok(checkoutService.quote(user.getUsername(), couponCode, fulfillmentMode));}
        catch(cyan.project.twinkle.exception.BusinessRuleException ex) {return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));}
    }

    @GetMapping("/coupons")
    @ResponseBody
    public java.util.List<cyan.project.twinkle.dto.CouponOption> coupons(@AuthenticationPrincipal CustomUserDetails user) {
        return checkoutService.couponOptions(user.getUsername());
    }

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
        model.addAttribute("bankingAvailable", vietQr.available());
        var blocked = cartService.state(userDetails.getUsername()).items().stream().filter(i -> i.selected() && !i.available()).toList();
        model.addAttribute("blockedItems", blocked);
        model.addAttribute("placementAllowed", blocked.isEmpty());
        
        var quote = checkoutService.quote(userDetails.getUsername(), null);
        model.addAttribute("quote", quote);
        model.addAttribute("subtotal", quote.subtotal());
        model.addAttribute("productDiscount", quote.productDiscount());
        model.addAttribute("shippingFee", quote.shippingFee());
        model.addAttribute("total", quote.total());
        model.addAttribute("groupedItems", quote.items().stream().collect(java.util.stream.Collectors.groupingBy(
                cyan.project.twinkle.dto.CheckoutQuote.Item::storeName, java.util.LinkedHashMap::new, java.util.stream.Collectors.toList())));

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

        return "COD".equals(order.getPaymentMethod()) ? "redirect:/orders" : "redirect:/payments/" + order.getId();
    }
}
