package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.CartItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(ci.quantity),0) FROM CartItem ci WHERE ci.cart.user.email = :email AND ci.cart.status = 'ACTIVE'")
    long sumActiveQuantity(@org.springframework.data.repository.query.Param("email") String email);
    @EntityGraph(attributePaths = {"variant", "product", "product.category", "store"})
    List<CartItem> findByCartId(Long cartId);
    
    // LOẠI BỎ N+1 QUERIES: Fetch ngay lập tức Variant, Product, Store của CartItem
    @EntityGraph(attributePaths = {"variant", "product", "store"})
    List<CartItem> findByCartIdAndSelectedTrue(Long cartId);
    
    Optional<CartItem> findByCartIdAndVariantIdAndStoreId(Long cartId, Long variantId, Integer storeId);
    Optional<CartItem> findByIdAndCartId(Long id, Long cartId);
}
