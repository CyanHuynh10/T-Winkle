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
    private final UserRepository userRepository;
    private final VietQrService vietQr;

    @Value("${twinkle.shipping.default-fee:30000}")
    private BigDecimal defaultShippingFee;

    @Transactional
    public Order processCheckout(String email, CheckoutForm form) {
        if (!java.util.Set.of("COD", "BANKING").contains(form.getPaymentMethod() == null ? "" : form.getPaymentMethod())) {
            throw new BusinessRuleException("Phương thức thanh toán không hợp lệ");
        }
        if ("BANKING".equals(form.getPaymentMethod())) vietQr.requireConfiguration();
        userRepository.findForUpdateByEmail(email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessRuleException("Tài khoản không hợp lệ"));

        LocalDateTime now = LocalDateTime.now();

        Cart cart = cartRepository.findByUserEmailAndStatus(user.getEmail(), "ACTIVE")
                .orElseThrow(() -> new BusinessRuleException("Giỏ hàng trống"));

        List<CartItem> selectedItems = cartItemRepository.findByCartIdAndSelectedTrue(cart.getId());
        if (selectedItems.isEmpty()) throw new BusinessRuleException("Không có sản phẩm nào được chọn");
        selectedItems.sort(Comparator.comparing((CartItem item) -> item.getStore().getId()).thenComparing(item -> item.getVariant().getId()));

        if (!java.util.Set.of("PICKUP","DELIVERY").contains(form.getFulfillmentMode())) throw new BusinessRuleException("Hình thức nhận hàng không hợp lệ");
        boolean pickup="PICKUP".equals(form.getFulfillmentMode());
        UserAddress address = pickup ? null : userAddressRepository.findByIdAndUserEmail(form.getAddressId(), user.getEmail())
                .orElseThrow(() -> new BusinessRuleException("Địa chỉ giao hàng không hợp lệ"));
        if(pickup && (user.getPhone()==null || user.getPhone().isBlank())) throw new BusinessRuleException("Vui lòng cập nhật số điện thoại trong hồ sơ để nhận tại cửa hàng");

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal productDiscountTotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem item : selectedItems) {
            if (item.getQuantity() == null || item.getQuantity() < 1) throw new BusinessRuleException("Số lượng không hợp lệ");
            ProductVariant variant = item.getVariant();
            Store store = item.getStore();
            Product product = variant.getProduct();

            if (!"ACTIVE".equals(product.getStatus()) || !"ACTIVE".equals(variant.getStatus())) throw new BusinessRuleException("Sản phẩm " + product.getName() + " đã ngừng kinh doanh");
            if (!item.getProduct().getId().equals(product.getId())) throw new BusinessRuleException("Biến thể không thuộc sản phẩm trong giỏ");

            StoreInventoryId invId = new StoreInventoryId(store.getId(), variant.getId());
            StoreInventory inventory = inventoryRepository.findByIdForUpdate(invId)
                    .orElseThrow(() -> new BusinessRuleException("Sản phẩm không có sẵn tại " + store.getName()));

            if (inventory.getQuantity() < item.getQuantity()) {
                throw new InsufficientInventoryException("Tồn kho không đủ cho sản phẩm: " + product.getName());
            }

            inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
            inventoryRepository.save(inventory);

            BigDecimal originalUnitPrice = product.getBasePrice().add(variant.getPriceAdjustment());
            BigDecimal effectiveUnitPrice = pricingService.calculateItemPrice(product,variant,store.getId(),now);

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
        BigDecimal shippingFee = pickup ? BigDecimal.ZERO : defaultShippingFee;
        Coupon appliedCoupon = null;
        BigDecimal effectiveSubtotal = subtotal.subtract(productDiscountTotal);

        if (form.getCouponCode() != null && !form.getCouponCode().trim().isEmpty()) {
            appliedCoupon = couponRepository.findByCodeAndIsActiveTrueForUpdate(form.getCouponCode().trim())
                    .orElseThrow(() -> new BusinessRuleException("Mã giảm giá không tồn tại hoặc không khả dụng"));

            requireUserLimit(appliedCoupon,email);
            couponDiscount = couponDiscount(appliedCoupon, effectiveSubtotal, shippingFee, now);

            appliedCoupon.setUsedCount(appliedCoupon.getUsedCount() + 1);
            couponRepository.save(appliedCoupon);
        }

        BigDecimal totalAmount = effectiveSubtotal.subtract(couponDiscount).add(shippingFee);

        Order order = Order.builder()
                .orderCode("TW" + now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + UUID.randomUUID().toString().substring(0, 4).toUpperCase())
                .user(user)
                .recipientName(pickup ? user.getFullName()==null?user.getUsername():user.getFullName() : address.getFullName())
                .recipientPhone(pickup ? user.getPhone() : address.getPhone())
                .shippingAddressLine(pickup ? "" : address.getAddressLine())
                .shippingWard(pickup ? "" : address.getWard())
                .shippingDistrict(pickup ? "" : address.getDistrict())
                .shippingCity(pickup ? "" : address.getCity())
                .shippingNote(pickup ? null : address.getNote())
                .paymentMethod(form.getPaymentMethod())
                .fulfillmentMode(form.getFulfillmentMode())
                .fulfillmentMode(form.getFulfillmentMode())
                .status("Chờ xác nhận đơn hàng")
                .subtotal(subtotal)
                .productDiscount(productDiscountTotal)
                .shippingFee(shippingFee)
                .couponDiscount(couponDiscount)
                .total(totalAmount)
                .build();

        if (appliedCoupon != null) order.setCoupon(appliedCoupon);
        if ("BANKING".equals(form.getPaymentMethod())) vietQr.validateOrderData(order.getTotal(), order.getOrderCode());

        for (OrderItem oi : orderItems) oi.setOrder(order);
        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        paymentRepository.save(Payment.builder()
                .order(savedOrder)
                .method(form.getPaymentMethod())
                .status("PENDING")
                .amount(totalAmount)
                .transactionRef("COD".equals(form.getPaymentMethod()) ? null : savedOrder.getOrderCode())
                .build());

        orderStatusHistoryRepository.save(OrderStatusHistory.builder()
                .order(savedOrder)
                .status("Chờ xác nhận đơn hàng")
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

    @Transactional(readOnly = true)
    public cyan.project.twinkle.dto.CheckoutQuote quote(String email, String couponCode) { return quote(email,couponCode,"DELIVERY"); }

    @Transactional(readOnly = true)
    public cyan.project.twinkle.dto.CheckoutQuote quote(String email, String couponCode, String mode) {
        if(!java.util.Set.of("PICKUP","DELIVERY").contains(mode)) throw new BusinessRuleException("Hình thức nhận hàng không hợp lệ");
        BigDecimal shipping="PICKUP".equals(mode)?BigDecimal.ZERO:defaultShippingFee;
        Cart cart = cartRepository.findByUserEmailAndStatus(email, "ACTIVE")
                .orElseThrow(() -> new BusinessRuleException("Giỏ hàng trống"));
        List<CartItem> selected = cartItemRepository.findByCartIdAndSelectedTrue(cart.getId());
        if (selected.isEmpty()) throw new BusinessRuleException("Không có sản phẩm nào được chọn" );
        LocalDateTime now = LocalDateTime.now();
        List<cyan.project.twinkle.dto.CheckoutQuote.Item> lines = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO, discounts = BigDecimal.ZERO;
        for (CartItem item : selected) {
            Product p = item.getProduct(); ProductVariant v = item.getVariant();
            BigDecimal original = p.getBasePrice().add(v.getPriceAdjustment());
            BigDecimal effective = pricingService.calculateItemPrice(p,v,item.getStore().getId(),now);
            subtotal = subtotal.add(original.multiply(BigDecimal.valueOf(item.getQuantity())));
            discounts = discounts.add(original.subtract(effective).multiply(BigDecimal.valueOf(item.getQuantity())));
            String image = p.getImages().stream().sorted(Comparator.comparing((ProductImage i) -> !Boolean.TRUE.equals(i.getIsPrimary()))
                    .thenComparing(ProductImage::getSortOrder, Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(ProductImage::getId)).map(ProductImage::getImageUrl).findFirst().orElse(null);
            lines.add(new cyan.project.twinkle.dto.CheckoutQuote.Item(item.getId(),p.getId(),p.getName(),v.getId(),v.getSize()+" - "+v.getColor(),
                    item.getStore().getId(),item.getStore().getName(),image,item.getQuantity(),original,effective));
        }
        BigDecimal effectiveSubtotal = subtotal.subtract(discounts), coupon = BigDecimal.ZERO;
        if (couponCode != null && !couponCode.isBlank()) {
            Coupon c = couponRepository.findByCode(couponCode.trim())
                    .orElseThrow(() -> new BusinessRuleException("Mã giảm giá không tồn tại"));
            requireUserLimit(c,email);
            coupon = couponDiscount(c, effectiveSubtotal, shipping, now);
        }
        return new cyan.project.twinkle.dto.CheckoutQuote(lines,subtotal,discounts,coupon,shipping,
                effectiveSubtotal.subtract(coupon).add(shipping));
    }

    @Transactional(readOnly = true)
    public List<cyan.project.twinkle.dto.CouponOption> couponOptions(String email) {
        var quote = quote(email, null);
        var now = LocalDateTime.now();
        return couponRepository.findAll().stream().map(coupon -> {
            String reason = null;
            try {requireUserLimit(coupon,email);couponDiscount(coupon, quote.subtotal().subtract(quote.productDiscount()), defaultShippingFee, now);}
            catch (BusinessRuleException ex) {reason = ex.getMessage();}
            return new cyan.project.twinkle.dto.CouponOption(coupon.getCode(), coupon.getDiscountType(), coupon.getDiscountValue(),
                    coupon.getMinOrderValue(), coupon.getStartsAt(), coupon.getEndsAt(),
                    coupon.getUsageLimit() == null ? null : Math.max(0, coupon.getUsageLimit() - coupon.getUsedCount()), reason == null, reason);
        }).toList();
    }

    private void requireUserLimit(Coupon coupon,String email) {
        if(coupon.getPerUserLimit()!=null && couponUsageRepository.countByCouponIdAndUserEmail(coupon.getId(),email)>=coupon.getPerUserLimit()) throw new BusinessRuleException("Bạn đã dùng hết lượt cho mã này");
    }
    private BigDecimal couponDiscount(Coupon coupon, BigDecimal merchandise, BigDecimal shipping, LocalDateTime now) {
        if (!Boolean.TRUE.equals(coupon.getIsActive())) throw new BusinessRuleException("Mã không khả dụng");
        if (coupon.getStartsAt() != null && now.isBefore(coupon.getStartsAt())) throw new BusinessRuleException("Mã chưa kích hoạt");
        if (coupon.getEndsAt() != null && now.isAfter(coupon.getEndsAt())) throw new BusinessRuleException("Mã đã hết hạn");
        if (merchandise.compareTo(coupon.getMinOrderValue()) < 0) throw new BusinessRuleException("Đơn hàng chưa đạt giá trị tối thiểu");
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) throw new BusinessRuleException("Mã đã hết lượt");
        BigDecimal discount;
        switch(coupon.getDiscountType().toUpperCase(java.util.Locale.ROOT)) {
            case "PERCENT" -> {
                discount = merchandise.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
                if (coupon.getMaxDiscountValue() != null) discount = discount.min(coupon.getMaxDiscountValue());
            }
            case "FIXED" -> discount = coupon.getDiscountValue();
            case "FREESHIP" -> { return shipping.min(coupon.getDiscountValue()).max(BigDecimal.ZERO); }
            default -> throw new BusinessRuleException("Loại mã giảm giá không hợp lệ");
        }
        return discount.max(BigDecimal.ZERO).min(merchandise).setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
