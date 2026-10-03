package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @EntityGraph(attributePaths = {"category", "brand"})
    @Query(
        value = """
            SELECT p FROM Product p
            WHERE p.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:brandSlug IS NULL OR p.brand.slug = :brandSlug)
            """,
        countQuery = """
            SELECT COUNT(p.id) FROM Product p
            WHERE p.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:brandSlug IS NULL OR p.brand.slug = :brandSlug)
            """
    )
    Page<Product> findProducts(
        @Param("keyword") String keyword,
        @Param("categorySlug") String categorySlug,
        @Param("brandSlug") String brandSlug,
        Pageable pageable
    );

    
    @Query(
        value = """
            SELECT p FROM Product p
            LEFT JOIN OrderItem oi
              ON oi.product = p
             AND oi.order.status = :deliveredStatus
            WHERE p.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:brandSlug IS NULL OR p.brand.slug = :brandSlug)
            GROUP BY p, p.category, p.brand
            ORDER BY COALESCE(SUM(oi.quantity), 0) DESC
            """,
        countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM Product p
            WHERE p.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:brandSlug IS NULL OR p.brand.slug = :brandSlug)
            """
    )
    Page<Product> findProductsPopular(
        @Param("keyword") String keyword,
        @Param("categorySlug") String categorySlug,
        @Param("brandSlug") String brandSlug,
        @Param("deliveredStatus") String deliveredStatus,
        Pageable pageable
    );

    
    @Query(
        value = """
            SELECT p FROM Product p
            LEFT JOIN p.promotions promo
              ON promo.status = 'ACTIVE'
             AND (promo.startsAt IS NULL OR promo.startsAt <= :now)
             AND (promo.endsAt IS NULL OR promo.endsAt >= :now)
            WHERE p.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:brandSlug IS NULL OR p.brand.slug = :brandSlug)
            GROUP BY p, p.category, p.brand
            ORDER BY MIN(
                CASE
                    WHEN promo.id IS NULL THEN p.basePrice
                    WHEN promo.discountType = 'PERCENT'
                        THEN CASE
                            WHEN p.basePrice - (p.basePrice * promo.discountValue / 100.0) < 0
                                THEN 0
                            ELSE p.basePrice - (p.basePrice * promo.discountValue / 100.0)
                        END
                    WHEN promo.discountType = 'FIXED'
                        THEN CASE
                            WHEN p.basePrice - promo.discountValue < 0
                                THEN 0
                            ELSE p.basePrice - promo.discountValue
                        END
                    ELSE p.basePrice
                END
            ) ASC
            """,
        countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM Product p
            WHERE p.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:brandSlug IS NULL OR p.brand.slug = :brandSlug)
            """
    )
    Page<Product> findProductsPriceAsc(
        @Param("keyword") String keyword,
        @Param("categorySlug") String categorySlug,
        @Param("brandSlug") String brandSlug,
        @Param("now") LocalDateTime now,
        Pageable pageable
    );

    
    @Query(
        value = """
            SELECT p FROM Product p
            LEFT JOIN p.promotions promo
              ON promo.status = 'ACTIVE'
             AND (promo.startsAt IS NULL OR promo.startsAt <= :now)
             AND (promo.endsAt IS NULL OR promo.endsAt >= :now)
            WHERE p.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:brandSlug IS NULL OR p.brand.slug = :brandSlug)
            GROUP BY p, p.category, p.brand
            ORDER BY MIN(
                CASE
                    WHEN promo.id IS NULL THEN p.basePrice
                    WHEN promo.discountType = 'PERCENT'
                        THEN CASE
                            WHEN p.basePrice - (p.basePrice * promo.discountValue / 100.0) < 0
                                THEN 0
                            ELSE p.basePrice - (p.basePrice * promo.discountValue / 100.0)
                        END
                    WHEN promo.discountType = 'FIXED'
                        THEN CASE
                            WHEN p.basePrice - promo.discountValue < 0
                                THEN 0
                            ELSE p.basePrice - promo.discountValue
                        END
                    ELSE p.basePrice
                END
            ) DESC
            """,
        countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM Product p
            WHERE p.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:brandSlug IS NULL OR p.brand.slug = :brandSlug)
            """
    )
    Page<Product> findProductsPriceDesc(
        @Param("keyword") String keyword,
        @Param("categorySlug") String categorySlug,
        @Param("brandSlug") String brandSlug,
        @Param("now") LocalDateTime now,
        Pageable pageable
    );

    @EntityGraph(attributePaths = {"category", "brand"})
    @Query(
        value = """
            SELECT DISTINCT p FROM Product p
            JOIN p.variants v
            JOIN StoreInventory si ON si.variant.id = v.id
            JOIN si.store st
            WHERE st.slug = :storeSlug
              AND st.status = 'OPEN'
              AND si.quantity > 0
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
            """,
        countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM Product p
            JOIN p.variants v
            JOIN StoreInventory si ON si.variant.id = v.id
            JOIN si.store st
            WHERE st.slug = :storeSlug
              AND st.status = 'OPEN'
              AND si.quantity > 0
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
            """
    )
    Page<Product> findProductsByStoreSlug(
        @Param("storeSlug") String storeSlug,
        @Param("categorySlug") String categorySlug,
        Pageable pageable
    );

    
    @Query(
        value = """
            SELECT p FROM Product p
            JOIN p.variants v
            JOIN StoreInventory si ON si.variant.id = v.id
            JOIN si.store st
            LEFT JOIN p.promotions promo
              ON promo.status = 'ACTIVE'
             AND (promo.startsAt IS NULL OR promo.startsAt <= :now)
             AND (promo.endsAt IS NULL OR promo.endsAt >= :now)
            WHERE st.slug = :storeSlug
              AND st.status = 'OPEN'
              AND si.quantity > 0
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
            GROUP BY p, p.category, p.brand
            ORDER BY MIN(
                CASE
                    WHEN promo.id IS NULL THEN p.basePrice
                    WHEN promo.discountType = 'PERCENT'
                        THEN CASE
                            WHEN p.basePrice - (p.basePrice * promo.discountValue / 100.0) < 0
                                THEN 0
                            ELSE p.basePrice - (p.basePrice * promo.discountValue / 100.0)
                        END
                    WHEN promo.discountType = 'FIXED'
                        THEN CASE
                            WHEN p.basePrice - promo.discountValue < 0
                                THEN 0
                            ELSE p.basePrice - promo.discountValue
                        END
                    ELSE p.basePrice
                END
            ) ASC
            """,
        countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM Product p
            JOIN p.variants v
            JOIN StoreInventory si ON si.variant.id = v.id
            JOIN si.store st
            WHERE st.slug = :storeSlug
              AND st.status = 'OPEN'
              AND si.quantity > 0
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
            """
    )
    Page<Product> findProductsByStoreSlugPriceAsc(
        @Param("storeSlug") String storeSlug,
        @Param("categorySlug") String categorySlug,
        @Param("now") LocalDateTime now,
        Pageable pageable
    );

    
    @Query(
        value = """
            SELECT p FROM Product p
            JOIN p.variants v
            JOIN StoreInventory si ON si.variant.id = v.id
            JOIN si.store st
            LEFT JOIN p.promotions promo
              ON promo.status = 'ACTIVE'
             AND (promo.startsAt IS NULL OR promo.startsAt <= :now)
             AND (promo.endsAt IS NULL OR promo.endsAt >= :now)
            WHERE st.slug = :storeSlug
              AND st.status = 'OPEN'
              AND si.quantity > 0
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
            GROUP BY p, p.category, p.brand
            ORDER BY MIN(
                CASE
                    WHEN promo.id IS NULL THEN p.basePrice
                    WHEN promo.discountType = 'PERCENT'
                        THEN CASE
                            WHEN p.basePrice - (p.basePrice * promo.discountValue / 100.0) < 0
                                THEN 0
                            ELSE p.basePrice - (p.basePrice * promo.discountValue / 100.0)
                        END
                    WHEN promo.discountType = 'FIXED'
                        THEN CASE
                            WHEN p.basePrice - promo.discountValue < 0
                                THEN 0
                            ELSE p.basePrice - promo.discountValue
                        END
                    ELSE p.basePrice
                END
            ) DESC
            """,
        countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM Product p
            JOIN p.variants v
            JOIN StoreInventory si ON si.variant.id = v.id
            JOIN si.store st
            WHERE st.slug = :storeSlug
              AND st.status = 'OPEN'
              AND si.quantity > 0
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
            """
    )
    Page<Product> findProductsByStoreSlugPriceDesc(
        @Param("storeSlug") String storeSlug,
        @Param("categorySlug") String categorySlug,
        @Param("now") LocalDateTime now,
        Pageable pageable
    );
}
