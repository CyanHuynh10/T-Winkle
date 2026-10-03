package cyan.project.twinkle.service;

import cyan.project.twinkle.entity.*;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public Optional<Cart> getActiveCart(String email) {
        return cartRepository.findFirstByUserEmailAndStatusOrderByCreatedAtDesc(email, "ACTIVE");
    }

    @Transactional(readOnly = true)
    public List<CartItem> getCartItems(String email) {
        return getActiveCart(email).map(cart -> cartItemRepository.findByCartId(cart.getId()))
                .orElse(new ArrayList<>());
    }

    @Transactional
    public Cart getOrCreateActiveCart(String email) {
        userRepository.findForUpdateByEmail(email); // PESSIMISTIC_WRITE lock on identity
        return cartRepository.findFirstByUserEmailAndStatusOrderByCreatedAtDesc(email, "ACTIVE")
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email).orElseThrow();
                    return cartRepository.save(Cart.builder().user(user).status("ACTIVE").build());
                });
    }

    @Transactional
    public void addToCart(String email, Long variantId, Integer storeId, Integer quantity) {
        if (quantity <= 0) throw new BusinessRuleException("Số lượng phải lớn hơn 0.");

        Cart cart = getOrCreateActiveCart(email);
        ProductVariant variant = variantRepository.findById(variantId).orElseThrow();
        if (!"ACTIVE".equals(variant.getStatus()) || !"ACTIVE".equals(variant.getProduct().getStatus())) {
            throw new BusinessRuleException("Sản phẩm đã ngừng kinh doanh.");
        }
        Store store = storeRepository.findById(storeId).orElseThrow();
        if (!"OPEN".equals(store.getStatus())) {
            throw new BusinessRuleException("Cửa hàng đang đóng cửa.");
        }

        StoreInventoryId invId = new StoreInventoryId(store.getId(), variant.getId());
        StoreInventory inventory = inventoryRepository.findById(invId).orElseThrow(() -> new BusinessRuleException("Sản phẩm không có sẵn."));

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndVariantIdAndStoreId(cart.getId(), variantId, storeId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + quantity;
            if (newQty > inventory.getQuantity()) throw new BusinessRuleException("Vượt quá tồn kho.");
            item.setQuantity(newQty);
            item.setUnitPrice(pricingService.calculateEffectivePrice(variant.getProduct()).add(variant.getPriceAdjustment()));
            cartItemRepository.save(item);
        } else {
            if (quantity > inventory.getQuantity()) throw new BusinessRuleException("Vượt quá tồn kho.");
            CartItem newItem = CartItem.builder()
                    .cart(cart).product(variant.getProduct()).variant(variant).store(store)
                    .quantity(quantity).selected(true)
                    .unitPrice(pricingService.calculateEffectivePrice(variant.getProduct()).add(variant.getPriceAdjustment()))
                    .build();
            cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public void updateQuantity(String email, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateActiveCart(email);
        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId())
                .orElseThrow(() -> new BusinessRuleException("Sản phẩm không hợp lệ."));
        
        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return;
        }

        StoreInventoryId invId = new StoreInventoryId(item.getStore().getId(), item.getVariant().getId());
        StoreInventory inventory = inventoryRepository.findById(invId).orElseThrow();
        if (quantity > inventory.getQuantity()) throw new BusinessRuleException("Vượt quá tồn kho.");
        
        item.setQuantity(quantity);
        item.setUnitPrice(pricingService.calculateEffectivePrice(item.getProduct()).add(item.getVariant().getPriceAdjustment()));
        cartItemRepository.save(item);
    }

    @Transactional
    public void toggleSelect(String email, Long cartItemId, Boolean selected) {
        Cart cart = getOrCreateActiveCart(email);
        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId()).orElseThrow();
        item.setSelected(selected);
        cartItemRepository.save(item);
    }

    @Transactional
    public void removeCartItem(String email, Long cartItemId) {
        Cart cart = getOrCreateActiveCart(email);
        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId()).orElseThrow();
        cartItemRepository.delete(item);
    }
}
