package cyan.project.twinkle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/manager")
public class ManagerController {

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
