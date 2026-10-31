package cyan.project.twinkle;

import cyan.project.twinkle.dto.ProductDTO;
import cyan.project.twinkle.service.*;
import cyan.project.twinkle.exception.BusinessRuleException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CommerceIntegrationTests {
    @Autowired StorefrontProductService products;
    @Autowired CartService cart;
    @Autowired CheckoutService checkout;
    @Autowired OrderFulfillmentService fulfillment;
    @Autowired JdbcTemplate sql;

    @Test void storeSearchAndCategoryStayWithinActualInventoryForAllSorts() {
        for(String slug : new String[]{"q1","q3","q5","q7","thu-duc","binh-thanh"}) {
            for(String sort : new String[]{"popular","price-asc","price-desc"}) {
                var page=products.getStoreProducts(slug,"sneaker","Nike",sort,0,null);
                assertFalse(page.isEmpty());
                for(ProductDTO p:page) {
                    int count=sql.queryForObject("SELECT COUNT(*) FROM STORE_INVENTORY si JOIN STORES st ON st.store_id=si.store_id JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id JOIN PRODUCTS p ON p.id=v.product_id JOIN CATEGORIES c ON c.id=p.category_id JOIN BRANDS b ON b.id=p.brand_id WHERE st.slug=? AND p.id=? AND c.slug='sneaker' AND (p.name LIKE '%Nike%' OR b.name LIKE '%Nike%')",Integer.class,slug,p.getProductId());
                    assertTrue(count>0);
                }
            }
        }
    }

    @Test @Transactional void mismatchedCartProductAndUnauthorizedFulfillmentLeaveSqlUnchanged() {
        String email="24110064@student.hcmute.edu.vn";
        int before=sql.queryForObject("SELECT COALESCE(SUM(ci.quantity),0) FROM CART_ITEMS ci JOIN CARTS c ON c.id=ci.cart_id WHERE c.user_email=?",Integer.class,email);
        long variant=sql.queryForObject("SELECT MIN(id) FROM PRODUCT_VARIANTS",Long.class);
        assertThrows(BusinessRuleException.class,()->cart.addToCart(email,99999,variant,1,1));
        assertEquals(before,sql.queryForObject("SELECT COALESCE(SUM(ci.quantity),0) FROM CART_ITEMS ci JOIN CARTS c ON c.id=ci.cart_id WHERE c.user_email=?",Integer.class,email));
        long order=CatalogTestFixtures.order(sql,email);
        String status=sql.queryForObject("SELECT status FROM ORDERS WHERE id=?",String.class,order);
        assertThrows(BusinessRuleException.class,()->fulfillment.transition(order,email,"Đã xác nhận"));
        assertEquals(status,sql.queryForObject("SELECT status FROM ORDERS WHERE id=?",String.class,order));
    }

    @Test @Transactional void quoteUsesCurrentPricingAndDoesNotMutateCouponCartOrInventory() {
        String email="quote-test-"+System.nanoTime()+"@twinkle.test";
        sql.update("INSERT INTO USERS(email,username,password_hash,is_enabled) VALUES(?,?,'!unusable-test-password',1)",email,email);
        var available=products.getProductDetailDTO(CatalogTestFixtures.availableProduct(sql),null).getStoreAvailability().stream().filter(i->i.getQuantity()>0).findFirst().orElseThrow();
        cart.addToCart(email,available.getVariantId(),available.getStoreId(),1);
        var before=sql.queryForList("SELECT ci.id,ci.unit_price,ci.quantity FROM CART_ITEMS ci JOIN CARTS c ON c.id=ci.cart_id WHERE c.user_email=? ORDER BY ci.id",email);
        var quote=checkout.quote(email,null);
        assertEquals(0,quote.subtotal().subtract(quote.productDiscount()).subtract(quote.couponDiscount()).add(quote.shippingFee()).compareTo(quote.total()));
        for(var line:quote.items()) {
            var prices=sql.queryForMap("SELECT p.base_price,v.price_adjustment FROM PRODUCT_VARIANTS v JOIN PRODUCTS p ON p.id=v.product_id WHERE v.id=?",line.variantId());
            var original=((java.math.BigDecimal)prices.get("base_price")).add((java.math.BigDecimal)prices.get("price_adjustment"));
            assertEquals(0,original.compareTo(line.originalUnitPrice()));
        }
        assertEquals(before,sql.queryForList("SELECT ci.id,ci.unit_price,ci.quantity FROM CART_ITEMS ci JOIN CARTS c ON c.id=ci.cart_id WHERE c.user_email=? ORDER BY ci.id",email));
    }
}
