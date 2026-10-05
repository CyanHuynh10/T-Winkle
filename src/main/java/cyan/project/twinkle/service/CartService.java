package cyan.project.twinkle.service;

import cyan.project.twinkle.entity.*;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository variantRepository;
    private final StoreRepository storeRepository;
    private final StoreInventoryRepository inventoryRepository;
    private final PricingService pricingService;
    private final UserRepository userRepository;
    private final ProductImageRepository imageRepository;

    @Transactional(readOnly = true)
    public java.util.Map<Integer, String> getCartImages(List<CartItem> items) {
        var result = new java.util.HashMap<Integer, String>();
        if (items.isEmpty()) return result;
        var ids = items.stream().map(item -> item.getProduct().getId()).distinct().toList();
        imageRepository.findImageMetaDataByProductIds(ids).stream()
                .sorted(java.util.Comparator.comparing((Object[] row) -> !Boolean.TRUE.equals(row[2]))
                        .thenComparing(row -> row[3] == null ? Integer.MAX_VALUE : ((Number) row[3]).intValue()))
                .forEach(row -> result.putIfAbsent((Integer) row[0], (String) row[1]));
        return result;
    }

    @Transactional(readOnly = true)
    public Optional<Cart> getActiveCart(String email) {
        return cartRepository.findByUserEmailAndStatus(email, "ACTIVE");
    }

    @Transactional(readOnly = true)
    public List<CartItem> getCartItems(String email) {
        return getActiveCart(email).map(cart -> cartItemRepository.findByCartId(cart.getId()))
                .orElse(new ArrayList<>());
    }

    @Transactional
    public Cart getOrCreateActiveCart(String email) {
        userRepository.findForUpdateByEmail(email); // PESSIMISTIC_WRITE lock on identity
        return cartRepository.findByUserEmailAndStatus(email, "ACTIVE")
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email).orElseThrow();
                    return cartRepository.save(Cart.builder().user(user).status("ACTIVE").build());
                });
    }

    @Transactional
    public void addToCart(String email, Long variantId, Integer storeId, Integer quantity) {
        addToCart(email, null, variantId, storeId, quantity);
    }

    @Transactional(readOnly = true)
    public java.util.Map<Long,Integer> getCartStock(List<CartItem> items) {
        if(items.isEmpty()) return java.util.Map.of();
        var stock = new java.util.HashMap<Long,Integer>();
        inventoryRepository.findCartStock(items.stream().map(CartItem::getId).toList())
                .forEach(row -> stock.put(((Number)row[0]).longValue(),((Number)row[1]).intValue()));
        return stock;
    }

    @Transactional
    public void addToCart(String email, Integer productId, Long variantId, Integer storeId, Integer quantity) {
        LocalDateTime now = LocalDateTime.now();
        if (quantity == null || quantity <= 0) throw new BusinessRuleException("Số lượng phải lớn hơn 0.");

        Cart cart = getOrCreateActiveCart(email);
        ProductVariant variant = variantRepository.findById(variantId).orElseThrow(() -> new BusinessRuleException("Biến thể không tồn tại."));
        if (productId != null && !productId.equals(variant.getProduct().getId())) {
            throw new BusinessRuleException("Biến thể không thuộc sản phẩm đã chọn.");
        }
        if (!"ACTIVE".equals(variant.getStatus()) || !"ACTIVE".equals(variant.getProduct().getStatus())) {
            throw new BusinessRuleException("Sản phẩm đã ngừng kinh doanh.");
        }
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new BusinessRuleException("Cửa hàng không tồn tại."));

        StoreInventoryId invId = new StoreInventoryId(store.getId(), variant.getId());
        StoreInventory inventory = inventoryRepository.findById(invId).orElseThrow(() -> new BusinessRuleException("Sản phẩm không có sẵn."));
        if (inventory.getQuantity() <= 0) throw new BusinessRuleException("Hết hàng tại cửa hàng này.");

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndVariantIdAndStoreId(cart.getId(), variantId, storeId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            long newQty = (long) item.getQuantity() + quantity;
            if (newQty > inventory.getQuantity()) throw new BusinessRuleException("Vượt quá tồn kho.");
            item.setQuantity((int) newQty);
            item.setUnitPrice(pricingService.calculateEffectivePrice(variant.getProduct(), now).add(variant.getPriceAdjustment()));
            cartItemRepository.save(item);
        } else {
            if (quantity > inventory.getQuantity()) throw new BusinessRuleException("Vượt quá tồn kho.");
            CartItem newItem = CartItem.builder()
                    .cart(cart).product(variant.getProduct()).variant(variant).store(store)
                    .quantity(quantity).selected(true)
                    .unitPrice(pricingService.calculateEffectivePrice(variant.getProduct(), now).add(variant.getPriceAdjustment()))
                    .build();
            cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public void updateQuantity(String email, Long cartItemId, Integer quantity) {
        LocalDateTime now = LocalDateTime.now();
        Cart cart = getOrCreateActiveCart(email);
        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId())
                .orElseThrow(() -> new BusinessRuleException("Sản phẩm không hợp lệ."));
        
        if (quantity == null || quantity < 1) throw new BusinessRuleException("Số lượng phải từ 1 trở lên.");
        if (!item.getProduct().getId().equals(item.getVariant().getProduct().getId())) throw new BusinessRuleException("Biến thể không thuộc sản phẩm.");
        if (!"ACTIVE".equals(item.getVariant().getStatus()) || !"ACTIVE".equals(item.getProduct().getStatus())) {
            throw new BusinessRuleException("Sản phẩm không khả dụng.");
        }

        StoreInventoryId invId = new StoreInventoryId(item.getStore().getId(), item.getVariant().getId());
        StoreInventory inventory = inventoryRepository.findById(invId).orElseThrow(() -> new BusinessRuleException("Cửa hàng không kinh doanh biến thể này."));
        if (quantity > inventory.getQuantity()) throw new BusinessRuleException("Vượt quá tồn kho.");
        
        item.setQuantity(quantity);
        item.setUnitPrice(pricingService.calculateEffectivePrice(item.getProduct(), now).add(item.getVariant().getPriceAdjustment()));
        cartItemRepository.save(item);
    }

    @Transactional
    public void toggleSelect(String email, Long cartItemId, Boolean selected) {
        Cart cart = getOrCreateActiveCart(email);
        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId()).orElseThrow();
        if (Boolean.TRUE.equals(selected)) {
            String reason = unavailableReason(item, getCartStock(List.of(item)).getOrDefault(item.getId(), 0));
            if (reason != null) throw new BusinessRuleException(reason);
        }
        item.setSelected(Boolean.TRUE.equals(selected));
        cartItemRepository.save(item);
    }

    @Transactional
    public void removeCartItem(String email, Long cartItemId) {
        Cart cart = getOrCreateActiveCart(email);
        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId()).orElseThrow();
        cartItemRepository.delete(item);
    }

    public String unavailableReason(CartItem item, int stock) {
        if (!"ACTIVE".equals(item.getProduct().getStatus()) || !"ACTIVE".equals(item.getVariant().getStatus())) return "Sản phẩm đã ngừng kinh doanh.";
        if (!item.getProduct().getId().equals(item.getVariant().getProduct().getId())) return "Biến thể không thuộc sản phẩm.";
        if (stock < 1) return "Sản phẩm đã hết hàng tại cửa hàng này.";
        if (item.getQuantity() == null || item.getQuantity() < 1 || item.getQuantity() > stock) return "Số lượng trong giỏ vượt quá tồn kho hiện tại.";
        return null;
    }

    @Transactional(readOnly = true)
    public cyan.project.twinkle.dto.CartState state(String email) {
        var items = getCartItems(email);
        var stock = getCartStock(items);
        var lines = items.stream().map(item -> {
            int availableStock = stock.getOrDefault(item.getId(), 0);
            String reason = unavailableReason(item, availableStock);
            return new cyan.project.twinkle.dto.CartState.Item(item.getId(), item.getQuantity(), Boolean.TRUE.equals(item.getSelected()),
                    availableStock, reason == null, reason, item.getUnitPrice(), item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())));
        }).toList();
        boolean eligible = lines.stream().anyMatch(i -> i.selected() && i.available()) && lines.stream().noneMatch(i -> i.selected() && !i.available());
        var total = lines.stream().filter(i -> i.selected() && i.available()).map(cyan.project.twinkle.dto.CartState.Item::lineTotal)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        return new cyan.project.twinkle.dto.CartState(lines, eligible, total);
    }

    @Transactional(readOnly = true)
    public long quantityCount(String email) {
        return cartItemRepository.sumActiveQuantity(email);
    }
}
