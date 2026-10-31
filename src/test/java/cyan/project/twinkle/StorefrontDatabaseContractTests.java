package cyan.project.twinkle;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class StorefrontDatabaseContractTests {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void canonicalSeedPreservesStorefrontStatusAndIdentityInvariants() {
        assertEquals(0, count("SELECT COUNT(*) FROM PAYMENTS WHERE status NOT IN ('PENDING','PAID','FAILED','REFUNDED')"));
        assertEquals(0, count("SELECT COUNT(*) FROM STORES WHERE status NOT IN ('OPEN','CLOSED')"));
        assertEquals(0, count("SELECT COUNT(*) FROM ORDER_CANCELLATIONS WHERE status NOT IN ('PENDING','APPROVED','REJECTED')"));
        assertEquals(0, count("SELECT COUNT(*) FROM (SELECT user_email FROM CARTS WHERE status = 'ACTIVE' GROUP BY user_email HAVING COUNT(*) > 1) duplicate_carts"));
        assertEquals(0, count("SELECT COUNT(*) FROM ORDER_CANCELLATIONS c JOIN ORDERS o ON o.id = c.order_id WHERE c.status = 'PENDING' AND o.status = N'Đã hủy'"));
        assertEquals(0, count("SELECT COUNT(*) FROM PRODUCT_IMAGES i JOIN PRODUCTS p ON p.id=i.product_id WHERE p.status='ACTIVE' AND i.image_url = N'/images/storefront/products/T-Winkle.png'"));
    }

    private int count(String sql) {
        Integer result = jdbcTemplate.queryForObject(sql, Integer.class);
        return result == null ? 0 : result;
    }
}
