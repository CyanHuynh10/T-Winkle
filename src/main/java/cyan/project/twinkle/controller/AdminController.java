package cyan.project.twinkle.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class AdminController {
 @GetMapping({"/admin","/admin/","/admin/dashboard","/admin/users","/admin/stores","/admin/categories","/admin/brands","/admin/products","/admin/variants","/admin/inventory","/admin/orders","/admin/payments","/admin/promotions","/admin/coupons","/admin/support","/admin/support/{id}","/admin/history","/admin/reviews","/admin/reports"})
 public String console(){return "admin/island";}
 @GetMapping("/admin/system-config") public String history(){return "redirect:/admin/history";}
}
