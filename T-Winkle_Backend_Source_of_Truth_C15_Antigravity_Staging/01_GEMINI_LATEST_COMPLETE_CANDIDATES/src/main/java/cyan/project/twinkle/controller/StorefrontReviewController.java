package cyan.project.twinkle.controller;

import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class StorefrontReviewController {

    private final ReviewService reviewService;

    @PostMapping("/add")
    public String submitReview(@RequestParam Long orderItemId,
                               @RequestParam Integer rating,
                               @RequestParam String comment,
                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        Long orderId = reviewService.submitReview(userDetails.getUsername(), orderItemId, rating, comment);
        return "redirect:/orders/" + orderId; // Đã fix redirect về Order gốc
    }
}
