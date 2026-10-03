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
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final StoreInventoryRepository storeInventoryRepository;

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProducts(
            String keyword,
            String categorySlug,
            String brandSlug,
            String sortRule,
            int page,
            String email) {

        LocalDateTime now = LocalDateTime.now();
        Page<Product> productsPage;

        if ("popular".equals(sortRule) || sortRule == null) {
            productsPage = productRepository.findProductsPopular(
                    normalize(keyword),
                    normalize(categorySlug),
                    normalize(brandSlug),
                    "Đã giao",
                    PageRequest.of(page, 12)
            );
        } else if ("price-asc".equals(sortRule)) {
            productsPage = productRepository.findProductsPriceAsc(
                    normalize(keyword),
                    normalize(categorySlug),
                    normalize(brandSlug),
                    now,
                    PageRequest.of(page, 12)
            );
        } else if ("price-desc".equals(sortRule)) {
            productsPage = productRepository.findProductsPriceDesc(
                    normalize(keyword),
                    normalize(categorySlug),
                    normalize(brandSlug),
                    now,
                    PageRequest.of(page, 12)
            );
        } else {
            productsPage = productRepository.findProducts(
                    normalize(keyword),
                    normalize(categorySlug),
                    normalize(brandSlug),
                    PageRequest.of(page, 12, Sort.by(Sort.Direction.DESC, "createdAt"))
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
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return mapToProductDTOPage(productsPage, email, now).getContent();
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getStoreProducts(
            String storeSlug,
            String categorySlug,
            String sortRule,
            int page,
            String email) {

        LocalDateTime now = LocalDateTime.now();
        String normalizedCategory = normalize(categorySlug);
        Page<Product> productsPage;

        if ("price-asc".equals(sortRule)) {
            productsPage = productRepository.findProductsByStoreSlugPriceAsc(
                    storeSlug,
                    normalizedCategory,
                    now,
                    PageRequest.of(page, 12)
            );
        } else if ("price-desc".equals(sortRule)) {
            productsPage = productRepository.findProductsByStoreSlugPriceDesc(
                    storeSlug,
                    normalizedCategory,
                    now,
                    PageRequest.of(page, 12)
            );
        } else {
            productsPage = productRepository.findProductsByStoreSlug(
                    storeSlug,
                    normalizedCategory,
                    PageRequest.of(page, 12, Sort.by(Sort.Direction.DESC, "createdAt"))
            );
        }

        return mapToProductDTOPage(productsPage, email, now);
    }

    @Transactional(readOnly = true)
    public ProductDetailDTO getProductDetailDTO(Integer id, String email) {
        LocalDateTime now = LocalDateTime.now();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại."));

        if (!"ACTIVE".equals(product.getStatus())) {
            throw new IllegalArgumentException("Sản phẩm ngừng kinh doanh.");
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
        dto.setInWishlist(
                email != null
                        && wishlistItemRepository.existsById(new WishlistItemId(email, id))
        );

        dto.setImages(product.getImages().stream()
                .map(image -> {
                    ProductDetailDTO.ImageDTO imageDTO = new ProductDetailDTO.ImageDTO();
                    imageDTO.setImageUrl(image.getImageUrl());
                    imageDTO.setAltText(image.getAltText());
                    imageDTO.setIsPrimary(image.getIsPrimary());
                    return imageDTO;
                })
                .collect(Collectors.toList()));

        dto.setVariants(product.getVariants().stream()
                .filter(v -> "ACTIVE".equals(v.getStatus()))
                .map(variant -> {
                    ProductDetailDTO.VariantDTO variantDTO = new ProductDetailDTO.VariantDTO();
                    variantDTO.setId(variant.getId());
                    variantDTO.setSize(variant.getSize());
                    variantDTO.setColor(variant.getColor());
                    variantDTO.setSku(variant.getSku());
                    variantDTO.setPriceAdjustment(variant.getPriceAdjustment());
                    variantDTO.setImageUrl(variant.getImageUrl());
                    return variantDTO;
                })
                .collect(Collectors.toList()));

        dto.setStoreAvailability(
                storeInventoryRepository.findAvailableInventoryByProductId(id)
        );

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
