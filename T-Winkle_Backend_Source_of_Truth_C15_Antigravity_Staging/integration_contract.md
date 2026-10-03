# Antigravity Integration Contract — Backend C15

## Identity
- User identity = email.
- Controllers/services should pass email strings where the canonical service contract uses email.
- Product/Category/Brand/Store/Coupon IDs = Integer.
- ProductVariant/ProductImage/Cart/CartItem/Order/... IDs follow SQL BIGINT contract.

## Pricing
- `PricingService.calculateEffectivePrice(Product, LocalDateTime now)` is the single source.
- Batch: `calculateEffectivePricesBatch(List<Product>, LocalDateTime now)`.
- Active + time-valid promotions only.
- Lowest effective product price across PERCENT/FIXED promotions, never below zero.
- Product price ASC/DESC is DB-side and uses the same supplied `now`.

## Product Discovery / Store Catalog
- Product pages fetch category + brand only; never collection-fetch images in `Page<Product>`.
- Popularity uses delivered order quantities.
- Store catalog uses actual store + OPEN store + ACTIVE product/variant + inventory > 0.
- Store catalog price ASC/DESC has dedicated DB-side repository methods.

## Product Detail
- Product must be ACTIVE.
- Only ACTIVE variants exposed.
- Store inventory availability comes from one DTO projection query:
  `StoreInventoryDTO(Integer storeId, String storeName, String storeAddress, Long variantId, Integer quantity)`.
- Projection filters Product ACTIVE, Variant ACTIVE, Store OPEN, inventory > 0.
- Primary image = isPrimary=true, fallback lowest sortOrder.

## Cart
- Read methods are read-only and do not create carts.
- `getOrCreateActiveCart` locks User row with PESSIMISTIC_WRITE then re-checks ACTIVE cart.
- Cart identity = Product + Variant + Store.
- Selected state persists in CART_ITEMS.

## Checkout
- One transaction.
- Rehydrate user by email.
- Validate address ownership, Product/Variant/Store statuses.
- Lock inventory PESSIMISTIC_WRITE.
- `subtotal = sum(originalUnitPrice * quantity)`.
- `productDiscount = sum((originalUnitPrice - effectiveUnitPrice) * quantity)`.
- `total = subtotal - productDiscount - couponDiscount + shippingFee`.
- OrderItem unit price = effective paid price.
- Payment status = PENDING.
- CouponUsage has no discount-applied field.
- Delete selected cart items only at the end of successful checkout.

## Orders / Review / Tracking
- Tracking sorted chronological ASC.
- Cancellation from `Chờ xác nhận` creates `ORDER_CANCELLATIONS.status=PENDING`; do not immediately change order status.
- Review uniqueness = SQL rule `(user_email, product_id)`.
- Review controller redirects using orderId returned by ReviewService.

## Security
- `CustomUserDetails` implements `CredentialsContainer` and `Serializable`.
- Shared `SecurityContextRepository` is used by SecurityConfig and profile-update controller.
- Profile update erases credentials before persisting refreshed Authentication.
