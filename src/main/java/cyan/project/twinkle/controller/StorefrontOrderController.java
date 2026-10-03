package cyan.project.twinkle.controller;

import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/orders")
@RequiredArgsConstructor
public class StorefrontOrderController {

    private final OrderService orderService;

    @GetMapping
    public String orderHistory(@RequestParam(defaultValue = "0") int page,
                               @AuthenticationPrincipal CustomUserDetails userDetails,
                               Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("orderPage", orderService.getUserOrders(userDetails.getUsername(), page));
        return "storefront/order/history";
    }

    @GetMapping("/{id}")
    public String orderDetail(@PathVariable Long id,
                              @AuthenticationPrincipal CustomUserDetails userDetails,
                              Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("order", orderService.getOrderDetail(id, userDetails.getUsername()));
        return "storefront/order/detail";
    }

    @GetMapping("/{id}/tracking")
    public String orderTracking(@PathVariable Long id,
                                @AuthenticationPrincipal CustomUserDetails userDetails,
                                Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("order", orderService.getOrderDetail(id, userDetails.getUsername()));
        model.addAttribute("trackingHistory", orderService.getOrderTracking(id, userDetails.getUsername()));
        return "storefront/order/tracking";
    }

    @PostMapping("/{id}/cancel")
    public String cancelOrder(@PathVariable Long id,
                              @RequestParam(required = false) String reason,
                              @RequestParam(required = false) String otherReason,
                              @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        orderService.cancelOrder(id, userDetails.getUsername(), reason, otherReason);
        return "redirect:/orders/" + id;
    }
}
