package cyan.project.twinkle;

import cyan.project.twinkle.service.*;
import cyan.project.twinkle.repository.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest @Transactional
class PromotionActivationTests {
    @Autowired JdbcTemplate sql;
    @Autowired PricingService pricing;
    @Autowired StorefrontProductService storefront;
    @Autowired ProductRepository products;
    @Autowired ProductVariantRepository variants;
    @Autowired CartService cart;
    @Autowired CheckoutService checkout;
    @Autowired org.springframework.web.context.WebApplicationContext web;
    int product,store,other; long variant; String tag;
    LocalDateTime now;

    @BeforeEach void fixture() {
        assertNotEquals("T_Winkle",sql.queryForObject("SELECT DB_NAME()",String.class),"Mutating tests require an isolated SQL Server database");
        tag="TWSALE-"+UUID.randomUUID(); now=LocalDateTime.now().withNano(0);
        store=sql.queryForObject("SELECT MIN(store_id) FROM STORES",Integer.class);
        other=sql.queryForObject("SELECT MAX(store_id) FROM STORES",Integer.class);
        product=sql.queryForObject("INSERT PRODUCTS(slug,name,category_id,brand_id,base_price,status) OUTPUT INSERTED.id SELECT ?,?,MIN(c.id),MIN(b.id),100,'ACTIVE' FROM CATEGORIES c CROSS JOIN BRANDS b",Integer.class,tag.toLowerCase(Locale.ROOT),tag);
        variant=sql.queryForObject("INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,status) OUTPUT INSERTED.id VALUES(?,'41','blue',?,0,'ACTIVE')",Long.class,product,tag);
        sql.update("INSERT STORE_INVENTORY(store_id,variant_id,quantity) VALUES(?,?,10)",store,variant);
    }
    int promotion(String scope,int percent,LocalDateTime start,LocalDateTime end) {
        int id=sql.queryForObject("INSERT PROMOTIONS(name,scope,priority,discount_type,discount_value,status,starts_at,ends_at) OUTPUT INSERTED.id VALUES(?,?,0,'PERCENT',?,'ACTIVE',?,?)",Integer.class,tag,scope,percent,start,end);
        var p=products.findById(product).orElseThrow();
        switch(scope) {
            case "PRODUCT" -> sql.update("INSERT PRODUCT_PROMOTIONS(product_id,promotion_id) VALUES(?,?)",product,id);
            case "VARIANT" -> sql.update("INSERT VARIANT_PROMOTIONS(variant_id,promotion_id) VALUES(?,?)",variant,id);
            case "BRAND" -> sql.update("INSERT BRAND_PROMOTIONS(brand_id,promotion_id) VALUES(?,?)",p.getBrand().getId(),id);
            case "CATEGORY" -> sql.update("INSERT CATEGORY_PROMOTIONS(category_id,promotion_id) VALUES(?,?)",p.getCategory().getId(),id);
            case "STORE" -> sql.update("INSERT STORE_PROMOTIONS(store_id,promotion_id) VALUES(?,?)",store,id);
        }
        return id;
    }
    int active(String scope,int percent) {return promotion(scope,percent,now.minusDays(1),now.plusDays(1));}
    BigDecimal price(Integer destination) {return pricing.calculateItemPrice(products.findById(product).orElseThrow(),variants.findById(variant).orElseThrow(),destination,now);}
    void money(String expected,BigDecimal actual) {assertEquals(0,new BigDecimal(expected).compareTo(actual));}
    PricingService.CatalogFilter sale = new PricingService.CatalogFilter(null,null,null,null,null,true);

    @Test void activeProductPromotionMatchesCardDetailCartAndCheckout() {
        active("PRODUCT",15);
        var card=storefront.filteredProducts(tag,null,null,"popular",0,null,null,sale).getContent().getFirst();
        money("100",card.getOriginalPrice());money("85",card.getEffectivePrice());
        money("85",storefront.getProductDetailDTO(product,null).getEffectivePrice());
        String email=tag+"@test.invalid";
        sql.update("INSERT USERS(email,username,password_hash,is_enabled) VALUES(?,?,'!unusable',1)",email,tag);
        cart.addToCart(email,variant,store,1);
        var line=checkout.quote(email,null).items().getFirst();
        money("100",line.originalUnitPrice());money("85",line.effectiveUnitPrice());
        money("85",price(store));
        money("85",sql.queryForObject("SELECT ci.unit_price FROM CART_ITEMS ci JOIN CARTS c ON c.id=ci.cart_id WHERE c.user_email=?",BigDecimal.class,email));
    }
    @Test void futurePromotionIsExcluded() {promotion("PRODUCT",30,now.plusHours(1),now.plusDays(1));money("100",price(store));assertEquals(0,storefront.filteredProducts(tag,null,null,"popular",0,null,null,sale).getTotalElements());}
    @Test void expiryIsExclusiveAtExactBoundary() {promotion("PRODUCT",30,now.minusDays(1),now);money("100",price(store));}
    @Test void inactivePromotionIsExcluded() {int id=active("PRODUCT",30);sql.update("UPDATE PROMOTIONS SET status='INACTIVE' WHERE id=?",id);money("100",price(store));}
    @Test void variantPrecedenceDoesNotStack() {active("PRODUCT",30);active("VARIANT",10);money("90",price(store));money("70",pricing.calculateEffectivePrice(products.findById(product).orElseThrow(),now));}
    @Test void brandWinsOverCategoryEvenWithSmallerDiscount() {active("CATEGORY",30);active("BRAND",10);money("90",price(store));active("PRODUCT",15);money("85",price(store));}
    @Test void storeDiscountIsNeverAdvertisedUniversally() {active("STORE",25);money("75",price(store));money("100",price(other));money("100",price(null));assertEquals(0,storefront.filteredProducts(tag,null,null,"popular",0,null,null,sale).getTotalElements());}
    @Test void priorityWinsBeforeCheapestPrice() {int id=active("PRODUCT",10);active("PRODUCT",30);sql.update("UPDATE PROMOTIONS SET priority=1 WHERE id=?",id);money("90",price(store));}
    @Test void overlappingPromotionsCountDistinctProductsAcrossPages() {
        active("PRODUCT",10);active("PRODUCT",20);active("BRAND",30);
        for(int n=0;n<14;n++) {
            sql.update("INSERT PRODUCTS(slug,name,category_id,brand_id,base_price,status) SELECT ?,?,category_id,brand_id,100,'ACTIVE' FROM PRODUCTS WHERE id=?",tag+"-"+n,tag+"-"+n,product);
        }
        var first=pricing.catalogPage(tag,null,null,null,now,0,12,"price-asc",sale,false);
        var next=pricing.catalogPage(tag,null,null,null,now,1,12,"price-asc",sale,false);
        assertEquals(15,first.getTotalElements());assertEquals(3,next.getNumberOfElements());
        var ids=new HashSet<Integer>();first.forEach(p->assertTrue(ids.add(p.getId())));next.forEach(p->assertTrue(ids.add(p.getId())));
        assertEquals(15,ids.size());money("80",price(store));
    }
    @Test void discountDoesNotBypassInsufficientStock() {
        active("PRODUCT",20);String email=tag+"@test.invalid";
        sql.update("INSERT USERS(email,username,password_hash,is_enabled) VALUES(?,?,'!unusable',1)",email,tag);
        assertThrows(cyan.project.twinkle.exception.BusinessRuleException.class,()->cart.addToCart(email,variant,store,11));
        assertEquals(10,sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WHERE variant_id=? AND store_id=?",Integer.class,variant,store));
    }
    @Test void homepageHidesEmptyCampaignAndLinksToFilteredCatalog() throws Exception {
        // Transaction rollback confines this empty-state setup to the isolated test database.
        sql.update("UPDATE PROMOTIONS SET ends_at=DATEADD(day,-1,SYSDATETIME()) WHERE starts_at<DATEADD(day,-1,SYSDATETIME())");
        sql.update("UPDATE PROMOTIONS SET status='INACTIVE'");
        var mvc=org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup(web)
                .apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity()).build();
        String empty=mvc.perform(get("/")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertFalse(empty.contains("class=\"super-sale"));
        active("PRODUCT",20);
        String populated=mvc.perform(get("/")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertTrue(populated.contains("/categories?sale=true"));
        mvc.perform(get("/categories").param("sale","true").param("keyword",tag)).andExpect(status().isOk());
    }
}
