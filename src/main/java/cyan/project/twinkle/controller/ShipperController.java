package cyan.project.twinkle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/shipper")
public class ShipperController {

    @GetMapping({"", "/", "/dashboard"})
    public String dashboard(Model model) {
        return "shipper/dashboard";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        return "shipper/order/list";
    }

    @GetMapping("/orders/123")
    public String orderDetail(Model model) {
        return "shipper/order/detail";
    }

    @GetMapping("/statistics")
    public String statistics(Model model) {
        return "shipper/statistics/index";
    }

    @GetMapping("/account")
    public String account(Model model) {
        return "shipper/account/profile";
    }
}
