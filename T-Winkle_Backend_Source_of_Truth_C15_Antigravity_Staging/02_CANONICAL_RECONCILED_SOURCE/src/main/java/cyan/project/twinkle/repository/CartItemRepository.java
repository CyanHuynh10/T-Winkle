package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.CartItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);
    
    // LOẠI BỎ N+1 QUERIES: Fetch ngay lập tức Variant, Product, Store của CartItem
    @EntityGraph(attributePaths = {"variant", "product", "store"})
    List<CartItem> findByCartIdAndSelectedTrue(Long cartId);
    
    Optional<CartItem> findByCartIdAndVariantIdAndStoreId(Long cartId, Long variantId, Integer storeId);
    Optional<CartItem> findByIdAndCartId(Long id, Long cartId);
}
