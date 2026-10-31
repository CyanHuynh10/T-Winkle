package cyan.project.twinkle.service;

import cyan.project.twinkle.dto.ProductDTO;
import cyan.project.twinkle.dto.ProductDetailDTO;
import cyan.project.twinkle.entity.Product;
import cyan.project.twinkle.entity.ProductImage;
import cyan.project.twinkle.entity.ProductVariant;
import cyan.project.twinkle.entity.WishlistItemId;
import cyan.project.twinkle.repository.OrderItemRepository;
import cyan.project.twinkle.repository.ProductImageRepository;
import cyan.project.twinkle.repository.ProductRepository;
import cyan.project.twinkle.repository.ReviewRepository;
import cyan.project.twinkle.repository.StoreInventoryRepository;
import cyan.project.twinkle.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StorefrontProductService {

    private final ProductRepository productRepository;
    private final PricingService pricingService;
    private final DemoSalesService demoSales;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;
    private final cyan.project.twinkle.review.StaffReviewService staffReviews;
    private final OrderItemRepository orderItemRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final StoreInventoryRepository storeInventoryRepository;
    private final InventoryStateService inventoryStateService;
    private final cyan.project.twinkle.repository.StoreRepository stores;

    private final org.springframework.jdbc.core.JdbcTemplate sql;
    @Transactional(readOnly=true) public Page<ProductDTO> filteredProducts(String keyword,String category,String brand,String sort,int page,String email,String storeSlug,PricingService.CatalogFilter filter){
        filter = new PricingService.CatalogFilter(normalize(filter.size()), normalize(filter.color()), filter.minPrice(), filter.maxPrice(), filter.available(), filter.sale());
        Integer store=storeSlug==null?null:stores.findBySlug(storeSlug).orElseThrow().getId();var now=LocalDateTime.now();var products=pricingService.catalogPage(normalize(keyword),normalize(category),normalize(brand),store,now,page,12,normalize(sort)==null?"popular":sort,filter,false);var result=mapToProductDTOPage(products,email,now);
        if(store!=null){var prices=pricingService.calculateEffectivePricesBatch(products.getContent(),now,store);result.forEach(p->p.setEffectivePrice(prices.get(p.getProductId())));}return result;
    }
    @Transactional(readOnly=true) public Map<String,Object> filterOptions(String category,String storeSlug){
        Integer store=storeSlug==null?null:stores.findBySlug(storeSlug).orElseThrow().getId();String scope=" FROM PRODUCTS p JOIN CATEGORIES c ON c.id=p.category_id JOIN PRODUCT_VARIANTS v ON v.product_id=p.id AND v.status='ACTIVE' WHERE p.status='ACTIVE' AND (? IS NULL OR c.slug=?) AND (? IS NULL OR EXISTS(SELECT 1 FROM STORE_INVENTORY si WHERE si.variant_id=v.id AND si.store_id=?))";
        var options=new HashMap<String,Object>();options.put("sizes",sql.queryForList("SELECT DISTINCT v.size"+scope+" ORDER BY v.size",String.class,normalize(category),normalize(category),store,store));options.put("colors",sql.queryForList("SELECT DISTINCT v.color"+scope+" ORDER BY v.color",String.class,normalize(category),normalize(category),store,store));options.put("brands",sql.queryForList("SELECT DISTINCT b.name,b.slug FROM BRANDS b JOIN PRODUCTS p ON p.brand_id=b.id JOIN CATEGORIES c ON c.id=p.category_id WHERE p.status='ACTIVE' AND (? IS NULL OR c.slug=?) AND (? IS NULL OR EXISTS(SELECT 1 FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id WHERE v.product_id=p.id AND si.store_id=? AND v.status='ACTIVE')) ORDER BY b.name",normalize(category),normalize(category),store,store));return options;
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getWishlistProducts(String email, int page) {
        if ((long)page * 12 > Integer.MAX_VALUE) {
            long total = productRepository.countWishlistProducts(email);
            page = (int)Math.max(0, (total - 1) / 12);
        }
        var result = productRepository.findWishlistProducts(email, PageRequest.of(Math.max(0, page), 12));
        if (result.getNumber() > 0 && result.isEmpty()) result = productRepository.findWishlistProducts(email, PageRequest.of(Math.max(0, result.getTotalPages()-1), 12));
        return mapToProductDTOPage(result, email, LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProducts(
            String keyword,
            String categorySlug,
            String brandSlug,
            String sortRule,
            int page,
            String email) {

        return getProducts(keyword, categorySlug, brandSlug, sortRule, page, email, 12);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProducts(String keyword, String categorySlug, String brandSlug, String sortRule, int page, String email, int limit) {
        LocalDateTime now = LocalDateTime.now();
        Page<Product> productsPage;

        if ("popular".equals(sortRule) || sortRule == null) {
            productsPage = productRepository.findProductsPopular(
                    normalize(keyword),
                    normalize(categorySlug),
                    normalize(brandSlug),
                    "Đã giao",
                    PageRequest.of(page, limit)
            );
        } else if ("price-asc".equals(sortRule)) {
            productsPage = pricingService.pricedPage(normalize(keyword),normalize(categorySlug),normalize(brandSlug),null,now,page,limit,true,false);
        } else if ("price-desc".equals(sortRule)) {
            productsPage = pricingService.pricedPage(normalize(keyword),normalize(categorySlug),normalize(brandSlug),null,now,page,limit,false,false);
        } else {
            productsPage = productRepository.findProducts(
                    normalize(keyword),
                    normalize(categorySlug),
                    normalize(brandSlug),
                    PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by("id")))
            );
        }

        return mapToProductDTOPage(productsPage, email, now);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getNewestProducts(int limit, String email) {
        LocalDateTime now = LocalDateTime.now();
        Page<Product> productsPage = productRepository.findProducts(
                null,
                null,
                null,
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by("id")))
        );
        return mapToProductDTOPage(productsPage, email, now).getContent();
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getSaleProducts(int limit, String email) {
        var now = LocalDateTime.now();
        var rows=pricingService.pricedPage(null,null,null,null,now,0,limit,true,true).getContent();
        return mapToProductDTOPage(new PageImpl<>(rows), email, now).getContent();
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getStoreProducts(
            String storeSlug,
            String categorySlug,
            String sortRule,
            int page,
            String email) {

        return getStoreProducts(storeSlug, categorySlug, null, sortRule, page, email);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getStoreProducts(String storeSlug, String categorySlug, String keyword, String sortRule, int page, String email) {
        LocalDateTime now = LocalDateTime.now();
        String search = normalize(keyword) == null ? null : "%" + normalize(keyword) + "%";
        String normalizedCategory = normalize(categorySlug);
        Page<Product> productsPage;

        if ("price-asc".equals(sortRule)) {
            productsPage = pricingService.pricedPage(normalize(keyword),normalizedCategory,null,stores.findBySlug(storeSlug).orElseThrow().getId(),now,page,12,true,false);
        } else if ("price-desc".equals(sortRule)) {
            productsPage = pricingService.pricedPage(normalize(keyword),normalizedCategory,null,stores.findBySlug(storeSlug).orElseThrow().getId(),now,page,12,false,false);
        } else if (sortRule == null || "popular".equals(sortRule)) {
            productsPage = productRepository.findStoreProductsPopular(storeSlug, normalizedCategory, search, "Đã giao", PageRequest.of(page, 12));
        } else {
            productsPage = productRepository.findProductsByStoreSlug(
                    storeSlug,
                    normalizedCategory,
                    search,
                    PageRequest.of(page, 12, Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by("id")))
            );
        }

        var result=mapToProductDTOPage(productsPage,email,now);
        var store=stores.findBySlug(storeSlug).orElseThrow();
        var prices=pricingService.calculateEffectivePricesBatch(productsPage.getContent(),now,store.getId());
        result.forEach(dto->dto.setEffectivePrice(prices.get(dto.getProductId())));
        return result;
    }

    @Transactional(readOnly = true)
    public ProductDetailDTO getProductDetailDTO(Integer id, String email) {
        LocalDateTime now = LocalDateTime.now();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại"));

        if (!"ACTIVE".equals(product.getStatus())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Sản phẩm ngừng kinh doanh");
        }

        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setCategoryName(product.getCategory().getName());
        dto.setBrandName(product.getBrand().getName());
        dto.setBasePrice(product.getBasePrice());
        dto.setEffectivePrice(pricingService.calculateEffectivePrice(product, now));

        Double avgRating = reviewRepository.getAverageRatingForProduct(id);
        Long sold = orderItemRepository.getSoldCountForProduct(id, "Đã giao");
        dto.setRatingAverage(avgRating != null ? avgRating : 0.0);
        dto.setSoldCount(sold != null ? sold : 0L);
        var demoVariantSales = demoSales.variants(id);
        dto.setDemoSoldCount(demoVariantSales.values().stream().mapToLong(Long::longValue).sum());
        dto.setInWishlist(
                email != null
                        && wishlistItemRepository.existsById(new WishlistItemId(email, id))
        );

        dto.setImages(product.getImages().stream()
                .sorted(java.util.Comparator.comparing((ProductImage image) -> !Boolean.TRUE.equals(image.getIsPrimary()))
                        .thenComparing(ProductImage::getSortOrder, java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()))
                        .thenComparing(ProductImage::getId))
                .map(image -> {
                    ProductDetailDTO.ImageDTO imageDTO = new ProductDetailDTO.ImageDTO();
                    imageDTO.setImageUrl(image.getImageUrl());
                    imageDTO.setAltText(image.getAltText());
                    imageDTO.setIsPrimary(image.getIsPrimary());
                    return imageDTO;
                })
                .collect(Collectors.toList()));

        var variantSales = new HashMap<Long, Long>();
        orderItemRepository.getVariantSales(id).forEach(row -> variantSales.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue()));
        var variantRatings = new HashMap<Long, Object[]>();
        reviewRepository.getVariantRatings(id).forEach(row -> variantRatings.put(((Number) row[0]).longValue(), row));
        dto.setVariants(product.getVariants().stream()
                .filter(v -> "ACTIVE".equals(v.getStatus()))
                .map(variant -> {
                    ProductDetailDTO.VariantDTO variantDTO = new ProductDetailDTO.VariantDTO();
                    variantDTO.setId(variant.getId());
                    variantDTO.setSize(variant.getSize());
                    variantDTO.setColor(variant.getColor());
                    variantDTO.setSku(variant.getSku());
                    variantDTO.setPriceAdjustment(variant.getPriceAdjustment());
                    variantDTO.setEffectivePrice(pricingService.calculateItemPrice(product,variant,null,now));
                    variantDTO.setImageUrl(variant.getImageUrl());
                    variantDTO.setSoldCount(variantSales.getOrDefault(variant.getId(), 0L));
                    variantDTO.setDemoSoldCount(demoVariantSales.getOrDefault(variant.getId(), 0L));
                    var stats = variantRatings.get(variant.getId());
                    variantDTO.setRatingAverage(stats == null ? 0.0 : ((Number) stats[1]).doubleValue());
                    variantDTO.setReviewCount(stats == null ? 0L : ((Number) stats[2]).longValue());
                    variantDTO.setStarCounts(java.util.stream.IntStream.range(3, 8)
                            .mapToObj(index -> stats == null ? 0L : ((Number) stats[index]).longValue()).toList());
                    return variantDTO;
                })
                .collect(Collectors.toList()));

        dto.setStoreAvailability(
                storeInventoryRepository.findAvailableInventoryByProductId(id)
        );
        dto.getStoreAvailability().forEach(row -> {
            row.setStockState(inventoryStateService.state(row.getQuantity()));
            product.getVariants().stream().filter(v->v.getId().equals(row.getVariantId())).findFirst().ifPresent(v->row.setEffectivePrice(pricingService.calculateItemPrice(product,v,row.getStoreId(),now)));
        });
        dto.setReviews(staffReviews.publicReviews(id));
        dto.setCanReview(email != null && !reviewRepository.existsByUserEmailAndProductId(email, id)
                && orderItemRepository.existsByOrderUserEmailAndProductIdAndOrderStatus(email, id, "Đã giao"));
        dto.setReviewCounts(java.util.stream.IntStream.iterate(5, star -> star - 1).limit(5)
                .mapToObj(star -> dto.getReviews().stream().filter(review -> review.getRating() == star).count())
                .toList());

        return dto;
    }

    private Page<ProductDTO> mapToProductDTOPage(
            Page<Product> productsPage,
            String email,
            LocalDateTime now) {

        if (productsPage.isEmpty()) {
            return new PageImpl<>(
                    Collections.emptyList(),
                    productsPage.getPageable(),
                    productsPage.getTotalElements()
            );
        }

        List<Integer> productIds = productsPage.getContent()
                .stream()
                .map(Product::getId)
                .collect(Collectors.toList());

        // Aggregate/sorted queries return lazy relations: hydrate them in one batch, not per card.
        Map<Integer, Product> hydrated = productsPage.getContent().stream().anyMatch(p ->
                !org.hibernate.Hibernate.isInitialized(p.getCategory()) || !org.hibernate.Hibernate.isInitialized(p.getBrand()))
                ? productRepository.findByIdIn(productIds).stream().collect(Collectors.toMap(Product::getId, p -> p)) : Map.of();

        Map<Integer, BigDecimal> effectivePrices =
                pricingService.calculateEffectivePricesBatch(productsPage.getContent(), now);

        Map<Integer, String> imageMap = new HashMap<>();
        Map<Integer, Integer> minSortMap = new HashMap<>();
        Map<Integer, Boolean> hasPrimaryMap = new HashMap<>();

        productImageRepository.findImageMetaDataByProductIds(productIds).forEach(row -> {
            Integer productId = (Integer) row[0];
            String url = (String) row[1];
            Boolean isPrimary = (Boolean) row[2];
            Integer sortOrder = row[3] != null ? (Integer) row[3] : 999;

            if (Boolean.TRUE.equals(isPrimary)) {
                imageMap.put(productId, url);
                hasPrimaryMap.put(productId, true);
            } else if (!hasPrimaryMap.getOrDefault(productId, false)) {
                int currentMin = minSortMap.getOrDefault(productId, Integer.MAX_VALUE);
                if (sortOrder < currentMin) {
                    minSortMap.put(productId, sortOrder);
                    imageMap.put(productId, url);
                }
            }
        });

        Map<Integer, Double> ratingMap = new HashMap<>();
        reviewRepository.getAverageRatingsForProducts(productIds).forEach(row -> {
            ratingMap.put((Integer) row[0], (Double) row[1]);
        });

        var demoSoldMap = demoSales.products(productIds);
        Map<Integer, Long> soldMap = new HashMap<>();
        orderItemRepository.getSoldCountsForProducts(productIds, "Đã giao").forEach(row -> {
            soldMap.put((Integer) row[0], ((Number) row[1]).longValue());
        });

        Set<Integer> wishlisted = new HashSet<>();
        if (email != null) {
            wishlisted.addAll(wishlistItemRepository.findProductIdsByUserEmail(email));
        }

        List<ProductDTO> dtoList = productsPage.getContent()
                .stream()
                .map(p -> hydrated.getOrDefault(p.getId(), p))
                .map(product -> {
                    Double rating = ratingMap.getOrDefault(product.getId(), 0.0);
                    Long sold = soldMap.getOrDefault(product.getId(), 0L);
                    Boolean inWishlist = wishlisted.contains(product.getId());
                    BigDecimal effectivePrice = effectivePrices.getOrDefault(
                            product.getId(),
                            product.getBasePrice()
                    );

                    ProductDTO dto = new ProductDTO(
                            product,
                            rating,
                            sold.intValue(),
                            effectivePrice,
                            inWishlist
                    );
                    dto.setPrimaryImagePath(imageMap.get(product.getId()));
                    dto.setDemoSoldCount(demoSoldMap.getOrDefault(product.getId(), 0L));
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(
                dtoList,
                productsPage.getPageable(),
                productsPage.getTotalElements()
        );
    }

    private String normalize(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
