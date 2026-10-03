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

    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null) return "redirect:/login";
        model.addAttribute("user", userService.getUserByEmail(userDetails.getUsername()));
        return "storefront/user/profile";
    }

    @PostMapping("/profile/update")
    public String updateProfile(@ModelAttribute ProfileUpdateForm form,
                                @AuthenticationPrincipal CustomUserDetails userDetails,
                                HttpServletRequest request,
                                HttpServletResponse response) {
        if (userDetails == null) return "redirect:/login";

        userService.updateProfile(userDetails.getUsername(), form);

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

        return "redirect:/profile?success";
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
        model.addAttribute("wishlistPage", userService.getWishlist(userDetails.getUsername(), page));
        return "storefront/user/wishlist";
    }

    @PostMapping("/wishlist/toggle")
    public String toggleWishlist(@RequestParam Integer productId,
                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        userService.toggleWishlist(userDetails.getUsername(), productId);
        return "redirect:/wishlist";
    }
}
