package cyan.project.twinkle.controller;

import cyan.project.twinkle.dto.CheckoutForm;
import cyan.project.twinkle.entity.Order;
import cyan.project.twinkle.entity.User;
import cyan.project.twinkle.repository.CategoryRepository;
import cyan.project.twinkle.repository.ProductRepository;
import cyan.project.twinkle.repository.StoreRepository;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class StorefrontController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    private final CheckoutService checkoutService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("newestProducts", productRepository.findAll(
                PageRequest.of(0, 8, Sort.by("id").descending())).getContent());
        model.addAttribute("categories", categoryRepository.findAll());
        return "storefront/home";
    }

    @GetMapping("/categories")
    public String categories(@RequestParam(defaultValue = "0") int page, Model model) {
        model.addAttribute("products", productRepository.findAll(PageRequest.of(page, 12)));
        model.addAttribute("categories", categoryRepository.findAll());
        return "storefront/categories";
    }

    @GetMapping("/products/{id}")
    public String productDetail(@PathVariable Long id, Model model) {
        model.addAttribute("product", productRepository.findById(id).orElseThrow());
        return "storefront/product-detail";
    }

    @GetMapping("/stores")
    public String stores(Model model) {
        model.addAttribute("stores", storeRepository.findAll());
        return "storefront/stores";
    }

    @GetMapping("/checkout")
    public String checkoutPage(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("checkoutForm", new CheckoutForm());
        return "storefront/checkout";
    }

    @PostMapping("/checkout/process")
    public String processCheckout(@ModelAttribute CheckoutForm form, 
                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        Order order = checkoutService.processCheckout(userDetails.getUser(), form);
        return "redirect:/orders/" + order.getId();
    }
}
