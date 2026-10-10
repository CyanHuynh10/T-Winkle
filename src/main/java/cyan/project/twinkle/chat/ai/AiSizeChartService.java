package cyan.project.twinkle.chat.ai;

import cyan.project.twinkle.entity.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import java.util.*;

@Service @RequiredArgsConstructor
public class AiSizeChartService {
    private final JdbcTemplate sql;
    @Transactional(readOnly = true)
    public Map<String, Object> recommend(Product product, BigDecimal footLength, String gender) {
        if (footLength == null) return Map.of("status", "FOOT_LENGTH_REQUIRED");
        if (footLength.compareTo(BigDecimal.valueOf(5)) < 0 || footLength.compareTo(BigDecimal.valueOf(40)) > 0)
            return Map.of("status", "INVALID_FOOT_LENGTH");
        var charts = sql.queryForList("""
            SELECT TOP (1) id,name,source_type,source_reference FROM SIZE_CHARTS
            WHERE is_active=1 AND (gender_scope IS NULL OR gender_scope=?)
              AND source_reference IS NOT NULL AND LEN(source_reference)>0
              AND (product_id=? OR (product_id IS NULL AND brand_id=? AND (category_id=? OR category_id IS NULL))
                OR (product_id IS NULL AND brand_id IS NULL AND category_id IS NULL AND source_type='TWINKLE_REFERENCE'))
            ORDER BY CASE WHEN product_id=? THEN 0 WHEN brand_id=? AND category_id=? THEN 1
              WHEN brand_id=? THEN 2 ELSE 3 END,id
            """, gender, product.getId(), product.getBrand().getId(), product.getCategory().getId(),
            product.getId(), product.getBrand().getId(), product.getCategory().getId(), product.getBrand().getId());
        if (charts.isEmpty()) return Map.of("status", "INSUFFICIENT_SIZE_DATA");
        var chart = charts.getFirst();
        var rows = sql.queryForList("""
            SELECT eu_size,recommendation_note FROM SIZE_CHART_ENTRIES
            WHERE size_chart_id=? AND foot_length_min_cm<=? AND foot_length_max_cm>=? ORDER BY sort_order,id
            """, chart.get("id"), footLength, footLength);
        if (rows.size() != 1) return Map.of("status", "INSUFFICIENT_SIZE_DATA");
        var row = rows.getFirst();
        var variants = product.getVariants().stream().filter(v -> "ACTIVE".equals(v.getStatus()) && v.getSize().equals(row.get("eu_size")))
            .map(v -> Map.of("variantId", v.getId(), "size", v.getSize(), "color", v.getColor())).toList();
        return Map.of("status", variants.isEmpty() ? "NO_ACTIVE_VARIANT" : "OK",
            "recommendedSize", row.get("eu_size"), "chartName", chart.get("name"), "sourceType", chart.get("source_type"),
            "sourceReference", chart.get("source_reference"), "activeVariants", variants,
            "advisory", "Đây là tư vấn theo bảng size, không đảm bảo vừa 100%. Tồn kho phải được kiểm tra riêng");
    }
}
