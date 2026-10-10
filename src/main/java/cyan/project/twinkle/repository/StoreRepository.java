package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Integer> {
    List<Store> findByManagerEmail(String email);
    Optional<Store> findBySlug(String slug);

    @Query("SELECT s FROM Store s WHERE :keyword IS NULL OR LOWER(s.name) LIKE LOWER(:keyword) OR LOWER(s.addressLine) LIKE LOWER(:keyword) OR LOWER(s.district) LIKE LOWER(:keyword) OR LOWER(s.ward) LIKE LOWER(:keyword) OR LOWER(s.city) LIKE LOWER(:keyword) ORDER BY s.name")
    List<Store> search(@Param("keyword") String keyword);
    List<Store> findByStatusOrderByNameAsc(String status);
    Optional<Store> findBySlugAndStatus(String slug, String status);
}
