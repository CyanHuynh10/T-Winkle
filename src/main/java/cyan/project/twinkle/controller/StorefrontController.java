package cyan.project.twinkle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class StorefrontController {

    @GetMapping("/")
    public String home(Model model) {
        return "index";
    }

    @GetMapping("/products/{id}")
    public String productDetail(@PathVariable String id, Model model) {
        return "storefront/product/detail";
    }

    @GetMapping("/stores")
    public String storeList(Model model) {
        return "storefront/store/list";
    }

    @GetMapping("/stores/{id}")
    public String storeDetail(@PathVariable String id, Model model) {
        model.addAttribute("storeSlug", id);
        return "storefront/store/detail";
    }

    @GetMapping({"/stores/{id}/catagories", "/stores/{id}/catagories/{category}"})
    public String storeCategories(@PathVariable String id, @PathVariable(required = false) String category, Model model) {
        model.addAttribute("storeSlug", id);
        model.addAttribute("selectedCategory", category);
        return "storefront/store/categories";
    }

    @GetMapping("/cart")
    public String cart(Model model) {
        return "storefront/cart/cart";
    }

    @GetMapping("/checkout")
    public String checkout(Model model) {
        return "storefront/checkout/checkout";
    }

    @GetMapping("/profile")
    public String profile(Model model) {
        return "storefront/user/profile";
    }

    @GetMapping("/addresses")
    public String addresses(Model model) {
        return "storefront/user/addresses";
    }

    @GetMapping("/settings")
    public String settings(Model model) {
        return "storefront/user/settings";
    }

    @GetMapping("/wishlist")
    public String wishlist(Model model) {
        return "storefront/user/wishlist";
    }

    @GetMapping("/orders")
    public String orderHistory(Model model) {
        return "storefront/order/history";
    }

    @GetMapping("/orders/{id}")
    public String orderDetail(@PathVariable String id, Model model) {
        return "storefront/order/detail";
    }

    @GetMapping("/chat")
    public String chat(Model model) {
        return "storefront/chat";
    }

    @GetMapping({"/categories", "/categories/{slug}"})
    public String categories(@PathVariable(required = false) String slug, Model model) {
        model.addAttribute("selectedCategory", slug);
        return "storefront/category/list";
    }
}
