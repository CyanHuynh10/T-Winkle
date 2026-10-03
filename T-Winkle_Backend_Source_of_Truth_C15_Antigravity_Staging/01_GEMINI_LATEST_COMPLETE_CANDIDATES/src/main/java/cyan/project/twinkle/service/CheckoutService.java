package cyan.project.twinkle.service;

import cyan.project.twinkle.dto.CheckoutForm;
import cyan.project.twinkle.entity.*;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.exception.InsufficientInventoryException;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final StoreInventoryRepository inventoryRepository;
    private final UserAddressRepository userAddressRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final PaymentRepository paymentRepository;
    private final PricingService pricingService;

    @Value("${twinkle.shipping.default-fee:30000}")
    private BigDecimal defaultShippingFee;

    @Transactional
    public Order processCheckout(User user, CheckoutForm form) {
        Cart cart = cartRepository.findFirstByUserEmailAndStatusOrderByCreatedAtDesc(user.getEmail(), "ACTIVE")
                .orElseThrow(() -> new BusinessRuleException("Giỏ hàng trống."));

        List<CartItem> selectedItems = cartItemRepository.findByCartIdAndSelectedTrue(cart.getId());
        if (selectedItems.isEmpty()) throw new BusinessRuleException("Không có sản phẩm nào được chọn.");

        UserAddress address = userAddressRepository.findByIdAndUserEmail(form.getAddressId(), user.getEmail())
                .orElseThrow(() -> new BusinessRuleException("Địa chỉ giao hàng không hợp lệ."));

        BigDecimal subtotal = BigDecimal.ZERO; 
        BigDecimal productDiscountTotal = BigDecimal.ZERO; 
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem item : selectedItems) {
            ProductVariant variant = item.getVariant();
            Store store = item.getStore();
            Product product = variant.getProduct();
            
            if (!"ACTIVE".equals(product.getStatus()) || !"ACTIVE".equals(variant.getStatus()) || !"OPEN".equals(store.getStatus())) {
                throw new BusinessRuleException("Sản phẩm hoặc cửa hàng không khả dụng.");
            }

            StoreInventoryId invId = new StoreInventoryId(store.getId(), variant.getId());
            StoreInventory inventory = inventoryRepository.findByIdForUpdate(invId) 
                    .orElseThrow(() -> new BusinessRuleException("Sản phẩm không có sẵn tại " + store.getName()));

            if (inventory.getQuantity() < item.getQuantity()) {
                throw new InsufficientInventoryException("Tồn kho không đủ cho sản phẩm: " + product.getName());
            }

            inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
            inventoryRepository.save(inventory);

            BigDecimal originalUnitPrice = product.getBasePrice().add(variant.getPriceAdjustment());
            BigDecimal effectiveUnitPrice = pricingService.calculateEffectivePrice(product).add(variant.getPriceAdjustment());
            
            BigDecimal lineOriginalTotal = originalUnitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal lineEffectiveTotal = effectiveUnitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            
            subtotal = subtotal.add(lineOriginalTotal);
            productDiscountTotal = productDiscountTotal.add(lineOriginalTotal.subtract(lineEffectiveTotal));

            String imageUrl = null;
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                imageUrl = product.getImages().stream()
                        .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                        .findFirst()
                        .map(ProductImage::getImageUrl)
                        .orElse(product.getImages().stream()
                            .min(Comparator.comparing(img -> img.getSortOrder() != null ? img.getSortOrder() : 999))
                            .map(ProductImage::getImageUrl)
                            .orElse(null));
            }

            orderItems.add(OrderItem.builder()
                    .product(product)
                    .variant(variant)
                    .store(store)
                    .productName(product.getName())
                    .variantName("Size " + variant.getSize() + " - " + variant.getColor())
                    .imageUrl(imageUrl)
                    .unitPrice(effectiveUnitPrice) 
                    .discountAmount(originalUnitPrice.subtract(effectiveUnitPrice)) 
                    .quantity(item.getQuantity())
                    .lineTotal(lineEffectiveTotal) 
                    .build());
        }

        BigDecimal couponDiscount = BigDecimal.ZERO;
        BigDecimal shippingFee = defaultShippingFee;
        Coupon appliedCoupon = null;
        BigDecimal effectiveSubtotal = subtotal.subtract(productDiscountTotal); 

        if (form.getCouponCode() != null && !form.getCouponCode().trim().isEmpty()) {
            appliedCoupon = couponRepository.findByCodeAndIsActiveTrueForUpdate(form.getCouponCode().trim())
                    .orElseThrow(() -> new BusinessRuleException("Mã giảm giá không tồn tại hoặc không khả dụng."));
            
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(appliedCoupon.getStartsAt())) throw new BusinessRuleException("Mã chưa kích hoạt.");
            if (now.isAfter(appliedCoupon.getEndsAt())) throw new BusinessRuleException("Mã đã hết hạn.");
            if (effectiveSubtotal.compareTo(appliedCoupon.getMinOrderValue()) < 0) throw new BusinessRuleException("Đơn hàng chưa đạt giá trị tối thiểu.");
            if (appliedCoupon.getUsageLimit() != null && appliedCoupon.getUsedCount() >= appliedCoupon.getUsageLimit()) throw new BusinessRuleException("Mã đã hết lượt.");

            if ("PERCENT".equalsIgnoreCase(appliedCoupon.getDiscountType())) {
                couponDiscount = effectiveSubtotal.multiply(appliedCoupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
                if (appliedCoupon.getMaxDiscountValue() != null && couponDiscount.compareTo(appliedCoupon.getMaxDiscountValue()) > 0) {
                    couponDiscount = appliedCoupon.getMaxDiscountValue();
                }
            } else if ("FIXED".equalsIgnoreCase(appliedCoupon.getDiscountType())) {
                couponDiscount = appliedCoupon.getDiscountValue();
            } else if ("FREESHIP".equalsIgnoreCase(appliedCoupon.getDiscountType())) {
                couponDiscount = shippingFee.min(appliedCoupon.getDiscountValue());
            }

            if (!"FREESHIP".equalsIgnoreCase(appliedCoupon.getDiscountType()) && couponDiscount.compareTo(effectiveSubtotal) > 0) {
                couponDiscount = effectiveSubtotal;
            }

            appliedCoupon.setUsedCount(appliedCoupon.getUsedCount() + 1);
            couponRepository.save(appliedCoupon);
        }

        BigDecimal totalAmount = effectiveSubtotal.subtract(couponDiscount).add(shippingFee);

        Order order = Order.builder()
                .orderCode("TW" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + UUID.randomUUID().toString().substring(0, 4).toUpperCase())
                .user(user)
                .recipientName(address.getFullName()) 
                .recipientPhone(address.getPhone())
                .shippingAddressLine(address.getAddressLine())
                .shippingWard(address.getWard())
                .shippingDistrict(address.getDistrict())
                .shippingCity(address.getCity())
                .shippingNote(address.getNote())
                .paymentMethod(form.getPaymentMethod())
                .status("Chờ xác nhận")
                .subtotal(subtotal)
                .productDiscount(productDiscountTotal)
                .shippingFee(shippingFee)
                .couponDiscount(couponDiscount)
                .total(totalAmount)
                .build();
        
        if (appliedCoupon != null) order.setCoupon(appliedCoupon); 

        for (OrderItem oi : orderItems) oi.setOrder(order);
        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        paymentRepository.save(Payment.builder()
                .order(savedOrder)
                .method(form.getPaymentMethod())
                .status("PENDING") 
                .amount(totalAmount)
                .build());

        orderStatusHistoryRepository.save(OrderStatusHistory.builder()
                .order(savedOrder)
                .status("Chờ xác nhận")
                .note("Đơn hàng mới được tạo")
                .build());

        if (appliedCoupon != null) {
            couponUsageRepository.save(CouponUsage.builder()
                    .coupon(appliedCoupon)
                    .user(user)
                    .order(savedOrder)
                    .build()); 
        }

        cartItemRepository.deleteAll(selectedItems);
        return savedOrder;
    }
}
