package cyan.project.twinkle.manager;

import cyan.project.twinkle.chat.support.*;
import cyan.project.twinkle.service.InventoryStateService;
import cyan.project.twinkle.service.CartService;
import cyan.project.twinkle.service.CheckoutService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import java.util.*;
import java.math.BigDecimal;
import java.time.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @Transactional @org.springframework.test.context.event.RecordApplicationEvents
class ManagerIntegrationTests {
 @org.springframework.test.context.bean.override.mockito.MockitoBean java.time.Clock managerClock;
 @Autowired JdbcTemplate sql;
 @Autowired jakarta.persistence.EntityManager entityManager;
 @Autowired org.springframework.test.context.event.ApplicationEvents applicationEvents;
 @Autowired ManagerStoreContextService context;
 @Autowired ManagerOperationsService operations;
 @Autowired ManagerQueryService queries;
 @Autowired ManagerDashboardService dashboard;
 @Autowired StoreFulfillmentService fulfillment;
 @Autowired InventoryStateService customerStock;
 @Autowired CartService cart;
 @Autowired CheckoutService checkout;
 @Autowired SupportChatService chat;
 @Autowired WebApplicationContext web;
 String managerA,managerB,buyer;int a,b,product;long variant;
 MockMvc mvc;
 void auth(String email){SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(email,"",List.of(new SimpleGrantedAuthority("ROLE_MANAGER"))));}
 @BeforeEach void setup(){
  org.mockito.Mockito.when(managerClock.getZone()).thenReturn(ZoneId.of("Asia/Ho_Chi_Minh"));
  org.mockito.Mockito.when(managerClock.instant()).thenReturn(LocalDate.of(2026,10,5).atTime(12,0).atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant());
  mvc=MockMvcBuilders.webAppContextSetup(web).apply(springSecurity()).build();
  String tag="MTEST"+System.nanoTime();managerA=tag+"a@test.invalid";managerB=tag+"b@test.invalid";buyer=tag+"u@test.invalid";
  for(String email:List.of(managerA,managerB,buyer)) {
   sql.update("INSERT USERS(email,username,password_hash,is_enabled) VALUES(?,?,?,1)",email,"synthetic-manager-test","!disabled-synthetic");
   sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name=?",email,email.equals(buyer)?"ROLE_USER":"ROLE_MANAGER");
  }
  a=sql.queryForObject("INSERT STORES(slug,name,address_line,city,status,rating_average,review_count,manager_email) OUTPUT INSERTED.store_id VALUES(?,?,'test','test','OPEN',0,0,?)",Integer.class,tag+"a",tag+"a",managerA);
  b=sql.queryForObject("INSERT STORES(slug,name,address_line,city,status,rating_average,review_count,manager_email) OUTPUT INSERTED.store_id VALUES(?,?,'test','test','OPEN',0,0,?)",Integer.class,tag+"b",tag+"b",managerB);
  product=sql.queryForObject("INSERT PRODUCTS(slug,name,category_id,brand_id,base_price,status) OUTPUT INSERTED.id SELECT ?,?,MIN(c.id),MIN(br.id),100,'ACTIVE' FROM CATEGORIES c CROSS JOIN BRANDS br",Integer.class,tag,tag);
  variant=sql.queryForObject("INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,status) OUTPUT INSERTED.id VALUES(?,'41','test',?,0,'ACTIVE')",Long.class,product,tag);
  sql.update("INSERT STORE_INVENTORY(store_id,variant_id,quantity,reorder_level) VALUES(?,?,10,10),(?,?,77,10)",a,variant,b,variant);
  auth(managerA);
 }
 @AfterEach void clear(){SecurityContextHolder.clearContext();}
 ManagerQueryService.PageDto list(String area,int page,int size,String search,String status){return queries.list(area,page,size,search,status,"id","desc","","","","",null,"","","","");}
 long order(String status,LocalDateTime date,int store,int quantity,int value){
  long id=sql.queryForObject("INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total,created_at,updated_at) OUTPUT INSERTED.id VALUES(?,?,?,'synthetic','0','test','test','test','test','COD',?,0,0,0,?,?,?)",Long.class,"MTEST-"+UUID.randomUUID().toString().replace("-",""),buyer,status,value,value,date,date);
  line(id,store,quantity,value);return id;
 }
 void line(long order,int store,int quantity,int value){sql.update("INSERT ORDER_ITEMS(order_id,product_id,variant_id,store_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) VALUES(?,?,?,?,'snapshot','41-test',?,?,0,?)",order,product,variant,store,quantity,new BigDecimal(value).divide(BigDecimal.valueOf(quantity),2,java.math.RoundingMode.HALF_UP),value);}
 @Test void contextRechecksRoleEnabledAndMissingAssignment(){assertEquals(a,context.requireCurrentStore().getId());auth(buyer);assertThrows(AccessDeniedException.class,context::requireCurrentStore);auth(managerA);sql.update("UPDATE USERS SET is_enabled=0 WHERE email=?",managerA);assertThrows(AccessDeniedException.class,context::requireCurrentStore);sql.update("UPDATE USERS SET is_enabled=1 WHERE email=?",managerA);sql.update("UPDATE STORES SET manager_email=NULL WHERE store_id=?",a);assertEquals("NOT_FOUND",assertThrows(ManagerException.class,context::requireCurrentStore).code);}
 @Test void storeStatusAuditedOnceAndScopeCannotBeOverridden() throws Exception {
  mvc.perform(post("/api/manager/store/status?storeId="+b).with(user(managerA).roles("MANAGER")).with(csrf()).contentType("application/json").content("{\"status\":\"CLOSED\",\"managerEmail\":\""+managerB+"\"}")).andExpect(status().isOk());
  assertEquals("CLOSED",sql.queryForObject("SELECT status FROM STORES WHERE store_id=?",String.class,a));assertEquals("OPEN",sql.queryForObject("SELECT status FROM STORES WHERE store_id=?",String.class,b));
  auth(managerA);operations.status(new ManagerOperationsService.StatusChange("CLOSED"));assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM STORE_STATUS_HISTORY WHERE store_id=? AND changed_by=?",Integer.class,a,managerA));
  assertEquals("AVAILABLE",customerStock.state(10));cart.addToCart(buyer,variant,a,1);assertFalse(checkout.quote(buyer,null).items().isEmpty());
 }
 @Test void managerPagesDeepLinksRolesAndCsrf() throws Exception {
  for(String route:List.of("/manager","/manager/products","/manager/variants","/manager/inventory","/manager/orders","/manager/support","/manager/store-profile"))mvc.perform(get(route).with(user(managerA).roles("MANAGER"))).andExpect(status().isOk());
  mvc.perform(get("/manager").with(user(buyer).roles("USER"))).andExpect(status().isForbidden());mvc.perform(get("/api/manager/context").with(user(buyer).roles("USER"))).andExpect(status().isForbidden());
  mvc.perform(post("/api/manager/store/status").with(user(managerA).roles("MANAGER")).contentType("application/json").content("{\"status\":\"CLOSED\"}")).andExpect(status().isForbidden());
  for(String path:List.of("/api/manager/products/"+product,"/api/manager/variants/"+variant))mvc.perform(delete(path).with(user(managerA).roles("MANAGER")).with(csrf())).andExpect(status().isMethodNotAllowed());
 }
 @Test void catalogPagesPricingDetailsAndRequests(){
  var page=list("products",0,1,sql.queryForObject("SELECT name FROM PRODUCTS WHERE id=?",String.class,product),"ACTIVE");assertEquals(1,page.total());assertEquals(1,page.items().size());assertEquals(0,list("products",1,1,sql.queryForObject("SELECT name FROM PRODUCTS WHERE id=?",String.class,product),"ACTIVE").items().size());
  assertNotNull(page.items().getFirst().get("effective_price"));var detail=queries.product(product);assertTrue(detail.containsKey("promotions"));assertEquals(10,((Number)queries.variant(variant).get("quantity")).intValue());
  long id=operations.catalog(new ManagerOperationsService.CatalogRequest("UPDATE_PRODUCT",product,null,"test","proposal",null,null,null,null,null));
  assertEquals(managerA,sql.queryForObject("SELECT requester_email FROM CATALOG_CHANGE_REQUESTS WHERE id=?",String.class,id));assertEquals(a,sql.queryForObject("SELECT store_id FROM CATALOG_CHANGE_REQUESTS WHERE id=?",Integer.class,id));assertNotEquals("proposal",sql.queryForObject("SELECT name FROM PRODUCTS WHERE id=?",String.class,product));
  assertEquals(1,list("catalog-requests",0,20,"test","").total());auth(managerB);assertEquals(0,list("catalog-requests",0,20,"test","").total());
 }
 @Test void variantRequestsAndInventoryScope(){
  assertEquals(1,list("variants",0,20,sql.queryForObject("SELECT sku FROM PRODUCT_VARIANTS WHERE id=?",String.class,variant),"").total());
  long id=operations.catalog(new ManagerOperationsService.CatalogRequest("UPDATE_VARIANT",product,variant,"test",null,null,null,"42","blue",BigDecimal.ZERO));assertEquals(a,sql.queryForObject("SELECT store_id FROM CATALOG_CHANGE_REQUESTS WHERE id=?",Integer.class,id));assertEquals("41",sql.queryForObject("SELECT size FROM PRODUCT_VARIANTS WHERE id=?",String.class,variant));
  assertEquals(1,list("inventory",0,20,"","LOW").total());assertEquals(10,((Number)list("inventory",0,20,"","").items().getFirst().get("quantity")).intValue());
 }
 @Test void thresholdsAndRestockDuplicateNoStockMutation(){
  assertEquals("OUT",ManagerQueryService.replenishment(0,10));assertEquals("LOW",ManagerQueryService.replenishment(10,10));assertEquals("AVAILABLE",ManagerQueryService.replenishment(11,10));assertEquals("LOW",ManagerQueryService.replenishment(3,3));assertEquals("AVAILABLE",ManagerQueryService.replenishment(4,3));
  long id=operations.restock(new ManagerOperationsService.RestockRequest(variant,20,"test",null));assertEquals(managerA,sql.queryForObject("SELECT requested_by FROM INVENTORY_RESTOCK_REQUESTS WHERE id=?",String.class,id));assertEquals("DUPLICATE_REQUEST",assertThrows(ManagerException.class,()->operations.restock(new ManagerOperationsService.RestockRequest(variant,20,"test",null))).code);
  assertEquals(10,sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WHERE store_id=? AND variant_id=?",Integer.class,a,variant));
 }
 @Test void restockOutOfStockNormalStockAndForeignVariant(){
  sql.update("UPDATE STORE_INVENTORY SET quantity=0 WHERE store_id=?",a);assertTrue(operations.restock(new ManagerOperationsService.RestockRequest(variant,10,"test",null))>0);
  sql.update("UPDATE STORE_INVENTORY SET quantity=11 WHERE store_id=?",a);assertEquals("CONFLICT",assertThrows(ManagerException.class,()->operations.restock(new ManagerOperationsService.RestockRequest(variant,20,"test",null))).code);
  sql.update("DELETE INVENTORY_RESTOCK_REQUESTS WHERE store_id=?",a);sql.update("DELETE STORE_INVENTORY WHERE store_id=?",a);assertThrows(AccessDeniedException.class,()->operations.restock(new ManagerOperationsService.RestockRequest(variant,20,"test",null)));
 }
 @Test void profileAllowsOnlyPublicFields() throws Exception {
  mvc.perform(post("/api/manager/store").with(user(managerA).roles("MANAGER")).with(csrf()).contentType("application/json").content("{\"name\":\"public profile\",\"addressLine\":\"address\",\"city\":\"city\",\"managerEmail\":\""+managerB+"\",\"storeId\":"+b+"}")).andExpect(status().isOk());assertEquals(managerA,sql.queryForObject("SELECT manager_email FROM STORES WHERE store_id=?",String.class,a));assertNotEquals("public profile",sql.queryForObject("SELECT name FROM STORES WHERE store_id=?",String.class,b));
 }
 @Test void multiStoreFulfillmentDoesNotChangeOtherStoreAndGlobalHistory(){
  long id=order("Chờ xác nhận đơn hàng",LocalDateTime.now(),a,1,100);line(id,b,2,400);fulfillment.transition(id,"Đã xác nhận");
  assertEquals("Chờ xác nhận đơn hàng",sql.queryForObject("SELECT status FROM ORDER_STORE_FULFILLMENTS WHERE order_id=? AND store_id=?",String.class,id,b));assertEquals("Chờ xác nhận đơn hàng",sql.queryForObject("SELECT status FROM ORDERS WHERE id=?",String.class,id));
  for(String next:List.of("Đang chuẩn bị đơn hàng","Đơn hàng đã sẵn sàng","Đang giao","Đã giao"))fulfillment.transition(id,next);assertEquals("Chờ xác nhận đơn hàng",sql.queryForObject("SELECT status FROM ORDERS WHERE id=?",String.class,id));
  assertEquals(0,applicationEvents.stream(cyan.project.twinkle.event.OrderDeliveredEvent.class).count());
  auth(managerB);for(String next:List.of("Đã xác nhận","Đang chuẩn bị đơn hàng","Đơn hàng đã sẵn sàng","Đang giao","Đã giao"))fulfillment.transition(id,next);assertEquals("Đã giao",sql.queryForObject("SELECT status FROM ORDERS WHERE id=?",String.class,id));assertEquals(5,sql.queryForObject("SELECT COUNT(*) FROM ORDER_STATUS_HISTORY WHERE order_id=?",Integer.class,id));assertThrows(ManagerException.class,()->fulfillment.transition(id,"Đã giao"));
  assertEquals(1,applicationEvents.stream(cyan.project.twinkle.event.OrderDeliveredEvent.class).count());
 }
 @Test void ordersAndDashboardExcludeStoreBForEveryRange(){
  var today=LocalDate.of(2026,10,5);var date=today.atTime(10,0);
  long own=order("Đã giao",date,a,2,200);long foreign=order("Đã giao",date,b,8,800);long pending=order("Chờ xác nhận đơn hàng",date,a,1,100);
  assertEquals(2,list("orders",0,20,"","").total());assertEquals(1,((List<?>)queries.order(own).get("items")).size());assertThrows(AccessDeniedException.class,()->queries.order(foreign));
  for(String range:List.of("DAY","WEEK","MONTH","YEAR")){
   var d=dashboard.dashboard(range);var k=(Map<?,?>)d.get("kpi");assertEquals(0,new BigDecimal("200").compareTo((BigDecimal)k.get("revenue")));assertEquals(2,((Number)k.get("orders")).intValue());assertEquals(2,((Number)k.get("items_sold")).intValue());assertEquals(1,((Number)k.get("pending_orders")).intValue());assertEquals(0,new BigDecimal("200").compareTo((BigDecimal)k.get("average_order_value")));
   assertEquals(1,((List<?>)d.get("trend")).size());for(String key:List.of("top_products","top_sizes","top_colors"))assertEquals(2,((Number)((Map<?,?>)((List<?>)d.get(key)).getFirst()).get("value")).intValue());
   assertEquals(2,((Number)((Map<?,?>)((List<?>)d.get("payments")).getFirst()).get("value")).intValue());assertEquals(1,((Number)((Map<?,?>)((List<?>)d.get("inventory")).getFirst()).get("value")).intValue());
  }
 }
 @Test void dashboardCancellationRestockSupportAndScope(){
  order("Đã hủy",LocalDate.of(2026,10,5).atTime(10,0),a,1,100);operations.restock(new ManagerOperationsService.RestockRequest(variant,20,"test",null));
  long c=sql.queryForObject("INSERT SUPPORT_CONVERSATIONS(user_email,store_id,source,status) OUTPUT INSERTED.id VALUES(?,?,'DIRECT','OPEN')",Long.class,buyer,a);sql.update("INSERT SUPPORT_MESSAGES(conversation_id,sender_type,sender_email,content) VALUES(?,'USER',?,'test')",c,buyer);
  var d=dashboard.dashboard("YEAR");assertEquals(1.0,((Map<?,?>)d.get("kpi")).get("cancellation_rate"));assertEquals(1,((Number)((Map<?,?>)((List<?>)d.get("restock")).getFirst()).get("value")).intValue());assertEquals(1,((Number)((Map<?,?>)d.get("support")).get("unread_conversations")).intValue());auth(managerB);var foreign=dashboard.dashboard("YEAR");assertTrue(((List<?>)foreign.get("restock")).isEmpty());assertEquals(0,((Number)((Map<?,?>)foreign.get("support")).get("conversations")).intValue());
 }
 @Test void chatReadIsPerStaffPagedAndCrossStoreDenied(){
  long c=sql.queryForObject("INSERT SUPPORT_CONVERSATIONS(user_email,store_id,source,status) OUTPUT INSERTED.id VALUES(?,?,'DIRECT','OPEN')",Long.class,buyer,a);long message=sql.queryForObject("INSERT SUPPORT_MESSAGES(conversation_id,sender_type,sender_email,content) OUTPUT INSERTED.id VALUES(?,'USER',?,'test')",Long.class,c,buyer);
  var auth=SecurityContextHolder.getContext().getAuthentication();assertEquals(1,((Number)chat.staffInbox(auth,0,20).items().getFirst().get("unreadCount")).intValue());chat.read(c,new SupportChatService.ReadState(message),auth);assertEquals(0,((Number)chat.staffInbox(auth,0,20).items().getFirst().get("unreadCount")).intValue());assertEquals(1,chat.messages(c,0,auth).size());chat.send(c,new SupportChatService.Send(UUID.randomUUID().toString(),"staff reply"),auth);assertEquals(2,chat.messages(c,0,auth).size());
  sql.update("INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(?,?,1)",a,managerB);sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name='ROLE_SUPPORT'",managerB);var supportAuth=new UsernamePasswordAuthenticationToken(managerB,"",List.of(new SimpleGrantedAuthority("ROLE_SUPPORT")));assertEquals(1,((Number)chat.staffInbox(supportAuth,0,20).items().getFirst().get("unreadCount")).intValue());assertTrue(chat.staffInbox(auth,1,20).items().isEmpty());auth(managerB);assertThrows(AccessDeniedException.class,()->chat.messages(c,0,SecurityContextHolder.getContext().getAuthentication()));
 }
 @Test void timeBoundariesUseCalendarVietnamAndAggregationIsDeterministic(){
  var date=LocalDate.of(2026,10,5);assertEquals(date.atStartOfDay(),ManagerDashboardService.window("DAY",date).start());assertEquals(date.plusDays(1).atStartOfDay(),ManagerDashboardService.window("DAY",date).end());assertEquals(LocalDate.of(2026,10,12).atStartOfDay(),ManagerDashboardService.window("WEEK",date).end());assertEquals(LocalDate.of(2026,11,1).atStartOfDay(),ManagerDashboardService.window("MONTH",date).end());assertEquals(LocalDate.of(2027,1,1).atStartOfDay(),ManagerDashboardService.window("YEAR",date).end());
  assertEquals("Đã xác nhận",StoreFulfillmentService.aggregate(List.of("Đã giao","Đã xác nhận")));assertEquals("Đã giao",StoreFulfillmentService.aggregate(List.of("Đã giao","Đã hủy")));assertEquals("Đã hủy",StoreFulfillmentService.aggregate(List.of("Đã hủy")));
 }
 @Test void groupingAndBoundariesMatchDirectFixtureTotals(){
  order("Đã giao",LocalDateTime.of(2026,10,5,10,0),a,1,100);order("Đã giao",LocalDateTime.of(2026,10,5,11,0),a,1,200);
  order("Đã giao",LocalDateTime.of(2026,10,6,10,0),a,1,300);order("Đã giao",LocalDateTime.of(2026,10,1,10,0),a,1,400);order("Đã giao",LocalDateTime.of(2026,1,1,10,0),a,1,500);order("Đã giao",LocalDateTime.of(2026,10,5,10,0),b,1,9000);
  for(var fixture:Map.of("DAY",new int[]{300,2},"WEEK",new int[]{600,2},"MONTH",new int[]{1000,3},"YEAR",new int[]{1500,2}).entrySet()) {
   var d=dashboard.dashboard(fixture.getKey());assertEquals(0,BigDecimal.valueOf(fixture.getValue()[0]).compareTo((BigDecimal)((Map<?,?>)d.get("kpi")).get("revenue")));assertEquals(fixture.getValue()[1],((List<?>)d.get("trend")).size());
  }
 }
 @Test void loginRedirectInactiveAndMissingStoreAreControlled() throws Exception {
  String password=UUID.randomUUID().toString();sql.update("UPDATE USERS SET password_hash=? WHERE email=?",new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(password),managerA);
  mvc.perform(post("/login").with(csrf()).param("email",managerA).param("password",password)).andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/manager"));
  sql.update("UPDATE USERS SET is_enabled=0 WHERE email=?",managerA);entityManager.clear();mvc.perform(post("/login").with(csrf()).param("email",managerA).param("password",password)).andExpect(redirectedUrl("/login?error"));
  sql.update("UPDATE USERS SET is_enabled=1 WHERE email=?",managerA);sql.update("UPDATE STORES SET manager_email=NULL WHERE store_id=?",a);mvc.perform(get("/api/manager/context").with(user(managerA).roles("MANAGER"))).andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("NOT_FOUND"));
 }
 @Test void noApprovalOrDirectMutationRoutesAreExposed() throws Exception {
  for(String path:List.of("/api/manager/restock-requests/1/approve","/api/manager/restock-requests/1/fulfill","/api/manager/inventory/"+variant,"/api/manager/catalog-requests/1/approve"))mvc.perform(post(path).with(user(managerA).roles("MANAGER")).with(csrf()).contentType("application/json").content("{}")).andExpect(status().isNotFound());
 }
 @Test void supportHistoryPagesHaveNoDuplicatesAndRejectForeignCursor(){
  long c=sql.queryForObject("INSERT SUPPORT_CONVERSATIONS(user_email,store_id,source,status) OUTPUT INSERTED.id VALUES(?,?,'DIRECT','OPEN')",Long.class,buyer,a);
  for(int i=0;i<55;i++)sql.update("INSERT SUPPORT_MESSAGES(conversation_id,sender_type,sender_email,content) VALUES(?,'USER',?,?)",c,buyer,"message "+i);
  var auth=SecurityContextHolder.getContext().getAuthentication();var latest=chat.messages(c,0,auth);assertEquals(50,latest.size());long cursor=((Number)latest.getFirst().get("id")).longValue();var earlier=chat.messages(c,cursor,auth);assertEquals(5,earlier.size());assertTrue(earlier.stream().noneMatch(latest::contains));
  long other=sql.queryForObject("INSERT SUPPORT_CONVERSATIONS(user_email,store_id,source,status) OUTPUT INSERTED.id VALUES(?,?,'DIRECT','OPEN')",Long.class,buyer,b);long wrong=sql.queryForObject("INSERT SUPPORT_MESSAGES(conversation_id,sender_type,sender_email,content) OUTPUT INSERTED.id VALUES(?,'USER',?,'foreign')",Long.class,other,buyer);assertThrows(org.springframework.web.server.ResponseStatusException.class,()->chat.read(c,new SupportChatService.ReadState(wrong),auth));
 }
}
