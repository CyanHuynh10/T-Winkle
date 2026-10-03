package cyan.project.twinkle.service;

import cyan.project.twinkle.dto.ProductDTO;
import cyan.project.twinkle.dto.ProductDetailDTO;
import cyan.project.twinkle.entity.*;
import cyan.project.twinkle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
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
    public Page<ProductDTO> getProducts(String keyword, String categorySlug, String brandSlug, String sortRule, int page, User user) {
        Page<Product> productsPage;
        if ("popular".equals(sortRule) || sortRule == null) {
            productsPage = productRepository.findProductsPopular(keyword, categorySlug, brandSlug, "Đã giao", PageRequest.of(page, 12));
        } else if ("price-asc".equals(sortRule)) {
            productsPage = productRepository.findProductsPriceAsc(keyword, categorySlug, brandSlug, PageRequest.of(page, 12));
        } else if ("price-desc".equals(sortRule)) {
            productsPage = productRepository.findProductsPriceDesc(keyword, categorySlug, brandSlug, PageRequest.of(page, 12));
        } else {
            Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
            productsPage = productRepository.findProducts(keyword, categorySlug, brandSlug, PageRequest.of(page, 12, sort));
        }
        return mapToProductDTOPage(productsPage, user);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getNewestProducts(int limit, User user) {
        Page<Product> productsPage = productRepository.findProducts(null, null, null, PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt")));
        return mapToProductDTOPage(productsPage, user).getContent();
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getStoreProducts(String storeSlug, String categorySlug, String sortRule, int page, User user) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price-asc".equals(sortRule)) sort = Sort.by(Sort.Direction.ASC, "basePrice");
        if ("price-desc".equals(sortRule)) sort = Sort.by(Sort.Direction.DESC, "basePrice");
        
        Page<Product> productsPage = productRepository.findProductsByStoreSlug(storeSlug, categorySlug, PageRequest.of(page, 12, sort));
        return mapToProductDTOPage(productsPage, user);
    }

    @Transactional(readOnly = true)
    public ProductDetailDTO getProductDetailDTO(Integer id, User user) {
        Product p = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại."));
        if (!"ACTIVE".equals(p.getStatus())) {
            throw new IllegalArgumentException("Sản phẩm ngừng kinh doanh.");
        }
        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSlug(p.getSlug());
        dto.setDescription(p.getDescription());
        dto.setCategoryName(p.getCategory().getName());
        dto.setBrandName(p.getBrand().getName());
        dto.setBasePrice(p.getBasePrice());
        dto.setEffectivePrice(pricingService.calculateEffectivePrice(p));
        
        Double avgRating = reviewRepository.getAverageRatingForProduct(id); 
        Long sold = orderItemRepository.getSoldCountForProduct(id, "Đã giao"); 
        dto.setRatingAverage(avgRating != null ? avgRating : 0.0);
        dto.setSoldCount(sold != null ? sold : 0L);
        dto.setInWishlist(user != null && wishlistItemRepository.existsById(new WishlistItemId(user.getEmail(), id.longValue())));
        
        dto.setImages(p.getImages().stream().map(img -> {
            ProductDetailDTO.ImageDTO idto = new ProductDetailDTO.ImageDTO();
            idto.setImageUrl(img.getImageUrl());
            idto.setAltText(img.getAltText());
            idto.setIsPrimary(img.getIsPrimary());
            return idto;
        }).collect(Collectors.toList()));
        
        dto.setVariants(p.getVariants().stream()
            .filter(v -> "ACTIVE".equals(v.getStatus()))
            .map(v -> {
                ProductDetailDTO.VariantDTO vdto = new ProductDetailDTO.VariantDTO();
                vdto.setId(v.getId());
                vdto.setSize(v.getSize());
                vdto.setColor(v.getColor());
                vdto.setSku(v.getSku());
                vdto.setPriceAdjustment(v.getPriceAdjustment());
                vdto.setImageUrl(v.getImageUrl());
                return vdto;
        }).collect(Collectors.toList()));
        
        List<ProductDetailDTO.StoreInventoryDTO> inventories = storeInventoryRepository.findAvailableInventoryByProductId(id);
        dto.setStoreAvailability(inventories);
        return dto;
    }

    private Page<ProductDTO> mapToProductDTOPage(Page<Product> productsPage, User user) {
        if (productsPage.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), productsPage.getPageable(), productsPage.getTotalElements());
        }

        List<Integer> productIds = productsPage.getContent().stream().map(Product::getId).collect(Collectors.toList());

        Map<Integer, BigDecimal> effectivePrices = pricingService.calculateEffectivePricesBatch(productsPage.getContent());

        Map<Integer, String> imageMap = new HashMap<>();
        Map<Integer, Integer> minSortMap = new HashMap<>();
        Map<Integer, Boolean> hasPrimaryMap = new HashMap<>();
        
        productImageRepository.findImageMetaDataByProductIds(productIds).forEach(row -> {
            Integer pId = (Integer) row[0];
            String url = (String) row[1];
            Boolean isPrimary = (Boolean) row[2];
            Integer sortOrder = row[3] != null ? (Integer) row[3] : 999;
            
            if (Boolean.TRUE.equals(isPrimary)) {
                imageMap.put(pId, url);
                hasPrimaryMap.put(pId, true);
            } else if (!hasPrimaryMap.getOrDefault(pId, false)) {
                Integer currentMin = minSortMap.getOrDefault(pId, 9999);
                if (sortOrder < currentMin) {
                    minSortMap.put(pId, sortOrder);
                    imageMap.put(pId, url);
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
        if (user != null) {
            wishlisted.addAll(wishlistItemRepository.findProductIdsByUserEmail(user.getEmail()));
        }

        List<ProductDTO> dtoList = productsPage.getContent().stream().map(p -> {
            Double rating = ratingMap.getOrDefault(p.getId(), 0.0);
            Long sold = soldMap.getOrDefault(p.getId(), 0L);
            Boolean inWishlist = wishlisted.contains(p.getId());
            BigDecimal price = effectivePrices.getOrDefault(p.getId(), p.getBasePrice());
            
            ProductDTO dto = new ProductDTO(p, rating, sold.intValue(), price, inWishlist);
            dto.setPrimaryImagePath(imageMap.get(p.getId()));
            return dto;
        }).collect(Collectors.toList());

        return new PageImpl<>(dtoList, productsPage.getPageable(), productsPage.getTotalElements());
    }
}
