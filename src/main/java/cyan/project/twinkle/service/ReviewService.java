package cyan.project.twinkle.service;

import cyan.project.twinkle.entity.*;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional
    public Long submitReview(String email, Long orderItemId, Integer rating, String comment) {
        if (rating == null || rating < 1 || rating > 5) throw new BusinessRuleException("Đánh giá phải từ 1 đến 5 sao.");

        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new BusinessRuleException("Sản phẩm không tồn tại trong đơn hàng."));
        
        Order order = orderItem.getOrder();
        if (!order.getUser().getEmail().equals(email)) {
            throw new BusinessRuleException("Bạn không có quyền đánh giá sản phẩm này.");
        }
        if (!"Đã giao".equals(order.getStatus())) {
            throw new BusinessRuleException("Chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã giao.");
        }

        if (reviewRepository.existsByUserEmailAndProductId(email, orderItem.getProduct().getId())) {
            throw new BusinessRuleException("Bạn đã đánh giá sản phẩm này rồi.");
        }

        Review review = Review.builder()
                .user(order.getUser())
                .orderItem(orderItem)
                .order(order)
                .product(orderItem.getProduct())
                .rating(rating)
                .comment(comment)
                .status("APPROVED") 
                .build();

        reviewRepository.save(review);
        return order.getId(); 
    }
}
