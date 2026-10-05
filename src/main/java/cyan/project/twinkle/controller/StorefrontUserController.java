package cyan.project.twinkle.controller;

import cyan.project.twinkle.dto.AddressForm;
import cyan.project.twinkle.dto.ProfileUpdateForm;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.security.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.SecurityContextRepository;
import cyan.project.twinkle.service.StorefrontUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class StorefrontUserController {

    private final StorefrontUserService userService;
    private final CustomUserDetailsService userDetailsService;
    private final SecurityContextRepository securityContextRepository;
    private final cyan.project.twinkle.service.StorefrontProductService productService;

    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("user", userService.getUserByEmail(userDetails.getUsername()));
        return "storefront/user/profile";
    }

    @PostMapping("/profile/update")
    public String updateProfile(@jakarta.validation.Valid @ModelAttribute ProfileUpdateForm form,
                                org.springframework.validation.BindingResult binding,
                                @RequestParam(required = false) org.springframework.web.multipart.MultipartFile avatar,
                                @AuthenticationPrincipal CustomUserDetails userDetails,
                                HttpServletRequest request,
                                HttpServletResponse response,
                                org.springframework.web.servlet.mvc.support.RedirectAttributes flash) {
        if (userDetails == null) return "redirect:/login";
        if (binding.hasErrors()) {
            flash.addFlashAttribute("error", binding.getAllErrors().get(0).getDefaultMessage());
            return "redirect:/profile";
        }
        try {
            userService.updateProfile(userDetails.getUsername(), form, avatar);
        } catch (cyan.project.twinkle.exception.BusinessRuleException ex) {
            flash.addFlashAttribute("error", ex.getMessage());
            return "redirect:/profile";
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            flash.addFlashAttribute("error", "Không thể cập nhật hồ sơ. Username có thể đã tồn tại.");
            return "redirect:/profile";
        }

        UserDetails updatedUserDetails =
                userDetailsService.loadUserByUsername(userDetails.getUsername());

        if (updatedUserDetails instanceof CredentialsContainer credentialsContainer) {
            credentialsContainer.eraseCredentials();
        }

        Authentication newAuth = new UsernamePasswordAuthenticationToken(
                updatedUserDetails,
                null,
                updatedUserDetails.getAuthorities()
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(newAuth);
        SecurityContextHolder.setContext(context);

        securityContextRepository.saveContext(context, request, response);

        flash.addFlashAttribute("success", "Cập nhật thông tin thành công!");
        return "redirect:/profile";
    }

    @GetMapping("/addresses")
    public String addresses(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("addresses", userService.getUserAddresses(userDetails.getUsername()));
        return "storefront/user/addresses";
    }

    @PostMapping("/addresses/save")
    public String saveAddress(@ModelAttribute AddressForm form,
                              @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        userService.saveAddress(userDetails.getUsername(), form);
        return "redirect:/addresses";
    }

    @PostMapping("/addresses/default/{id}")
    public String setDefaultAddress(@PathVariable Long id,
                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        userService.setDefaultAddress(userDetails.getUsername(), id);
        return "redirect:/addresses";
    }

    @PostMapping("/addresses/delete/{id}")
    public String deleteAddress(@PathVariable Long id,
                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        userService.deleteAddress(userDetails.getUsername(), id);
        return "redirect:/addresses";
    }

    @GetMapping("/wishlist")
    public String wishlist(@RequestParam(defaultValue = "0") int page,
                           @AuthenticationPrincipal CustomUserDetails userDetails,
                           Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("wishlistPage", productService.getWishlistProducts(userDetails.getUsername(), page));
        return "storefront/user/wishlist";
    }

    @PostMapping("/wishlist/toggle")
    public String toggleWishlist(@RequestParam Integer productId,
                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        userService.toggleWishlist(userDetails.getUsername(), productId);
        return "redirect:/wishlist";
    }

    @PostMapping(value = "/wishlist/toggle", produces = "application/json")
    @ResponseBody
    public java.util.Map<String, Boolean> toggleWishlistJson(@RequestParam Integer productId,
                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);
        return java.util.Map.of("inWishlist", userService.toggleWishlist(userDetails.getUsername(), productId));
    }

    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public String oversizedAvatar(org.springframework.web.servlet.mvc.support.RedirectAttributes flash) {
        flash.addFlashAttribute("error", "Ảnh đại diện tối đa 5 MB.");
        return "redirect:/profile";
    }
}
