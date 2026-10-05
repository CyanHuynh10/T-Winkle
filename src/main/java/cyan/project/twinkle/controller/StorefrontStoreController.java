package cyan.project.twinkle.controller;

import cyan.project.twinkle.service.StorefrontStoreService;
import cyan.project.twinkle.service.StorefrontProductService;
import lombok.RequiredArgsConstructor;
import cyan.project.twinkle.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StorefrontStoreController {
    
    private final StorefrontStoreService storeService;
    private final StorefrontProductService productService;
    private final cyan.project.twinkle.repository.CategoryRepository categoryRepository;

    @GetMapping
    public String stores(@RequestParam(required = false) String keyword, Model model) {
        model.addAttribute("stores", storeService.searchStores(keyword));
        model.addAttribute("keyword", keyword);
        model.addAttribute("totalStoreCount", storeService.getTotalStoreCount());
        return "storefront/store/list";
    }

    @GetMapping("/{slug}")
    public String storeDetail(@PathVariable String slug, Model model) {
        model.addAttribute("store", storeService.getStoreBySlug(slug));
        return "storefront/store/detail";
    }

    @GetMapping({"/{slug}/catagories", "/{slug}/catagories/{categorySlug}"}) // Giữ đúng route sai chính tả từ source gốc UI
    public String storeProducts(@PathVariable String slug,
                                @PathVariable(required = false) String categorySlug,
                                @RequestParam(required = false) String category,
                                @RequestParam(required = false) String keyword,
                                @RequestParam(required = false) String sort,
                                @RequestParam(defaultValue = "0") int page,
                                @AuthenticationPrincipal CustomUserDetails userDetails,
                                Model model) {
        category = categorySlug != null ? categorySlug : category;
        model.addAttribute("keyword", keyword);
        model.addAttribute("sort", sort);
        model.addAttribute("store", storeService.getStoreBySlug(slug));
        model.addAttribute("products", productService.getStoreProducts(slug, category, keyword, sort, page, userDetails != null ? userDetails.getUsername() : null)); 
        model.addAttribute("categories", categoryRepository.findStoreCategories(slug));
        model.addAttribute("selectedCategory", category);
        model.addAttribute("currentUri", "/stores/" + slug + "/catagories" + (category != null ? "/" + category : ""));
        return "storefront/category/list";
    }
}
