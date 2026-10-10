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
    private final cyan.project.twinkle.repository.ReviewRepository reviews;
    private final cyan.project.twinkle.repository.PaymentRepository payments;

    @ExceptionHandler(cyan.project.twinkle.exception.BusinessRuleException.class)
    public String failure(cyan.project.twinkle.exception.BusinessRuleException ex, org.springframework.web.servlet.mvc.support.RedirectAttributes flash) {
        flash.addFlashAttribute("error",ex.getMessage());return "redirect:/orders";
    }

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
        model.addAttribute("payment", payments.findByOrderId(id).orElse(null));
        model.addAttribute("pendingCancellation", orderService.hasPendingCancellation(id));
        model.addAttribute("reviewedProducts", reviews.findReviewedProductIds(userDetails.getUsername()));
        return "storefront/order/detail";
    }

    @GetMapping("/{id}/tracking")
    public String orderTracking(@PathVariable Long id,
                                @AuthenticationPrincipal CustomUserDetails userDetails,
                                Model model) {
        if (userDetails == null) return "redirect:/login";
        var order = orderService.getOrderDetail(id, userDetails.getUsername());
        var history = orderService.getOrderTracking(id, userDetails.getUsername());
        model.addAttribute("order", order);
        model.addAttribute("trackingHistory", history);
        var stages = new java.util.ArrayList<cyan.project.twinkle.dto.TrackingStage>();
        for (int i=0; i<history.size(); i++) {
            var event = history.get(i);
            String color = cyan.project.twinkle.service.OrderStatus.of(event.getStatus()).style();
            stages.add(new cyan.project.twinkle.dto.TrackingStage(event.getStatus(),event.getCreatedAt(),event.getNote(),color,true,
                    i == history.size()-1 && event.getStatus().equals(order.getStatus())));
        }
        if (!"Đã hủy".equals(order.getStatus())) {
            var sequence = cyan.project.twinkle.service.OrderStatus.sequence(order.getFulfillmentMode());
            int current = sequence.indexOf(order.getStatus());
            if (current >= 0) for (int i=current+1; i<sequence.size(); i++) {
                String next = sequence.get(i);
                if (history.stream().noneMatch(h -> h.getStatus().equals(next))) stages.add(new cyan.project.twinkle.dto.TrackingStage(next,null,"Chưa diễn ra","future",false,false));
            }
        }
        model.addAttribute("trackingStages",stages);
        model.addAttribute("orderId", id);
        model.addAttribute("pendingCancellation", orderService.hasPendingCancellation(id));
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
