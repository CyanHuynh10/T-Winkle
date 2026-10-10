package cyan.project.twinkle.chat.ai;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.*;

@Getter @Setter
public class AiShoppingContext implements Serializable {
    private Integer currentProductId;
    private Integer currentStoreId;
    private Long currentOrderId;
    private BigDecimal footLengthCm;
    private String lastRecommendedSize;
    private String preferredBrand;
    private String preferredCategory;
    private String preferredColor;
    private BigDecimal minBudget;
    private BigDecimal maxBudget;
    private List<Integer> recentRecommendedProductIds = new ArrayList<>();
    public Map<String, Object> snapshot() {
        var data = new LinkedHashMap<String, Object>();
        data.put("currentProductId", currentProductId); data.put("currentStoreId", currentStoreId);
        data.put("currentOrderId", currentOrderId); data.put("footLengthCm", footLengthCm);
        data.put("lastRecommendedSize", lastRecommendedSize); data.put("preferredBrand", preferredBrand);
        data.put("preferredCategory", preferredCategory); data.put("preferredColor", preferredColor);
        data.put("minBudget", minBudget); data.put("maxBudget", maxBudget);
        data.put("recentRecommendedProductIds", List.copyOf(recentRecommendedProductIds));
        return data;
    }
}
