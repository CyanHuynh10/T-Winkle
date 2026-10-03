package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Integer> {
    List<Store> findByStatusOrderByNameAsc(String status);
    Optional<Store> findBySlugAndStatus(String slug, String status);
}
