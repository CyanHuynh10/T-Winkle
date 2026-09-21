package cyan.project.twinkle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping({"", "/", "/dashboard"})
    public String dashboard(Model model) {
        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String users(Model model) {
        return "admin/user/list";
    }

    @GetMapping("/managers")
    public String managers(Model model) {
        return "admin/manager/list";
    }

    @GetMapping("/stores")
    public String stores(Model model) {
        return "admin/store/list";
    }

    @GetMapping("/brands")
    public String brands(Model model) {
        return "admin/brand/list";
    }

    @GetMapping("/categories")
    public String categories(Model model) {
        return "admin/category/list";
    }

    @GetMapping("/products")
    public String products(Model model) {
        return "admin/product/list";
    }

    @GetMapping("/inventory")
    public String inventory(Model model) {
        return "admin/inventory/list";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        return "admin/order/list";
    }

    @GetMapping("/transactions")
    public String transactions(Model model) {
        return "admin/transaction/list";
    }

    @GetMapping("/commissions")
    public String commissions(Model model) {
        return "admin/commission/index";
    }

    @GetMapping("/promotions")
    public String promotions(Model model) {
        return "admin/promotion/list";
    }

    @GetMapping("/coupons")
    public String coupons(Model model) {
        return "admin/coupon/list";
    }

    @GetMapping("/shipping")
    public String shipping(Model model) {
        return "admin/shipping/list";
    }

    @GetMapping("/chat")
    public String chatMonitor(Model model) {
        return "admin/chat/monitor";
    }

    @GetMapping("/config")
    public String systemConfig(Model model) {
        return "admin/config/index";
    }

    @GetMapping("/account")
    public String account(Model model) {
        return "admin/account/profile";
    }
}
