package cyan.project.twinkle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/manager")
@lombok.RequiredArgsConstructor
public class ManagerController {
    private final cyan.project.twinkle.service.OrderFulfillmentService fulfillmentService;

    @org.springframework.web.bind.annotation.PostMapping("/orders/{id}/status")
    public String updateOrderStatus(@PathVariable Long id, @org.springframework.web.bind.annotation.RequestParam String status,
            @org.springframework.security.core.annotation.AuthenticationPrincipal cyan.project.twinkle.security.CustomUserDetails actor,
            org.springframework.web.servlet.mvc.support.RedirectAttributes flash) {
        try {fulfillmentService.transition(id, actor.getUsername(), status);flash.addFlashAttribute("success", "Đã cập nhật trạng thái đơn hàng.");}
        catch(cyan.project.twinkle.exception.BusinessRuleException ex) {flash.addFlashAttribute("error", ex.getMessage());}
        return "redirect:/manager/orders/" + id;
    }

    @GetMapping({"", "/", "/dashboard"})
    public String dashboard(Model model) {
        return "manager/dashboard";
    }

    @GetMapping("/products")
    public String products(Model model) {
        return "manager/product/list";
    }

    @GetMapping("/products/{id}")
    public String productDetail(@PathVariable String id, Model model) {
        return "manager/product/detail";
    }

    @GetMapping("/variants")
    public String variants(Model model) {
        return "manager/variant/list";
    }

    @GetMapping("/inventory")
    public String inventory(Model model) {
        return "manager/inventory/list";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        return "manager/order/list";
    }

    @GetMapping("/orders/{id}")
    public String orderDetail(@PathVariable String id, Model model) {
        return "manager/order/detail";
    }

    @GetMapping("/revenue")
    public String revenue(Model model) {
        return "manager/revenue/index";
    }

    @GetMapping("/store")
    public String storeProfile(Model model) {
        return "manager/store/profile";
    }

    @GetMapping("/promotions")
    public String promotions(Model model) {
        return "manager/promotion/list";
    }

    @GetMapping("/shipping")
    public String shipping(Model model) {
        return "manager/shipping/index";
    }

    @GetMapping("/chat")
    public String chat(Model model) {
        return "manager/chat";
    }

    @GetMapping("/account")
    public String account(Model model) {
        return "manager/account/profile";
    }
}
