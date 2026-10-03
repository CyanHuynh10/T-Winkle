package cyan.project.twinkle.service;

import cyan.project.twinkle.entity.Product;
import cyan.project.twinkle.entity.Promotion;
import cyan.project.twinkle.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PricingService {

    private final PromotionRepository promotionRepository;

    @Transactional(readOnly = true)
    public BigDecimal calculateEffectivePrice(Product product, LocalDateTime now) {
        List<Promotion> activePromotions = promotionRepository.findActivePromotionsForProduct(product.getId(), now);
        return calculateLowestPrice(product.getBasePrice(), activePromotions);
    }

    @Transactional(readOnly = true)
    public Map<Integer, BigDecimal> calculateEffectivePricesBatch(List<Product> products, LocalDateTime now) {
        if (products.isEmpty()) return new HashMap<>();
        List<Integer> productIds = products.stream().map(Product::getId).collect(Collectors.toList());
        List<Object[]> promoData = promotionRepository.findActivePromotionsForProducts(productIds, now);
        
        Map<Integer, List<Promotion>> promoMap = new HashMap<>();
        for (Object[] row : promoData) {
            Integer pid = (Integer) row[0];
            Promotion promo = (Promotion) row[1];
            promoMap.computeIfAbsent(pid, k -> new ArrayList<>()).add(promo);
        }

        Map<Integer, BigDecimal> result = new HashMap<>();
        for (Product p : products) {
            List<Promotion> promos = promoMap.getOrDefault(p.getId(), new ArrayList<>());
            result.put(p.getId(), calculateLowestPrice(p.getBasePrice(), promos));
        }
        return result;
    }

    private BigDecimal calculateLowestPrice(BigDecimal basePrice, List<Promotion> promotions) {
        if (promotions == null || promotions.isEmpty()) return basePrice;
        BigDecimal minPrice = basePrice;
        for (Promotion promo : promotions) {
            BigDecimal currentPrice = basePrice;
            if ("PERCENT".equalsIgnoreCase(promo.getDiscountType())) {
                BigDecimal discountFactor = promo.getDiscountValue().divide(BigDecimal.valueOf(100));
                currentPrice = currentPrice.subtract(currentPrice.multiply(discountFactor));
            } else if ("FIXED".equalsIgnoreCase(promo.getDiscountType())) {
                currentPrice = currentPrice.subtract(promo.getDiscountValue());
            }
            if (currentPrice.compareTo(BigDecimal.ZERO) < 0) currentPrice = BigDecimal.ZERO;
            if (currentPrice.compareTo(minPrice) < 0) minPrice = currentPrice;
        }
        return minPrice;
    }
}
