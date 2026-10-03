package cyan.project.twinkle.controller;

import cyan.project.twinkle.service.StorefrontStoreService;
import cyan.project.twinkle.service.StorefrontProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StorefrontStoreController {
    
    private final StorefrontStoreService storeService;
    private final StorefrontProductService productService;

    @GetMapping
    public String stores(Model model) {
        model.addAttribute("stores", storeService.getAllStores());
        return "storefront/store/list";
    }

    @GetMapping("/{slug}")
    public String storeDetail(@PathVariable String slug, Model model) {
        model.addAttribute("store", storeService.getStoreBySlug(slug));
        return "storefront/store/detail";
    }

    @GetMapping("/{slug}/catagories") // Giữ đúng route sai chính tả từ source gốc UI
    public String storeProducts(@PathVariable String slug,
                                @RequestParam(required = false) String category,
                                @RequestParam(defaultValue = "0") int page,
                                Model model) {
        model.addAttribute("store", storeService.getStoreBySlug(slug));
        model.addAttribute("products", productService.getProducts(null, category, null, "popular", page)); 
        return "storefront/store/categories";
    }
}
