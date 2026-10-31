package cyan.project.twinkle;

import org.springframework.jdbc.core.JdbcTemplate;

/** Call only inside rollback test transactions, never against the live database. */
public final class CatalogTestFixtures {
    private CatalogTestFixtures() {}
    public static long order(JdbcTemplate sql, String email) {
        return sql.queryForObject("INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total) OUTPUT INSERTED.id VALUES(?,?,N'Chờ xác nhận đơn hàng','Synthetic fixture','0','fixture','fixture','fixture','fixture','COD',100,0,0,0,100)", Long.class,
                "TW-CATALOG-TEST-"+System.nanoTime(), email);
    }
    public static int availableProduct(JdbcTemplate sql) {
        return sql.queryForObject("SELECT MIN(p.id) FROM PRODUCTS p WHERE p.status='ACTIVE' AND EXISTS(SELECT 1 FROM PRODUCT_VARIANTS v JOIN STORE_INVENTORY si ON si.variant_id=v.id WHERE v.product_id=p.id AND v.status='ACTIVE' AND si.quantity>0)", Integer.class);
    }
}
