package cyan.project.twinkle;
import cyan.project.twinkle.review.*;
import cyan.project.twinkle.report.*;
import cyan.project.twinkle.manager.*;
import cyan.project.twinkle.admin.AdminDashboardService;
import cyan.project.twinkle.chat.support.*;
import cyan.project.twinkle.service.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import java.util.*;
import java.time.*;
import java.io.*;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @Transactional
class FinalFeatureTests {
 @Autowired JdbcTemplate sql;@Autowired StaffReviewService reviews;@Autowired ReportService reports;@Autowired SupportChatService chat;@Autowired StorefrontProductService catalog;@Autowired ManagerDashboardService managerDashboard;@Autowired AdminDashboardService adminDashboard;@Autowired WebApplicationContext web;
 String tag,manager,otherManager,admin,support,buyer;int store,other,product;long variant,order,item,review;MockMvc mvc;
 UsernamePasswordAuthenticationToken auth(String email,String role){var a=new UsernamePasswordAuthenticationToken(email,"",List.of(new SimpleGrantedAuthority("ROLE_"+role)));SecurityContextHolder.getContext().setAuthentication(a);return a;}
 @BeforeEach void setup(){
  tag="TWFINALFEATURE"+System.nanoTime();manager=tag+"m@test.invalid";otherManager=tag+"x@test.invalid";admin=tag+"a@test.invalid";support=tag+"s@test.invalid";buyer=tag+"u@test.invalid";mvc=MockMvcBuilders.webAppContextSetup(web).apply(springSecurity()).build();
  for(String e:List.of(manager,otherManager,admin,support,buyer)){sql.update("INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES(?,?,?,'!unusable',1)",e,tag,e.equals(support)?"PRIVATE SUPPORT":tag);sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name=?",e,e.equals(admin)?"ROLE_ADMIN":e.equals(support)?"ROLE_SUPPORT":e.equals(buyer)?"ROLE_USER":"ROLE_MANAGER");}
  store=sql.queryForObject("INSERT STORES(slug,name,address_line,city,status,manager_email) OUTPUT INSERTED.store_id VALUES(?,?,'fixture','fixture','OPEN',?)",Integer.class,tag+"a",tag+" Store",manager);other=sql.queryForObject("INSERT STORES(slug,name,address_line,city,status,manager_email) OUTPUT INSERTED.store_id VALUES(?,?,'fixture','fixture','OPEN',?)",Integer.class,tag+"b",tag+" Other",otherManager);
  product=product("001");variant=sql.queryForObject("INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,status) OUTPUT INSERTED.id VALUES(?,'41','blue',?,0,'ACTIVE')",Long.class,product,tag);sql.update("INSERT STORE_INVENTORY(store_id,variant_id,quantity,reorder_level) VALUES(?,?,30,10)",store,variant);
  order=sql.queryForObject("INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total) OUTPUT INSERTED.id VALUES(?,?,N'Đã giao','fixture','0','fixture','fixture','fixture','fixture','COD',100,0,0,0,100)",Long.class,tag,buyer);
  item=sql.queryForObject("INSERT ORDER_ITEMS(order_id,product_id,store_id,variant_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) OUTPUT INSERTED.id VALUES(?,?,?,?,?,'fixture',1,100,0,100)",Long.class,order,product,store,variant,tag);
  review=sql.queryForObject("INSERT REVIEWS(order_id,order_item_id,user_email,product_id,rating,comment,status) OUTPUT INSERTED.id VALUES(?,?,?,?,5,?,'APPROVED')",Long.class,order,item,buyer,product,tag+" review");
 }
 int product(String suffix){return sql.queryForObject("INSERT PRODUCTS(slug,name,category_id,brand_id,base_price,status) OUTPUT INSERTED.id SELECT ?,?,MIN(c.id),MIN(b.id),100,'ACTIVE' FROM CATEGORIES c CROSS JOIN BRANDS b",Integer.class,(tag+suffix).toLowerCase(Locale.ROOT),tag+suffix);}
 @AfterEach void clear(){SecurityContextHolder.clearContext();}
 @Test void reviewAuthorityAndOfficialIdentity(){
  assertEquals(1,reviews.list(auth(manager,"MANAGER"),0,tag,null,"",null).total());assertEquals(0,reviews.list(auth(otherManager,"MANAGER"),0,tag,null,"",null).total());
  assertThrows(AccessDeniedException.class,()->reviews.reply(review,"foreign",auth(otherManager,"MANAGER")));
  assertEquals(0,reviews.list(auth(support,"SUPPORT"),0,tag,null,"",null).total());assertThrows(AccessDeniedException.class,()->reviews.reply(review,"unassigned",auth(support,"SUPPORT")));
  sql.update("INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(?,?,1)",store,support);reviews.reply(review,"Helpful reply",auth(support,"SUPPORT"));reviews.reply(review,"Replacement",auth(manager,"MANAGER"));reviews.reply(review,"Support response",auth(support,"SUPPORT"));
  assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM REVIEW_RESPONSES WHERE review_id=?",Integer.class,review));
  var publicReview=catalog.getProductDetailDTO(product,buyer).getReviews().getFirst();assertEquals(tag+" Store",publicReview.getResponseStore());assertEquals("Support response",publicReview.getResponse());assertFalse(publicReview.toString().contains(support));assertFalse(publicReview.toString().contains("PRIVATE SUPPORT"));
  assertEquals("PRIVATE SUPPORT",reviews.list(auth(admin,"ADMIN"),0,tag,null,"yes",store).items().getFirst().get("responder"));assertThrows(AccessDeniedException.class,()->reviews.delete(review,auth(support,"SUPPORT")));
 }
 @Test void reviewDeleteRemovesResponseAndDeniesOtherStore(){reviews.reply(review,"reply",auth(manager,"MANAGER"));assertThrows(AccessDeniedException.class,()->reviews.delete(review,auth(otherManager,"MANAGER")));reviews.delete(review,auth(manager,"MANAGER"));assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM REVIEW_RESPONSES WHERE review_id=?",Integer.class,review));assertTrue(catalog.getProductDetailDTO(product,buyer).getReviews().isEmpty());}
 @Test void adminDeletesUnscopedLegacyWithoutGrantingStaffScope(){sql.update("UPDATE REVIEWS SET product_id=(SELECT MIN(id) FROM PRODUCTS WHERE id<>?) WHERE id=?",product,review);assertEquals(0,reviews.list(auth(manager,"MANAGER"),0,tag,null,"",null).total());assertThrows(Exception.class,()->reviews.reply(review,"reply",auth(admin,"ADMIN")));reviews.delete(review,auth(admin,"ADMIN"));}
 @Test void reviewHttpRolesAndCsrf()throws Exception {for(String role:List.of("USER","SUPPORT")){mvc.perform(post("/api/support/reviews/"+review+"/delete").with(user(buyer).roles(role)).with(csrf())).andExpect(status().isForbidden());}mvc.perform(post("/api/manager/reviews/"+review+"/reply").with(user(manager).roles("MANAGER")).contentType("application/json").content("{\"content\":\"hello\"}")).andExpect(status().isForbidden());mvc.perform(get("/api/support/reviews").with(user(buyer).roles("USER"))).andExpect(status().isForbidden());}
 @Test void selectedDashboardWindowsAndCrossRoleMetrics(){for(var p:List.of(new DashboardPeriod("DAY","2026-01-14",null,null,null,null),new DashboardPeriod("WEEK",null,"2026-01-10","2026-01-20",null,null),new DashboardPeriod("MONTH",null,null,null,"2026-01",null),new DashboardPeriod("YEAR",null,null,null,null,2026))){auth(manager,"MANAGER");var m=managerDashboard.dashboard(p);auth(admin,"ADMIN");var a=adminDashboard.dashboard(p,store);assertEquals(m.get("start"),a.get("start"));assertEquals(m.get("end"),a.get("end"));for(String k:List.of("revenue","orders","items_sold","average_order_value","pending_orders"))assertEquals(((Map<?,?>)m.get("kpi")).get(k),((Map<?,?>)a.get("kpi")).get(k));}assertThrows(Exception.class,()->new DashboardPeriod("WEEK",null,"2026-10-02","2026-10-01",null,null).window(Clock.systemUTC()));}
 @Test void filteredSortedExportIncludesAllPagesAndOnlyVisibleColumns()throws Exception {
  for(int i=2;i<=36;i++)product(String.format("%03d",i));auth(manager,"MANAGER");var file=reports.prepare(new ReportService.Prepare("PRODUCTS",Map.of("search",tag,"sort","name","direction","asc"),List.of("name","effective_price")));assertEquals(36,file.get("rowCount"));
  try(var wb=new XSSFWorkbook(new ByteArrayInputStream(reports.download(((Number)file.get("id")).longValue(),false).data()))){var s=wb.getSheetAt(0);assertEquals(2,s.getRow(6).getLastCellNum());assertEquals("Sản phẩm",s.getRow(6).getCell(0).getStringCellValue());assertEquals(tag+"001",s.getRow(7).getCell(0).getStringCellValue());assertEquals(tag+"036",s.getRow(42).getCell(0).getStringCellValue());assertEquals(CellType.NUMERIC,s.getRow(7).getCell(1).getCellType());assertNotNull(s.getPaneInformation());}
 }
 @Test void preparedFileScopeAndSentVisibility()throws Exception {auth(manager,"MANAGER");var file=reports.prepare(new ReportService.Prepare("PRODUCTS",Map.of("search",tag),List.of("name")));long id=((Number)file.get("id")).longValue();byte[] original=reports.download(id,false).data();auth(otherManager,"MANAGER");assertThrows(Exception.class,()->reports.download(id,false));assertThrows(Exception.class,()->reports.send(id));auth(admin,"ADMIN");assertEquals(0,reports.list(0,tag,store).total());assertThrows(Exception.class,()->reports.download(id,true));auth(manager,"MANAGER");reports.send(id);reports.send(id);auth(admin,"ADMIN");assertEquals(1,reports.list(0,"",store).total());assertArrayEquals(original,reports.download(id,true).data());}
 @Test void formulaTextAndTypedDatesAndDashboardData()throws Exception {
  sql.update("UPDATE PRODUCTS SET name='=HYPERLINK(\"https://invalid\")' WHERE id=?",product);auth(manager,"MANAGER");var file=reports.prepare(new ReportService.Prepare("PRODUCTS",Map.of("search","=HYPERLINK"),List.of("name","updated_at")));try(var wb=new XSSFWorkbook(new ByteArrayInputStream(reports.download(((Number)file.get("id")).longValue(),false).data()))){var row=wb.getSheetAt(0).getRow(7);assertEquals(CellType.STRING,row.getCell(0).getCellType());assertTrue(row.getCell(0).getStringCellValue().startsWith("="));assertTrue(DateUtil.isCellDateFormatted(row.getCell(1)));}
  file=reports.prepare(new ReportService.Prepare("DASHBOARD",Map.of("mode","DAY","date","2026-01-14"),List.of()));try(var wb=new XSSFWorkbook(new ByteArrayInputStream(reports.download(((Number)file.get("id")).longValue(),false).data()))){assertEquals(5,wb.getNumberOfSheets());assertTrue(wb.getSheetAt(0).getRow(4).getCell(0).getStringCellValue().contains("2026-01-14"));for(var s:wb)assertNull(s.getDrawingPatriarch());}
 }
 @Test void exportRejectsUntrustedFieldsAndHttpRoleAccess()throws Exception {auth(manager,"MANAGER");assertThrows(Exception.class,()->reports.prepare(new ReportService.Prepare("PRODUCTS",Map.of("storeId",String.valueOf(other)),List.of("name"))));assertThrows(Exception.class,()->reports.prepare(new ReportService.Prepare("PRODUCTS",Map.of(),List.of("password_hash"))));for(String role:List.of("USER","SUPPORT"))mvc.perform(get("/api/admin/reports").with(user(buyer).roles(role))).andExpect(status().isForbidden());mvc.perform(post("/api/manager/exports/prepare").with(user(manager).roles("MANAGER")).contentType("application/json").content("{}")).andExpect(status().isForbidden());}
 @Test void conversationDeleteAuthorityAndFkOrder(){long id=((Number)chat.direct(store,auth(buyer,"USER")).get("id")).longValue();chat.send(id,new SupportChatService.Send(UUID.randomUUID().toString(),"fixture"),auth(buyer,"USER"));long message=sql.queryForObject("SELECT MAX(id) FROM SUPPORT_MESSAGES WHERE conversation_id=?",Long.class,id);chat.read(id,new SupportChatService.ReadState(message),auth(manager,"MANAGER"));assertThrows(AccessDeniedException.class,()->chat.delete(id,auth(otherManager,"MANAGER")));assertThrows(AccessDeniedException.class,()->chat.delete(id,auth(support,"SUPPORT")));chat.delete(id,auth(manager,"MANAGER"));assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM SUPPORT_MESSAGES WHERE conversation_id=?",Integer.class,id));assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM SUPPORT_CONVERSATION_READ_STATE WHERE conversation_id=?",Integer.class,id));assertNotEquals(id,((Number)chat.direct(store,auth(buyer,"USER")).get("id")).longValue());}
 @Test void catalogFiltersUseActiveVariantsStockAndCanonicalPrice(){String category=sql.queryForObject("SELECT c.slug FROM CATEGORIES c JOIN PRODUCTS p ON p.category_id=c.id WHERE p.id=?",String.class,product);String brand=sql.queryForObject("SELECT b.slug FROM BRANDS b JOIN PRODUCTS p ON p.brand_id=b.id WHERE p.id=?",String.class,product);var f=new PricingService.CatalogFilter("41","blue",BigDecimal.ZERO,new BigDecimal("999999"),true,false);assertEquals(1,catalog.filteredProducts(tag,category,brand,"price-asc",0,buyer,null,f).getTotalElements());assertEquals(0,catalog.filteredProducts(tag,category,brand,"popular",0,buyer,null,new PricingService.CatalogFilter("42",null,null,null,null,null)).getTotalElements());sql.update("UPDATE PRODUCT_VARIANTS SET status='INACTIVE' WHERE id=?",variant);assertEquals(0,catalog.filteredProducts(tag,category,brand,"popular",0,buyer,null,f).getTotalElements());}
 @Test void supportRoutesAreDedicatedAndManagerForbidden()throws Exception {mvc.perform(get("/support").with(user(support).roles("SUPPORT"))).andExpect(status().isOk());mvc.perform(get("/support/reviews").with(user(support).roles("SUPPORT"))).andExpect(status().isOk());mvc.perform(get("/manager/support").with(user(support).roles("SUPPORT"))).andExpect(status().isForbidden());mvc.perform(get("/admin/system-config").with(user(admin).roles("ADMIN"))).andExpect(redirectedUrl("/admin/history"));}
 @Test void inventoryOrdersAndPaymentsExportUseAuthoritativeFilters()throws Exception {
  sql.update("INSERT PAYMENTS(order_id,method,status,amount) VALUES(?,'COD','PAID',100)",order);auth(manager,"MANAGER");
  for(var input:List.of(new ReportService.Prepare("INVENTORY",Map.of("search",tag,"sizeFilter","41","color","blue"),List.of("sku","quantity")),new ReportService.Prepare("ORDERS",Map.of("search",tag,"status","Đã giao"),List.of("order_code","merchandise_value","created_at")),new ReportService.Prepare("PAYMENTS",Map.of("search",tag,"status","PAID","method","COD"),List.of("order_code","amount")))){
   var f=reports.prepare(input);assertEquals(1,f.get("rowCount"));try(var wb=new XSSFWorkbook(new ByteArrayInputStream(reports.download(((Number)f.get("id")).longValue(),false).data()))){assertEquals(CellType.NUMERIC,wb.getSheetAt(0).getRow(7).getCell(1).getCellType());}
  }
  assertEquals(0,reports.prepare(new ReportService.Prepare("PAYMENTS",Map.of("search",tag,"status","FAILED"),List.of("order_code"))).get("rowCount"));
 }
 @Test void reviewReplyHttpScopeAndValidation()throws Exception {
  String url="/api/support/reviews/"+review+"/reply";
  mvc.perform(post(url).with(user(support).roles("SUPPORT")).with(csrf()).contentType("application/json").content("{\"content\":\"reply\"}")).andExpect(status().isForbidden());
  sql.update("INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(?,?,1)",store,support);
  mvc.perform(post(url).with(user(support).roles("SUPPORT")).with(csrf()).contentType("application/json").content("{\"content\":\"reply\"}")).andExpect(status().isOk());
  mvc.perform(post(url).with(user(support).roles("SUPPORT")).with(csrf()).contentType("application/json").content("{\"content\":\"<script>bad</script>\"}")).andExpect(status().isBadRequest());
  mvc.perform(post("/api/manager/reviews/"+review+"/reply").with(user(otherManager).roles("MANAGER")).with(csrf()).contentType("application/json").content("{\"content\":\"reply\"}")).andExpect(status().isForbidden());
 }
 @Test void catalogPriceAndSaleUsePromotionWinnerAndUnavailableIsAggregate(){
  int promo=sql.queryForObject("INSERT PROMOTIONS(name,scope,priority,discount_type,discount_value,status,starts_at,ends_at) OUTPUT INSERTED.id VALUES(?,'PRODUCT',100,'PERCENT',50,'ACTIVE',DATEADD(day,-1,SYSDATETIME()),DATEADD(day,1,SYSDATETIME()))",Integer.class,tag);
  sql.update("INSERT PRODUCT_PROMOTIONS(product_id,promotion_id) VALUES(?,?)",product,promo);
  var f=new PricingService.CatalogFilter("41","blue",new BigDecimal("50"),new BigDecimal("50"),true,true);assertEquals(1,catalog.filteredProducts(tag,null,null,"price-desc",0,buyer,null,f).getTotalElements());
  sql.update("UPDATE STORES SET status='CLOSED' WHERE store_id=?",store);assertEquals(1,catalog.filteredProducts(tag,null,null,"price-asc",0,buyer,null,f).getTotalElements());
  assertEquals(0,catalog.filteredProducts(tag,null,null,"popular",0,buyer,null,new PricingService.CatalogFilter(null,null,null,new BigDecimal("49"),null,true)).getTotalElements());
  sql.update("INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,status) VALUES(?,'42','red',?,0,'ACTIVE')",product,tag+"-out");
  assertEquals(0,catalog.filteredProducts(tag,null,null,"popular",0,buyer,null,new PricingService.CatalogFilter(null,null,null,null,false,null)).getTotalElements());
  assertEquals(1,catalog.filteredProducts(tag,null,null,"popular",0,buyer,null,new PricingService.CatalogFilter("42","red",null,null,false,null)).getTotalElements());
 }
 @Test void administratorConversationAndReviewDeleteAreGlobal(){long id=((Number)chat.direct(other,auth(buyer,"USER")).get("id")).longValue();chat.delete(id,auth(admin,"ADMIN"));reviews.reply(review,"Admin reply",auth(admin,"ADMIN"));assertEquals(tag+" Store",reviews.publicReviews(product).getFirst().getResponseStore());reviews.delete(review,auth(admin,"ADMIN"));}
 @Test void reviewPagingIsThirtyAndFiltersApplyBeforePagination(){
  for(int n=2;n<=35;n++){int p=product("review"+n);long v=sql.queryForObject("INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,status) OUTPUT INSERTED.id VALUES(?,'41','blue',?,0,'ACTIVE')",Long.class,p,tag+"review"+n);long i=sql.queryForObject("INSERT ORDER_ITEMS(order_id,product_id,store_id,variant_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) OUTPUT INSERTED.id VALUES(?,?,?,?,?,'fixture',1,100,0,100)",Long.class,order,p,store,v,tag);sql.update("INSERT REVIEWS(order_id,order_item_id,user_email,product_id,rating,comment,status) VALUES(?,?,?,?,4,?,'APPROVED')",order,i,buyer,p,tag);}
  var first=reviews.list(auth(manager,"MANAGER"),0,tag,null,"",null);var second=reviews.list(auth(manager,"MANAGER"),1,tag,null,"",null);assertEquals(35,first.total());assertEquals(30,first.items().size());assertEquals(5,second.items().size());assertEquals(30,first.size());assertEquals(1,reviews.list(auth(manager,"MANAGER"),0,tag,5,"",null).total());
 }
 @Test void assignmentRevocationAndDisabledStaffImmediatelyDenyAccess(){
  sql.update("INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(?,?,1)",store,support);reviews.reply(review,"reply",auth(support,"SUPPORT"));sql.update("UPDATE STORE_STAFF_ASSIGNMENTS SET active=0 WHERE user_email=?",support);assertThrows(AccessDeniedException.class,()->reviews.reply(review,"revoked",auth(support,"SUPPORT")));sql.update("UPDATE USERS SET is_enabled=0 WHERE email=?",manager);assertThrows(AccessDeniedException.class,()->reviews.reply(review,"disabled",auth(manager,"MANAGER")));
 }
 @Test void responseStoreFkPreventsProvenanceMismatch(){reviews.reply(review,"reply",auth(manager,"MANAGER"));assertThrows(org.springframework.dao.DataIntegrityViolationException.class,()->sql.update("UPDATE REVIEW_RESPONSES SET store_id=? WHERE review_id=?",other,review));}
 @Test void categoryPagingFiltersAndSortShareTheSameResultSet()throws Exception {
  for(int n=2;n<=14;n++)product("page"+n);var f=new PricingService.CatalogFilter(null,null,BigDecimal.ZERO,new BigDecimal("100000"),null,null);var first=catalog.filteredProducts(tag,null,null,"price-asc",0,buyer,null,f);var next=catalog.filteredProducts(tag,null,null,"price-asc",1,buyer,null,f);assertEquals(14,first.getTotalElements());assertEquals(12,first.getContent().size());assertEquals(2,next.getContent().size());assertTrue(first.getContent().stream().noneMatch(p->next.getContent().stream().anyMatch(q->q.getProductId().equals(p.getProductId()))));
  mvc.perform(get("/categories").param("keyword",tag).param("minPrice","0").param("maxPrice","100000").param("sort","price-asc")).andExpect(status().isOk()).andExpect(content().string(org.hamcrest.Matchers.containsString("maxPrice=100000"))).andExpect(content().string(org.hamcrest.Matchers.containsString("sort=price-asc")));
 }
 @Test void approvedLiveSupportHasNoInventedStoreScope(){var a=auth("support1@twinkle.com","SUPPORT");assertTrue(((List<?>)chat.staffContext(a).get("stores")).isEmpty());assertEquals(0,chat.staffInbox(a,0,30).total());assertEquals(0,reviews.list(a,0,"",null,"",null).total());}
}
