package cyan.project.twinkle;

import cyan.project.twinkle.config.BankTransferProperties;
import cyan.project.twinkle.dto.CheckoutForm;
import cyan.project.twinkle.entity.Order;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.UserRepository;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties={"twinkle.payment.bank.bank-id=BIDV","twinkle.payment.bank.account-no=1234567890","twinkle.payment.bank.account-name=TEST ONLY & SYNTHETIC"})
@Transactional
class BankPaymentTests {
    @Autowired BankTransferProperties properties;
    @Autowired VietQrService qr;
    @Autowired CheckoutService checkout;
    @Autowired CartService cart;
    @Autowired BankPaymentService payments;
    @Autowired StorefrontProductService products;
    @Autowired UserRepository users;
    @Autowired JdbcTemplate sql;
    @Autowired WebApplicationContext context;
    @Autowired jakarta.persistence.EntityManager entityManager;
    MockMvc mvc;
    String buyer,admin,manager,outsider; long address; Map<String,Object> stock;

    @BeforeEach void fixtures() {
        mvc=MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        String tag="BP"+System.nanoTime();
        buyer=tag+"b@twinkle.test";admin=tag+"a@twinkle.test";manager=tag+"m@twinkle.test";outsider=tag+"x@twinkle.test";
        for(String email:List.of(buyer,admin,manager,outsider)) {
            sql.update("INSERT USERS(email,username,password_hash,is_enabled) VALUES(?,?,'!unusable-test-password',1)",email,email);
            String role=email.equals(admin)?"ROLE_ADMIN":email.equals(manager)||email.equals(outsider)?"ROLE_MANAGER":"ROLE_USER";
            sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name=?",email,role);
        }
        sql.update("INSERT USER_ADDRESSES(user_email,full_name,phone,city,district,ward,address_line,is_default) VALUES(?,'Buyer','0900000000','City','District','Ward','Test address',1)",buyer);
        address=sql.queryForObject("SELECT id FROM USER_ADDRESSES WHERE user_email=?",Long.class,buyer);
        stock=sql.queryForMap("SELECT TOP(1) si.store_id,si.variant_id,si.quantity FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id JOIN PRODUCTS p ON p.id=v.product_id WHERE si.quantity>=4 AND v.status='ACTIVE' AND p.status='ACTIVE' ORDER BY si.store_id,v.id");
        sql.update("UPDATE STORES SET manager_email=? WHERE store_id=?",manager,stock.get("store_id"));
        cart.addToCart(buyer,((Number)stock.get("variant_id")).longValue(),((Number)stock.get("store_id")).intValue(),2);
    }
    CustomUserDetails principal(String email) {return new CustomUserDetails(users.findByEmail(email).orElseThrow());}
    CheckoutForm form(String method) {var f=new CheckoutForm();f.setAddressId(address);f.setPaymentMethod(method);return f;}
    Order banking() {var order=checkout.processCheckout(buyer,form("BANKING"));entityManager.flush();return order;}
    long paymentId(Order order) {return sql.queryForObject("SELECT id FROM PAYMENTS WHERE order_id=?",Long.class,order.getId());}
    Map<String,Object> commerce(Order order) {
        var rows=new LinkedHashMap<String,Object>();
        rows.put("order",sql.queryForMap("SELECT * FROM ORDERS WHERE id=?",order.getId()));
        rows.put("items",sql.queryForList("SELECT * FROM ORDER_ITEMS WHERE order_id=?",order.getId()));
        rows.put("history",sql.queryForList("SELECT * FROM ORDER_STATUS_HISTORY WHERE order_id=?",order.getId()));
        rows.put("coupons",sql.queryForList("SELECT * FROM COUPON_USAGES WHERE order_id=?",order.getId()));
        rows.put("stock",sql.queryForMap("SELECT * FROM STORE_INVENTORY WHERE store_id=? AND variant_id=?",stock.get("store_id"),stock.get("variant_id")));
        rows.put("cart",sql.queryForList("SELECT ci.* FROM CART_ITEMS ci JOIN CARTS c ON c.id=ci.cart_id WHERE c.user_email=?",buyer));
        return rows;
    }

    @Test void propertiesBindAndMissingConfigurationDoesNotAffectCod() {
        assertEquals("BIDV",properties.getBankId());assertTrue(properties.isConfigured());
        var missing=new BankTransferProperties();assertFalse(missing.isConfigured());
        assertThrows(BusinessRuleException.class,()->new VietQrService(missing).requireConfiguration());
        String account=properties.getAccountNo();
        try {
            properties.setAccountNo("");
            assertThrows(BusinessRuleException.class,()->checkout.processCheckout(buyer,form("BANKING")));
            assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM ORDERS WHERE user_email=?",Integer.class,buyer));
            assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM CART_ITEMS ci JOIN CARTS c ON c.id=ci.cart_id WHERE c.user_email=?",Integer.class,buyer));
        } finally {properties.setAccountNo(account);}
        var order=checkout.processCheckout(buyer,form("COD"));
        assertEquals("PENDING",sql.queryForObject("SELECT status FROM PAYMENTS WHERE order_id=?",String.class,order.getId()));
        assertEquals("COD",order.getPaymentMethod());
    }
    @Test void quickLinkUsesCommittedTotalBusinessCodeAndSafeEncoding() {
        var order=banking();String url=qr.imageUrl(order);var uri=URI.create(url);
        assertEquals("https",uri.getScheme());assertEquals("img.vietqr.io",uri.getHost());
        assertEquals("/image/BIDV-1234567890-compact2.png",uri.getPath());
        var params=new HashMap<String,String>();for(String piece:uri.getRawQuery().split("&")){var parts=piece.split("=",2);params.put(parts[0],URLDecoder.decode(parts[1],StandardCharsets.UTF_8));}
        assertEquals(order.getTotal().toBigIntegerExact().toString(),params.get("amount"));assertEquals(order.getOrderCode(),params.get("addInfo"));
        assertEquals("TEST ONLY & SYNTHETIC",params.get("accountName"));assertTrue(url.contains("%26"));
        assertThrows(BusinessRuleException.class,()->qr.validateOrderData(new BigDecimal("1.5"),order.getOrderCode()));
        assertThrows(BusinessRuleException.class,()->qr.validateOrderData(BigDecimal.ZERO,order.getOrderCode()));
        assertThrows(BusinessRuleException.class,()->qr.validateOrderData(new BigDecimal("10000000000000"),order.getOrderCode()));
    }
    @Test void bankingCreatesPendingOnceAndReadingQrDoesNotRepeatCommerce() throws Exception {
        var order=banking();var before=commerce(order);long id=paymentId(order);
        assertEquals("BANKING",sql.queryForObject("SELECT method FROM PAYMENTS WHERE id=?",String.class,id));
        assertEquals("PENDING",sql.queryForObject("SELECT status FROM PAYMENTS WHERE id=?",String.class,id));
        assertEquals(((Number)stock.get("quantity")).intValue()-2,sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WHERE store_id=? AND variant_id=?",Integer.class,stock.get("store_id"),stock.get("variant_id")));
        for(int i=0;i<2;i++)mvc.perform(get("/payments/"+order.getId()).with(user(principal(buyer)))).andExpect(status().isOk()).andExpect(header().string("Cache-Control","no-store"));
        assertEquals(before,commerce(order));assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM PAYMENTS WHERE order_id=?",Integer.class,order.getId()));
        assertThrows(BusinessRuleException.class,()->checkout.processCheckout(buyer,form("BANKING")));
    }
    @Test void ownerOnlyPageAndCsrfAndNormalBuyerCannotConfirm() throws Exception {
        var order=banking();long id=paymentId(order);
        mvc.perform(get("/payments/"+order.getId())).andExpect(status().is3xxRedirection());
        mvc.perform(get("/payments/"+order.getId()).with(user(principal(outsider)))).andExpect(status().isNotFound());
        mvc.perform(post("/payments/manage/"+id+"/confirm").with(user(principal(admin)))).andExpect(status().isForbidden());
        mvc.perform(post("/payments/manage/"+id+"/confirm").with(user(principal(buyer))).with(csrf())).andExpect(status().isForbidden());
        assertEquals("PENDING",sql.queryForObject("SELECT status FROM PAYMENTS WHERE id=?",String.class,id));
    }
    @Test void authorizedManagerConfirmationIsIdempotentAndStoreScoped() throws Exception {
        var order=banking();long id=paymentId(order);var before=commerce(order);
        assertThrows(ResponseStatusException.class,()->payments.confirm(id,outsider));
        mvc.perform(post("/payments/manage/"+id+"/confirm").with(user(principal(manager))).with(csrf())).andExpect(redirectedUrl("/payments/manage"));
        entityManager.flush();
        var paid=sql.queryForMap("SELECT * FROM PAYMENTS WHERE id=?",id);assertEquals("PAID",paid.get("status"));assertNotNull(paid.get("paid_at"));
        payments.confirm(id,manager);
        entityManager.flush();
        assertEquals(paid,sql.queryForMap("SELECT * FROM PAYMENTS WHERE id=?",id));assertEquals(before,commerce(order));
        mvc.perform(get("/payments/manage").with(user(principal(manager)))).andExpect(status().isOk());
    }
    @Test void adminAuthorityAndBuyerEvenWithManagerRoleCannotSelfConfirm() {
        var order=banking();long id=paymentId(order);
        sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name='ROLE_MANAGER'",buyer);
        entityManager.clear();
        assertThrows(ResponseStatusException.class,()->payments.confirm(id,buyer));
        payments.confirm(id,admin);entityManager.flush();assertEquals("PAID",sql.queryForObject("SELECT status FROM PAYMENTS WHERE id=?",String.class,id));
    }
    @Test void newCheckoutRejectsUnsupportedMethods() throws Exception {
        for(String method:List.of("VNPAY","MOMO"))assertThrows(BusinessRuleException.class,()->checkout.processCheckout(buyer,form(method)));
        assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM PAYMENTS WHERE method NOT IN ('COD','BANKING')",Integer.class));
    }
}
