package cyan.project.twinkle.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

/** Explicitly synthetic units; never contributes to financial or order totals. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DemoSalesService {
    private final JdbcTemplate sql;

    public Map<Integer, Long> products(List<Integer> ids) {
        var result = new HashMap<Integer, Long>();
        if (ids.isEmpty()) return result;
        String placeholders = String.join(",", Collections.nCopies(ids.size(), "?"));
        sql.query("SELECT v.product_id,SUM(CONVERT(bigint,d.quantity_sold)) quantity "
                + "FROM DEMO_VARIANT_SALES d JOIN PRODUCT_VARIANTS v ON v.id=d.variant_id "
                + "WHERE d.is_demo=1 AND v.product_id IN (" + placeholders + ") GROUP BY v.product_id",
                rs -> { result.put(rs.getInt(1), rs.getLong(2)); }, ids.toArray());
        return result;
    }

    public Map<Long, Long> variants(int product) {
        var result = new HashMap<Long, Long>();
        sql.query("SELECT d.variant_id,SUM(CONVERT(bigint,d.quantity_sold)) quantity "
                + "FROM DEMO_VARIANT_SALES d JOIN PRODUCT_VARIANTS v ON v.id=d.variant_id "
                + "WHERE d.is_demo=1 AND v.product_id=? GROUP BY d.variant_id",
                rs -> { result.put(rs.getLong(1), rs.getLong(2)); }, product);
        return result;
    }
}
