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
    @Query("""
        SELECT p.id FROM Product p JOIN p.promotions promo
        WHERE p.status = 'ACTIVE' AND p.basePrice > 0 AND promo.status = 'ACTIVE'
          AND promo.discountValue > 0 AND promo.discountType IN ('PERCENT','FIXED')
          AND (promo.startsAt IS NULL OR promo.startsAt <= :now)
          AND (promo.endsAt IS NULL OR promo.endsAt >= :now)
        GROUP BY p.id, p.basePrice
        ORDER BY MAX(CASE
          WHEN promo.discountType = 'PERCENT' THEN
            CASE WHEN promo.discountValue >= 100 THEN p.basePrice ELSE p.basePrice * promo.discountValue / 100 END
          ELSE CASE WHEN promo.discountValue >= p.basePrice THEN p.basePrice ELSE promo.discountValue END
        END) DESC, p.id ASC
        """)
    java.util.List<Integer> findCurrentSaleProductIds(@Param("now") LocalDateTime now, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "brand"})
    java.util.List<Product> findByIdIn(java.util.List<Integer> ids);
    @EntityGraph(attributePaths = {"category", "brand"})
    @Query("SELECT p FROM WishlistItem w JOIN w.product p WHERE w.user.email = :email AND p.status = 'ACTIVE' ORDER BY w.createdAt DESC, p.id ASC")
    Page<Product> findWishlistProducts(@Param("email") String email, Pageable pageable);

    @Query("SELECT COUNT(p) FROM WishlistItem w JOIN w.product p WHERE w.user.email = :email AND p.status = 'ACTIVE'")
    long countWishlistProducts(@Param("email") String email);

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
            ORDER BY COALESCE(SUM(oi.quantity), 0) DESC, p.id ASC
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
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.brand.name) LIKE LOWER(:keyword))
            """,
        countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM Product p
            JOIN p.variants v
            JOIN StoreInventory si ON si.variant.id = v.id
            JOIN si.store st
            WHERE st.slug = :storeSlug
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.brand.name) LIKE LOWER(:keyword))
            """
    )
    Page<Product> findProductsByStoreSlug(
        @Param("storeSlug") String storeSlug,
        @Param("categorySlug") String categorySlug,
        @Param("keyword") String keyword,
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
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.brand.name) LIKE LOWER(:keyword))
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
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.brand.name) LIKE LOWER(:keyword))
            """
    )
    Page<Product> findProductsByStoreSlugPriceAsc(
        @Param("storeSlug") String storeSlug,
        @Param("categorySlug") String categorySlug,
        @Param("keyword") String keyword,
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
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.brand.name) LIKE LOWER(:keyword))
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
              AND p.status = 'ACTIVE'
              AND v.status = 'ACTIVE'
              AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.brand.name) LIKE LOWER(:keyword))
            """
    )
    Page<Product> findProductsByStoreSlugPriceDesc(
        @Param("storeSlug") String storeSlug,
        @Param("categorySlug") String categorySlug,
        @Param("keyword") String keyword,
        @Param("now") LocalDateTime now,
        Pageable pageable
    );

    @Query(value = """
        SELECT p FROM Product p LEFT JOIN OrderItem oi ON oi.product = p AND oi.order.status = :deliveredStatus
        WHERE p.status = 'ACTIVE'
          AND EXISTS (SELECT si FROM StoreInventory si WHERE si.store.slug = :storeSlug AND si.variant.product = p AND si.variant.status = 'ACTIVE')
          AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
          AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.brand.name) LIKE LOWER(:keyword))
        GROUP BY p, p.category, p.brand ORDER BY COALESCE(SUM(oi.quantity), 0) DESC, p.id ASC
        """, countQuery = """
        SELECT COUNT(p.id) FROM Product p WHERE p.status = 'ACTIVE'
          AND EXISTS (SELECT si FROM StoreInventory si WHERE si.store.slug = :storeSlug AND si.variant.product = p AND si.variant.status = 'ACTIVE')
          AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)
          AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.brand.name) LIKE LOWER(:keyword))
        """)
    Page<Product> findStoreProductsPopular(@Param("storeSlug") String storeSlug,
        @Param("categorySlug") String categorySlug, @Param("keyword") String keyword,
        @Param("deliveredStatus") String deliveredStatus, Pageable pageable);
}
