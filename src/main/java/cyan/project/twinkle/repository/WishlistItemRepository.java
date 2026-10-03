package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.WishlistItem;
import cyan.project.twinkle.entity.WishlistItemId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, WishlistItemId> {
    
    @EntityGraph(attributePaths = {"product", "product.category", "product.brand"})
    Page<WishlistItem> findByUserEmailOrderByIdDesc(String email, Pageable pageable);
    
    boolean existsById(WishlistItemId id);

    @Query("SELECT w.product.id FROM WishlistItem w WHERE w.user.email = :email")
    List<Integer> findProductIdsByUserEmail(@Param("email") String email);
}
