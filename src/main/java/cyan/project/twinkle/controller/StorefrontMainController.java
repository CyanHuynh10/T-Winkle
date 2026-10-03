package cyan.project.twinkle.controller;

import cyan.project.twinkle.repository.CategoryRepository;
import cyan.project.twinkle.repository.BrandRepository;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.StorefrontProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class StorefrontMainController {

    private final StorefrontProductService productService;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @GetMapping("/")
    public String home(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        model.addAttribute("newestProducts", productService.getNewestProducts(3, email));
        model.addAttribute("popularProducts", productService.getProducts(null, null, null, "popular", 0, email).getContent());
        model.addAttribute("saleProducts", productService.getProducts(null, null, null, "priceAsc", 0, email).getContent());
        model.addAttribute("categories", categoryRepository.findAll());
        return "index";
    }

    @GetMapping("/categories")
    public String categories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String brand,
            @RequestParam(defaultValue = "popular") String sort,
            @RequestParam(defaultValue = "0") int page, 
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Model model) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        model.addAttribute("products", productService.getProducts(keyword, null, brand, sort, page, email));
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("brands", brandRepository.findAll());
        return "storefront/category/list";
    }

    @GetMapping("/categories/{slug}")
    public String categoryBySlug(
            @PathVariable String slug,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String brand,
            @RequestParam(defaultValue = "popular") String sort,
            @RequestParam(defaultValue = "0") int page, 
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Model model) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        model.addAttribute("products", productService.getProducts(keyword, slug, brand, sort, page, email));
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("brands", brandRepository.findAll());
        model.addAttribute("currentCategory", slug);
        return "storefront/category/list";
    }

    @GetMapping("/products/{id}")
    public String productDetailModal(@PathVariable Integer id, 
                                     @AuthenticationPrincipal CustomUserDetails userDetails, 
                                     Model model) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        model.addAttribute("productDTO", productService.getProductDetailDTO(id, email));
        // Return exactly the canonical fragment existing in the frozen UI
        return "storefront/category/list :: product-detail-modal";
    }
}
