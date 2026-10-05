package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    @Query("SELECT DISTINCT p.category FROM StoreInventory si JOIN si.variant v JOIN v.product p WHERE si.store.slug = :slug AND p.status = 'ACTIVE' AND v.status = 'ACTIVE'")
    List<Category> findStoreCategories(@Param("slug") String slug);
}
