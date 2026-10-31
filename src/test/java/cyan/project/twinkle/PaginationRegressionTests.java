package cyan.project.twinkle;

import cyan.project.twinkle.service.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @Transactional
class PaginationRegressionTests {
    @Autowired StorefrontProductService storefront;
    @Autowired PricingService pricing;
    @Autowired JdbcTemplate sql;
    @Autowired cyan.project.twinkle.report.ReportService reports;
    @Autowired cyan.project.twinkle.admin.AdminCatalogService catalog;
    @Autowired cyan.project.twinkle.repository.UserRepository users;
    @Autowired org.springframework.web.context.WebApplicationContext context;
    MockMvc mvc;
    @BeforeEach void setup() {
        mvc = org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup(context)
                .apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity()).build();
    }
    final LocalDateTime catalogNow = LocalDateTime.now();
    PricingService.CatalogFilter filter = new PricingService.CatalogFilter(null,null,null,null,null,null);
    org.springframework.data.domain.Page<cyan.project.twinkle.entity.Product> page(int page,int size,String sort) {
        return pricing.catalogPage(null,null,null,null,catalogNow,page,size,sort,filter,false);
    }
    @Test void renderedEmptySortPaginationLinkLoadsSecondPage() throws Exception {
        mvc.perform(get("/categories").param("page","1").param("sort","").param("keyword","").param("brand","").param("size","").param("color","").param("minPrice","").param("maxPrice","").param("available","").param("sale",""))
                .andExpect(status().isOk()).andExpect(view().name("storefront/category/list"))
                .andExpect(model().attribute("products", org.hamcrest.Matchers.hasProperty("numberOfElements", org.hamcrest.Matchers.is(12))))
                .andExpect(model().attribute("products", org.hamcrest.Matchers.hasProperty("number", org.hamcrest.Matchers.is(1))));
        assertNotEquals(storefront.filteredProducts(null,null,null,"",0,null,null,filter).getContent().getFirst().getProductId(),
                storefront.filteredProducts(null,null,null,"",1,null,null,filter).getContent().getFirst().getProductId());
    }
    @Test void firstNextPreviousLastCountDistinctProductsAndLoseNone() {
        long total=sql.queryForObject("SELECT COUNT(*) FROM PRODUCTS WHERE status='ACTIVE'",Long.class);
        assertTrue(total>12,"A next-page test requires more than one page");
        var first=page(0,12,"popular"); var second=page(1,12,"popular");
        assertEquals(total,first.getTotalElements());
        assertNotEquals(first.getContent(),second.getContent());
        assertEquals(first.getContent(),page(0,12,"popular").getContent());
        Set<Integer> ids=new HashSet<>();
        for(int i=0;i<first.getTotalPages();i++) for(var p:page(i,12,"popular")) assertTrue(ids.add(p.getId()),"No duplicate cards");
        assertEquals(total,ids.size());
        assertEquals((total-1)%12+1,page(first.getTotalPages()-1,12,"popular").getNumberOfElements());
    }
    @Test void pageSizeSortingAndOutOfRangeAreDeterministic() {
        assertEquals(page(0,12,"newest").getTotalElements(),page(0,7,"newest").getTotalElements());
        assertEquals((page(0,7,"newest").getTotalElements()+6)/7,page(0,7,"newest").getTotalPages());
        assertEquals(0,page(-1,12,"popular").getNumber());
        assertTrue(page(Integer.MAX_VALUE,12,"popular").isLast());
        for(String sort:List.of("newest","price-asc","price-desc")) {
            var all=new ArrayList<cyan.project.twinkle.entity.Product>();
            for(int i=0;i<page(0,12,sort).getTotalPages();i++)all.addAll(page(i,12,sort).getContent());
            assertEquals(page(0,12,sort).getTotalElements(),all.stream().map(p->p.getId()).distinct().count());
            if(sort.startsWith("price")) {
                // Catalog sorting uses the approved promotional price, including active live promotions.
                var effective=pricing.calculateEffectivePricesBatch(all,catalogNow);
                for(int i=1;i<all.size();i++) {
                    int comparison=effective.get(all.get(i-1).getId()).compareTo(effective.get(all.get(i).getId()));
                    assertTrue(sort.equals("price-asc")?comparison<=0:comparison>=0);
                }
            }
        }
    }
    @Test void filtersCountProductsOnceAndEmptyResultsNormalizePage() {
        String size=sql.queryForObject("SELECT TOP(1) size FROM PRODUCT_VARIANTS WHERE status='ACTIVE' ORDER BY size",String.class);
        var f=new PricingService.CatalogFilter(size,null,null,null,null,null);
        long expected=sql.queryForObject("SELECT COUNT(*) FROM PRODUCTS p WHERE p.status='ACTIVE' AND EXISTS(SELECT 1 FROM PRODUCT_VARIANTS v WHERE v.product_id=p.id AND v.status='ACTIVE' AND v.size=?)",Long.class,size);
        assertEquals(expected,pricing.catalogPage(null,null,null,null,LocalDateTime.now(),999,7,"popular",f,false).getTotalElements());
        var empty=pricing.catalogPage("impossible-pagination-fixture",null,null,null,LocalDateTime.now(),999,12,"popular",filter,false);
        assertEquals(0,empty.getTotalElements());assertEquals(0,empty.getNumber());assertTrue(empty.isEmpty());
    }
    @Test void storeSizeFilterRequiresThatExactVariantInTheStore() {
        int store=sql.queryForObject("SELECT MIN(store_id) FROM STORES",Integer.class);
        String size=sql.queryForObject("SELECT TOP(1) size FROM PRODUCT_VARIANTS ORDER BY size",String.class);
        var f=new PricingService.CatalogFilter(size,null,null,null,null,null);
        long expected=sql.queryForObject("SELECT COUNT(*) FROM PRODUCTS p WHERE p.status='ACTIVE' AND EXISTS(SELECT 1 FROM PRODUCT_VARIANTS v JOIN STORE_INVENTORY i ON i.variant_id=v.id WHERE v.product_id=p.id AND v.status='ACTIVE' AND v.size=? AND i.store_id=?)",Long.class,size,store);
        var result=pricing.catalogPage(null,null,null,store,LocalDateTime.now(),0,100,"popular",f,false);
        assertEquals(expected,result.getTotalElements());
        for(var p:result)assertTrue(sql.queryForObject("SELECT COUNT(*) FROM PRODUCT_VARIANTS v JOIN STORE_INVENTORY i ON i.variant_id=v.id WHERE v.product_id=? AND v.size=? AND i.store_id=?",Integer.class,p.getId(),size,store)>0);
    }
    @Test void soldLabelAndNormalizedTitleRenderInDetail() throws Exception {
        int id=CatalogTestFixtures.availableProduct(sql);
        String html=mvc.perform(get("/products/"+id)).andExpect(status().isOk()).andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(html.contains("Đã bán: "));assertFalse(html.contains("Lượt bán mô phỏng"));
        assertFalse(storefront.getProductDetailDTO(id,null).getName().startsWith("Giày "));
    }
    @Test void commercialNamesAreUnicodeSafeStandaloneAndIdempotent() {
        for(String s:List.of("Giày Nike", "GIÀY: Nike", "Giày - Nike", "Gia\u0300y Nike"))assertEquals("Nike",ProductNames.commercial(s));
        for(String s:List.of("Nike", "Nike Giày", "GiàyNike"))assertEquals(s,ProductNames.commercial(s));
        assertEquals("Nike",ProductNames.commercial(ProductNames.commercial("Giày Nike")));
        assertThrows(IllegalArgumentException.class,()->ProductNames.commercial("Giày"));
    }
    void auth(String email,String role) {
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(email,"",List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_"+role))));
    }
    @org.junit.jupiter.api.AfterEach void clearAuth() { org.springframework.security.core.context.SecurityContextHolder.clearContext(); }
    @Test void exportKeepsFilteredStoreScopeSortVisibleColumnsAndAllPages() throws Exception {
        var store=sql.queryForMap("SELECT TOP(1) store_id,manager_email FROM STORES WHERE manager_email IS NOT NULL ORDER BY store_id");
        auth((String)store.get("manager_email"),"MANAGER");
        // Manager Products intentionally includes the public master catalog; quantities and inventory are store scoped.
        var names=sql.queryForList("SELECT p.name FROM PRODUCTS p ORDER BY p.name,p.id",String.class);
        assertTrue(names.size()>30,"Export test must cross a page boundary");
        var prepared=reports.prepare(new cyan.project.twinkle.report.ReportService.Prepare("PRODUCTS",Map.of("sort","name","direction","asc"),List.of("name")));
        assertEquals(names.size(),((Number)prepared.get("rowCount")).intValue());
        var file=reports.download(((Number)prepared.get("id")).longValue(),false);
        try(var wb=new org.apache.poi.xssf.usermodel.XSSFWorkbook(new java.io.ByteArrayInputStream(file.data()))) {
            var sheet=wb.getSheetAt(0);assertEquals(1,sheet.getRow(6).getPhysicalNumberOfCells());
            for(int i=0;i<names.size();i++)assertEquals(names.get(i),sheet.getRow(i+7).getCell(0).getStringCellValue());
        }
        var filtered=reports.prepare(new cyan.project.twinkle.report.ReportService.Prepare("PRODUCTS",Map.of("search","Nike","sort","name","direction","asc"),List.of("name")));
        assertEquals(names.stream().filter(n->n.contains("Nike")).count(),((Number)filtered.get("rowCount")).longValue());
    }
    @Test void adminCrudNormalizesCommercialNameBeforePersisting() {
        String admin=sql.queryForObject("SELECT TOP(1) u.email FROM USERS u JOIN USER_ROLES ur ON ur.user_email=u.email JOIN ROLES r ON r.id=ur.role_id WHERE r.name='ROLE_ADMIN' AND u.is_enabled=1 ORDER BY u.email",String.class);
        auth(admin,"ADMIN");
        var p=sql.queryForMap("SELECT TOP(1) brand_id,category_id FROM PRODUCTS ORDER BY id");
        int id=catalog.product(null,new cyan.project.twinkle.admin.AdminCatalogService.ProductInput("Giày - Commercial Fixture","pagination-commercial-fixture",((Number)p.get("brand_id")).intValue(),((Number)p.get("category_id")).intValue(),java.math.BigDecimal.ONE,"fixture","ACTIVE"));
        assertEquals("Commercial Fixture",sql.queryForObject("SELECT name FROM PRODUCTS WHERE id=?",String.class,id));
    }
    @Test void wishlistHasWorkingControlsAndNormalizesStalePage() throws Exception {
        String email=sql.queryForObject("SELECT TOP(1) email FROM USERS WHERE is_enabled=1 ORDER BY email",String.class);
        sql.update("INSERT WISHLIST_ITEMS(user_email,product_id) SELECT ?,id FROM PRODUCTS p WHERE status='ACTIVE' AND NOT EXISTS(SELECT 1 FROM WISHLIST_ITEMS w WHERE w.user_email=? AND w.product_id=p.id)",email,email);
        var first=storefront.getWishlistProducts(email,0);var next=storefront.getWishlistProducts(email,1);
        assertTrue(first.getTotalElements()>12);assertNotEquals(first.getContent().getFirst().getProductId(),next.getContent().getFirst().getProductId());
        assertTrue(storefront.getWishlistProducts(email,Integer.MAX_VALUE).isLast());
        mvc.perform(get("/wishlist").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user(new cyan.project.twinkle.security.CustomUserDetails(users.findById(email).orElseThrow()))))
                .andExpect(status().isOk()).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content().string(org.hamcrest.Matchers.containsString("Phân trang sản phẩm")));
    }
}
