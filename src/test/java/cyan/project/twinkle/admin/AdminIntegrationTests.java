package cyan.project.twinkle.admin;
import cyan.project.twinkle.manager.*;
import cyan.project.twinkle.payment.*;
import cyan.project.twinkle.service.*;
import cyan.project.twinkle.repository.*;
import cyan.project.twinkle.chat.support.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import java.util.*;
import java.time.*;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties={"twinkle.payment.bank.bank-id=BIDV","twinkle.payment.bank.account-no=1234567890","twinkle.payment.bank.account-name=TWADMINTEST"}) @Transactional
class AdminIntegrationTests {
 @Autowired JdbcTemplate sql;@Autowired WebApplicationContext web;@Autowired AdminUserService users;@Autowired AdminStoreService stores;@Autowired AdminCatalogService catalog;@Autowired AdminRequestService requests;@Autowired AdminQueryService queries;@Autowired AdminPromotionService promotions;@Autowired AdminDashboardService dashboard;@Autowired ManagerDashboardService managerDashboard;@Autowired ManagerOperationsService manager;@Autowired StoreFulfillmentService fulfillment;@Autowired PaymentVerificationService payments;@Autowired PaymentQueryService paymentQueries;@Autowired ProductRepository products;@Autowired ProductVariantRepository variants;@Autowired PricingService pricing;@Autowired CartService cart;@Autowired CheckoutService checkout;@Autowired UserRepository userRepo;@Autowired SupportChatService chat;
 @Autowired org.springframework.security.crypto.password.PasswordEncoder encoder;
 @Autowired org.springframework.security.authentication.AuthenticationManager authentication;
 @Autowired jakarta.persistence.EntityManager em;
 String tag,admin,managerEmail,buyer,outsider;int store,other,product;long variant;MockMvc mvc;
 void auth(String email,String role){SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(email,"",List.of(new SimpleGrantedAuthority("ROLE_"+role))));}
 @BeforeEach void setup(){tag="TWADMINTEST"+System.nanoTime();admin=tag+"a@test.invalid";managerEmail=tag+"m@test.invalid";buyer=tag+"u@test.invalid";outsider=tag+"x@test.invalid";mvc=MockMvcBuilders.webAppContextSetup(web).apply(springSecurity()).build();
  for(String email:List.of(admin,managerEmail,buyer,outsider)){sql.update("INSERT USERS(email,username,password_hash,is_enabled) VALUES(?,?,?,1)",email,tag,"!unusable-test-password");sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name=?",email,email.equals(admin)?"ROLE_ADMIN":email.equals(managerEmail)||email.equals(outsider)?"ROLE_MANAGER":"ROLE_USER");}
  store=sql.queryForObject("INSERT STORES(slug,name,address_line,city,status,manager_email) OUTPUT INSERTED.store_id VALUES(?,?,'test','test','OPEN',?)",Integer.class,tag+"a",tag+"a",managerEmail);other=sql.queryForObject("INSERT STORES(slug,name,address_line,city,status,manager_email) OUTPUT INSERTED.store_id VALUES(?,?,'test','test','OPEN',?)",Integer.class,tag+"b",tag+"b",outsider);
  product=sql.queryForObject("INSERT PRODUCTS(slug,name,category_id,brand_id,base_price,status) OUTPUT INSERTED.id SELECT ?,?,MIN(c.id),MIN(b.id),100,'ACTIVE' FROM CATEGORIES c CROSS JOIN BRANDS b",Integer.class,tag.toLowerCase(java.util.Locale.ROOT),tag);variant=sql.queryForObject("INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,status) OUTPUT INSERTED.id VALUES(?,'41','blue',?,10,'ACTIVE')",Long.class,product,tag);sql.update("INSERT STORE_INVENTORY(store_id,variant_id,quantity,reorder_level) VALUES(?,?,10,10),(?,?,30,10)",store,variant,other,variant);auth(admin,"ADMIN");
 }
 @AfterEach void clear(){SecurityContextHolder.clearContext();}
 @Test void newMultiStoreCheckoutDisplaysFulfillmentsWithoutWritingOnRead() {
  long order=cyan.project.twinkle.CatalogTestFixtures.order(sql,buyer);
  sql.update("UPDATE ORDERS SET subtotal=200,total=200 WHERE id=?",order);
  for(int destination:List.of(store,other))sql.update("INSERT ORDER_ITEMS(order_id,product_id,variant_id,store_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) VALUES(?,?,?,?,?,'fixture',1,100,0,100)",order,product,variant,destination,tag);
  sql.update("INSERT PAYMENTS(order_id,method,status,amount) VALUES(?,'COD','PENDING',200)",order);
  var details=queries.detail("orders",Long.toString(order));
  var rows=(List<Map<String,Object>>)details.get("fulfillments");
  assertEquals(2,rows.size());assertTrue(rows.stream().allMatch(row->row.get("status").equals("Chờ xác nhận đơn hàng")));
  assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM ORDER_STORE_FULFILLMENTS WHERE order_id=?",Integer.class,order));
  fulfillment.transitionAdmin(order,store,"Đã xác nhận");
  assertEquals(2,sql.queryForObject("SELECT COUNT(*) FROM ORDER_STORE_FULFILLMENTS WHERE order_id=?",Integer.class,order));
  assertEquals("Đã xác nhận",sql.queryForObject("SELECT status FROM ORDER_STORE_FULFILLMENTS WHERE order_id=? AND store_id=?",String.class,order,store));
 }
 @Test void supportAssignmentsCreateReplaceRevokeAndReactivate() {
  String email=tag+"support@test.invalid";
  users.save(new AdminUserService.Account(email,"Support",null,null,true,Set.of("ROLE_SUPPORT"),Set.of(store,other)),true);
  var access=web.getBean(SupportAuthorizationService.class);
  var supportAuth=new UsernamePasswordAuthenticationToken(email,"",List.of(new SimpleGrantedAuthority("ROLE_SUPPORT")));
  assertTrue(access.staff(supportAuth,store));assertTrue(access.staff(supportAuth,other));
  assertEquals(2,((List<?>)chat.staffContext(supportAuth).get("stores")).size());
  assertEquals(Set.of(store,other),new HashSet<>((List<?>)queries.detail("users",email).get("support_store_ids")));
  var row=queries.list("users",0,30,email,"",null,"id","asc","","","","","","").items().getFirst();
  assertTrue(row.get("assigned_store").toString().contains(tag+"a"));assertTrue(row.get("assigned_store").toString().contains(tag+"b"));
  users.save(new AdminUserService.Account(email,"Support",null,null,true,Set.of("ROLE_SUPPORT"),Set.of(other)),false);
  assertFalse(access.staff(supportAuth,store));assertTrue(access.staff(supportAuth,other));
  users.save(new AdminUserService.Account(email,"Support",null,null,true,Set.of("ROLE_SUPPORT"),Set.of(store)),false);
  assertTrue(access.staff(supportAuth,store));assertFalse(access.staff(supportAuth,other));
  assertEquals(2,sql.queryForObject("SELECT COUNT(*) FROM STORE_STAFF_ASSIGNMENTS WHERE user_email=?",Integer.class,email));
  users.save(new AdminUserService.Account(email,"Renamed",null,null,true,Set.of("ROLE_SUPPORT")),false);
  assertTrue(access.staff(supportAuth,store)); // Older clients omitting assignments preserve them.
  users.save(new AdminUserService.Account(email,"Support",null,null,true,Set.of("ROLE_SUPPORT"),Set.of()),false);
  assertFalse(access.staff(supportAuth,store));
  users.save(new AdminUserService.Account(email,"Support",null,null,true,Set.of("ROLE_SUPPORT"),Set.of(store)),false);
  users.save(new AdminUserService.Account(email,"Support",null,null,false,Set.of("ROLE_SUPPORT"),Set.of()),false);
  assertFalse(access.staff(supportAuth,store));
  users.save(new AdminUserService.Account(email,"Support",null,null,true,Set.of("ROLE_SUPPORT"),Set.of(store)),false);
  users.save(new AdminUserService.Account(email,"Support",null,null,true,Set.of("ROLE_USER"),Set.of()),false);
  assertFalse(access.staff(supportAuth,store));
  assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM STORE_STAFF_ASSIGNMENTS WHERE user_email=? AND active=1",Integer.class,email));
  assertTrue(sql.queryForObject("SELECT COUNT(*) FROM ADMIN_AUDIT_LOG WHERE entity_id=? AND action_type='SUPPORT_STORES_ASSIGNED'",Integer.class,email)>0);
 }
 @Test void supportAssignmentApiValidatesAndRequiresAdminAndCsrf() throws Exception {
  String email=tag+"http-support@test.invalid";
  String body="{\"email\":\""+email+"\",\"username\":\"Support\",\"enabled\":true,\"roles\":[\"ROLE_SUPPORT\"],\"supportStoreIds\":["+store+"]}";
  for(String role:List.of("USER","MANAGER","SUPPORT"))
   mvc.perform(post("/api/admin/users").with(user(buyer).roles(role)).with(csrf()).contentType("application/json").content(body)).andExpect(status().isForbidden());
  mvc.perform(post("/api/admin/users").with(user(admin).roles("ADMIN")).contentType("application/json").content(body)).andExpect(status().isForbidden());
  mvc.perform(post("/api/admin/users").with(user(admin).roles("ADMIN")).with(csrf()).contentType("application/json").content(body)).andExpect(status().isOk());
  mvc.perform(get("/api/admin/users/"+email).with(user(admin).roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.support_store_ids[0]").value(store)).andExpect(jsonPath("$.support_stores[0].name").value(tag+"a"));
  for(String invalid:List.of(body.replace("["+store+"]","[2147483647]"),body.replace("["+store+"]","[0]"),body.replace("["+store+"]","[null]"),body.replace("ROLE_SUPPORT","ROLE_USER"),body.replace("\"enabled\":true","\"enabled\":false"))) {
   mvc.perform(post("/api/admin/users/"+email).with(user(admin).roles("ADMIN")).with(csrf()).contentType("application/json").content(invalid)).andExpect(status().isBadRequest());
   auth(admin,"ADMIN");
   assertEquals(List.of(store),queries.detail("users",email).get("support_store_ids"));
   assertEquals("ROLE_SUPPORT",queries.detail("users",email).get("roles"));
   assertEquals(true,queries.detail("users",email).get("is_enabled"));
  }
 }
 @Autowired org.springframework.security.core.session.SessionRegistry sessions;
 @Test void resetDefaultPasswordReplacesCredentialAndInvalidatesOutstandingState() throws Exception {
  sql.update("UPDATE USERS SET password_hash=? WHERE email=?",encoder.encode("Fixture-old-password"),buyer);
  sql.update("INSERT OTP_VERIFICATIONS(user_email,hashed_otp,type,expires_at) VALUES(?,?,'CHANGE_PASSWORD',DATEADD(minute,5,SYSDATETIME()))",buyer,encoder.encode("789012"));
  sql.update("INSERT PASSWORD_RESET_TOKENS(user_email,hashed_token,expires_at) VALUES(?,?,DATEADD(minute,15,SYSDATETIME()))",buyer,encoder.encode("Fixture-reset-token"));
  String old=sql.queryForObject("SELECT password_hash FROM USERS WHERE email=?",String.class,buyer);
  mvc.perform(post("/api/admin/users/"+buyer+"/reset-default-password").with(user(admin).roles("ADMIN")).with(csrf()))
   .andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Đã đặt lại mật khẩu mặc định")).andExpect(jsonPath("$.password_hash").doesNotExist());
  em.clear();String hash=sql.queryForObject("SELECT password_hash FROM USERS WHERE email=?",String.class,buyer);
  assertNotEquals("123456",hash);assertTrue(encoder.matches("123456",hash));assertFalse(encoder.matches("Fixture-old-password",hash));
  assertThrows(org.springframework.security.core.AuthenticationException.class,()->authentication.authenticate(new UsernamePasswordAuthenticationToken(buyer,"Fixture-old-password")));
  assertTrue(authentication.authenticate(new UsernamePasswordAuthenticationToken(buyer,"123456")).isAuthenticated());
  assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM PASSWORD_RESET_TOKENS WHERE user_email=? AND is_used=0",Integer.class,buyer));
  assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM OTP_VERIFICATIONS WHERE user_email=? AND type='CHANGE_PASSWORD' AND is_used=0",Integer.class,buyer));
  assertThrows(Exception.class,()->web.getBean(AuthService.class).confirmPasswordChange(buyer,"789012",encoder.encode("Fixture-pending-password"),old));
  assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM ADMIN_AUDIT_LOG WHERE actor_email=? AND entity_id=? AND action_type='USER_DEFAULT_PASSWORD_RESET'",Integer.class,admin,buyer));
 }
 @Test void createdAccountAuthenticatesWithEncodedDefault() {
  String email=tag+"new@test.invalid";users.save(new AdminUserService.Account(email,"Fixture new",null,null,true,Set.of("ROLE_USER")),true);
  assertNotEquals("123456",sql.queryForObject("SELECT password_hash FROM USERS WHERE email=?",String.class,email));
  assertTrue(authentication.authenticate(new UsernamePasswordAuthenticationToken(email,"123456")).isAuthenticated());
  users.delete(email);assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM USERS WHERE email=?",Integer.class,email));
 }
 @Test void resetRejectsOtherRolesAndMissingCsrfWithoutMutation() throws Exception {
  String before=sql.queryForObject("SELECT password_hash FROM USERS WHERE email=?",String.class,buyer);
  for(String role:List.of("USER","MANAGER","SUPPORT"))mvc.perform(post("/api/admin/users/"+buyer+"/reset-default-password").with(user(buyer).roles(role)).with(csrf())).andExpect(status().isForbidden());
  mvc.perform(post("/api/admin/users/"+buyer+"/reset-default-password").with(user(admin).roles("ADMIN"))).andExpect(status().isForbidden());
  mvc.perform(post("/api/admin/users/"+buyer+"/reset-default-password").with(anonymous()).with(csrf())).andExpect(status().isUnauthorized());
  assertEquals(before,sql.queryForObject("SELECT password_hash FROM USERS WHERE email=?",String.class,buyer));
 }
 @Test void resetMissingAccountIsNotFound() throws Exception {
  mvc.perform(post("/api/admin/users/"+tag+"missing@test.invalid/reset-default-password").with(user(admin).roles("ADMIN")).with(csrf())).andExpect(status().isNotFound());
 }
 @Test void adminResetInvalidatesVerifiedForgotPasswordTokenAndBlocksPendingOtp() throws Exception {
  var authService=web.getBean(AuthService.class);
  sql.update("INSERT OTP_VERIFICATIONS(user_email,hashed_otp,type,expires_at) VALUES(?,?,'FORGOT_PASSWORD',DATEADD(minute,5,SYSDATETIME()))",buyer,encoder.encode("789012"));
  String token=authService.verifyForgotPasswordOtp(buyer,"789012");
  sql.update("INSERT OTP_VERIFICATIONS(user_email,hashed_otp,type,expires_at) VALUES(?,?,'FORGOT_PASSWORD',DATEADD(minute,5,SYSDATETIME()))",buyer,encoder.encode("789013"));
  em.clear();users.resetDefaultPassword(buyer);em.clear();
  var request=new cyan.project.twinkle.dto.ResetPasswordRequest();request.setEmail(buyer);request.setToken(token);request.setNewPassword("Fixture-token-password");request.setConfirmPassword("Fixture-token-password");
  assertThrows(Exception.class,()->authService.resetPassword(request));
  assertThrows(Exception.class,()->authService.verifyForgotPasswordOtp(buyer,"789013"));
  assertTrue(encoder.matches("123456",sql.queryForObject("SELECT password_hash FROM USERS WHERE email=?",String.class,buyer)));
 }
 @Test void resetExpiresOnlyTargetSessionsAfterCommit() {
  var target=new org.springframework.security.core.userdetails.User(buyer,"",List.of(new SimpleGrantedAuthority("ROLE_USER")));
  var other=new org.springframework.security.core.userdetails.User(admin,"",List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
  String a=tag+"target",b=tag+"other";sessions.registerNewSession(a,target);sessions.registerNewSession(b,other);
  try {users.resetDefaultPassword(buyer);assertFalse(sessions.getSessionInformation(a).isExpired());
   org.springframework.transaction.support.TransactionSynchronizationManager.getSynchronizations().forEach(s->s.afterCommit());
   assertTrue(sessions.getSessionInformation(a).isExpired());assertFalse(sessions.getSessionInformation(b).isExpired());
  }finally{sessions.removeSessionInformation(a);sessions.removeSessionInformation(b);}
 }
 AdminQueryService.Page list(String area){return queries.list(area,0,20,"","",null,"id","desc","","","","","","");}
 long order(String method,boolean multi){long id=sql.queryForObject("INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total) OUTPUT INSERTED.id VALUES(?,?,N'Chờ xác nhận đơn hàng','test','0','test','test','test','test',?,100,0,0,0,100)",Long.class,tag+UUID.randomUUID().toString().substring(0,5),buyer,method);line(id,store);if(multi)line(id,other);sql.update("INSERT PAYMENTS(order_id,method,status,amount) VALUES(?,?,'PENDING',100)",id,method);em.clear();return id;}
 void line(long id,int s){sql.update("INSERT ORDER_ITEMS(order_id,product_id,store_id,variant_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) VALUES(?,?,?,?,?,'test',1,100,0,100)",id,product,s,variant,tag);}
 long payment(long id){return sql.queryForObject("SELECT id FROM PAYMENTS WHERE order_id=?",Long.class,id);}
 @Test void authorizationPagesAndCsrf()throws Exception{
  for(String route:List.of("","users","stores","categories","brands","products","variants","inventory","orders","payments","promotions","coupons","support","history","reviews","reports"))mvc.perform(get("/admin"+(route.isEmpty()?"":"/"+route)).with(user(admin).roles("ADMIN"))).andExpect(status().isOk());
  for(String role:List.of("USER","MANAGER","SUPPORT")){mvc.perform(get("/admin").with(user(buyer).roles(role))).andExpect(status().isForbidden());mvc.perform(get("/api/admin/users").with(user(buyer).roles(role))).andExpect(status().isForbidden());}
  mvc.perform(get("/api/admin/context").with(anonymous())).andExpect(status().isUnauthorized());mvc.perform(post("/api/admin/system-config/site_display_name").with(user(admin).roles("ADMIN")).contentType("application/json").content("{\"value\":\"Test\"}")).andExpect(status().isForbidden());
  sql.update("DELETE USER_ROLES WHERE user_email=?",admin);mvc.perform(get("/api/admin/context").with(user(admin).roles("ADMIN"))).andExpect(status().isForbidden());
 }
 @Test void listsAndDetailsNeverExposeCredentials(){for(String area:List.of("users","stores","categories","brands","products","variants","inventory","orders","catalog-requests","restock-requests","inventory-movements","promotions","coupons","audit"))assertNotNull(list(area));String account=queries.detail("users",admin).toString();for(String secret:List.of("password_hash","hashed_otp","hashed_token"))assertFalse(account.contains(secret));assertThrows(IllegalArgumentException.class,()->list("USERS;DROP TABLE USERS"));assertThrows(IllegalArgumentException.class,()->queries.list("users",0,1000,"","",null,"id","desc","","","","","",""));}
 @Test void createUserRoleChangeAndDisableReconcileAssignments(){String email=tag+"new@test.invalid";users.save(new AdminUserService.Account(email,"new","New account",null,true,Set.of("ROLE_USER")),true);String hash=sql.queryForObject("SELECT password_hash FROM USERS WHERE email=?",String.class,email);assertTrue(hash.startsWith("$2"));assertFalse(encoder.matches("",hash));users.save(new AdminUserService.Account(email,"new","Updated",null,false,Set.of("ROLE_SUPPORT")),false);assertFalse(userRepo.findByEmail(email).orElseThrow().getIsEnabled());users.save(new AdminUserService.Account(managerEmail,"manager",null,null,false,Set.of("ROLE_USER")),false);assertNull(sql.queryForObject("SELECT manager_email FROM STORES WHERE store_id=?",String.class,store));}
 @Test void selfAndLastAdminProtection(){assertThrows(Exception.class,()->users.delete(admin));assertThrows(Exception.class,()->users.save(new AdminUserService.Account(admin,"a",null,null,false,Set.of("ROLE_USER")),false));sql.update("UPDATE USERS SET is_enabled=0 WHERE email<>? AND email IN(SELECT ur.user_email FROM USER_ROLES ur JOIN ROLES r ON r.id=ur.role_id WHERE r.name='ROLE_ADMIN')",admin);assertThrows(Exception.class,()->users.save(new AdminUserService.Account(admin,"a",null,null,true,Set.of("ROLE_USER")),false));}
 @Test void unsafeUserDeleteBlocked(){order("COD",false);assertThrows(org.springframework.web.server.ResponseStatusException.class,()->users.delete(buyer));assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM USERS WHERE email=?",Integer.class,buyer));}
 @Test void managerAssignmentCannotAssignDisabledOrDuplicate(){var input=new AdminStoreService.StoreInput(tag+"new",tag+"new",null,null,null,"test",null,null,"test","OPEN",managerEmail);assertThrows(Exception.class,()->stores.save(null,input));sql.update("UPDATE USERS SET is_enabled=0 WHERE email=?",outsider);assertThrows(Exception.class,()->stores.save(null,new AdminStoreService.StoreInput("test",tag+"c",null,null,null,"test",null,null,"test","OPEN",outsider)));}
 @Test void catalogApplyOnceAndReject(){auth(managerEmail,"MANAGER");long id=manager.catalog(new ManagerOperationsService.CatalogRequest("UPDATE_PRODUCT",product,null,"rename",tag+"changed",null,null,null,null,null));auth(admin,"ADMIN");requests.catalog(id,new AdminRequestService.Review(true,"approved"));assertEquals(tag+"changed",sql.queryForObject("SELECT name FROM PRODUCTS WHERE id=?",String.class,product));assertEquals("APPLIED",sql.queryForObject("SELECT status FROM CATALOG_CHANGE_REQUESTS WHERE id=?",String.class,id));assertThrows(Exception.class,()->requests.catalog(id,new AdminRequestService.Review(true,"retry")));}
 @Test void catalogRejectLeavesMasterUnchanged(){auth(managerEmail,"MANAGER");long id=manager.catalog(new ManagerOperationsService.CatalogRequest("UPDATE_VARIANT",product,variant,"size",null,null,null,"42",null,null));auth(admin,"ADMIN");requests.catalog(id,new AdminRequestService.Review(false,"not approved"));assertEquals("41",sql.queryForObject("SELECT size FROM PRODUCT_VARIANTS WHERE id=?",String.class,variant));}
 @Test void restockFulfillmentAndMovementOnce(){auth(managerEmail,"MANAGER");long id=manager.restock(new ManagerOperationsService.RestockRequest(variant,15,"needed",null));auth(admin,"ADMIN");requests.restock(id,new AdminRequestService.Review(true,"supplied"));assertEquals(25,sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WHERE store_id=? AND variant_id=?",Integer.class,store,variant));assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM INVENTORY_MOVEMENTS WHERE reference_id=? AND movement_type='RESTOCK'",Integer.class,id));assertThrows(Exception.class,()->requests.restock(id,new AdminRequestService.Review(true,"retry")));}
 @Test void restockRejectAndManualAdjustment(){auth(managerEmail,"MANAGER");long id=manager.restock(new ManagerOperationsService.RestockRequest(variant,15,"needed",null));auth(admin,"ADMIN");requests.restock(id,new AdminRequestService.Review(false,"not available"));assertEquals(10,sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WHERE store_id=? AND variant_id=?",Integer.class,store,variant));requests.adjust(store,variant,12,"correction","CORRECTION",null);assertEquals(2,sql.queryForObject("SELECT quantity_delta FROM INVENTORY_MOVEMENTS WHERE store_id=? AND variant_id=?",Integer.class,store,variant));assertThrows(Exception.class,()->requests.adjust(store,variant,-1,"negative","MANUAL_ADJUSTMENT",null));}
 @Test void bankingReportVerificationAndGateAcrossStores(){long id=order("BANKING",true),pid=payment(id);auth(managerEmail,"MANAGER");assertThrows(Exception.class,()->fulfillment.transition(id,"Đã xác nhận"));auth(buyer,"USER");long report=payments.report(id,buyer);assertEquals(report,payments.report(id,buyer));assertEquals("PENDING",sql.queryForObject("SELECT status FROM PAYMENTS WHERE id=?",String.class,pid));assertThrows(Exception.class,()->payments.report(id,outsider));auth(managerEmail,"MANAGER");payments.review(pid,managerEmail,true,"bank receipt checked");payments.review(pid,managerEmail,true,"retry");assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM PAYMENT_VERIFICATIONS WHERE payment_id=?",Integer.class,pid));fulfillment.transition(id,"Đã xác nhận");assertEquals("Chờ xác nhận đơn hàng",sql.queryForObject("SELECT status FROM ORDERS WHERE id=?",String.class,id));}
 @Test void paymentScopeAndAdminReview(){long id=order("BANKING",false),pid=payment(id);payments.report(id,buyer);auth(outsider,"MANAGER");assertThrows(Exception.class,()->payments.review(pid,outsider,true,"foreign payment"));assertEquals(0,paymentQueries.list(false,0,20,tag,"",null,"","").total());}
 @Test void adminConfirmAndRejectAudit(){long id=order("BANKING",false),pid=payment(id);payments.report(id,buyer);payments.review(pid,admin,false,"not received");assertEquals("PENDING",sql.queryForObject("SELECT status FROM PAYMENTS WHERE id=?",String.class,pid));payments.report(id,buyer);payments.review(pid,admin,true,"received");assertEquals("PAID",sql.queryForObject("SELECT status FROM PAYMENTS WHERE id=?",String.class,pid));assertEquals(2,sql.queryForObject("SELECT COUNT(*) FROM ADMIN_AUDIT_LOG WHERE entity_type='PAYMENTS' AND entity_id=?",Integer.class,String.valueOf(pid)));}
 @Test void codConfirmationAndDeliveredPayment(){long id=order("COD",false);auth(managerEmail,"MANAGER");fulfillment.transition(id,"Đã xác nhận");assertEquals("PENDING",sql.queryForObject("SELECT status FROM PAYMENTS WHERE order_id=?",String.class,id));for(String next:List.of("Đang chuẩn bị đơn hàng","Đơn hàng đã sẵn sàng","Đang giao","Đã giao"))fulfillment.transition(id,next);assertEquals("PAID",sql.queryForObject("SELECT status FROM PAYMENTS WHERE order_id=?",String.class,id));}
 @Test void promotionScopesAndDeterministicWinner(){var p=products.findById(product).orElseThrow();var v=variants.findById(variant).orElseThrow();int brand=p.getBrand().getId(),category=p.getCategory().getId();for(var target:List.of("GLOBAL","STORE","CATEGORY","BRAND","PRODUCT","VARIANT")){List<Long> ids=switch(target){case "GLOBAL"->List.of();case "STORE"->List.of((long)store);case "CATEGORY"->List.of((long)category);case "BRAND"->List.of((long)brand);case "PRODUCT"->List.of((long)product);default->List.of(variant);};promotions.promotion(null,new AdminPromotionService.PromotionInput(tag+target,null,"PERCENT",BigDecimal.TEN,LocalDateTime.now().minusDays(1),LocalDateTime.now().plusDays(1),target,ids,0,"ACTIVE"));}
  assertEquals(0,pricing.calculateItemPrice(p,v,store,LocalDateTime.now()).compareTo(new BigDecimal("99.00")));int second=catalog.product(null,new AdminCatalogService.ProductInput(tag+" second",tag.toLowerCase(Locale.ROOT)+"-second",brand,category,new BigDecimal("200"),null,"ACTIVE"));long secondVariant=catalog.variant(null,new AdminCatalogService.VariantInput(second,"41","blue",tag+"-sort",BigDecimal.ZERO,null,"ACTIVE"));sql.update("INSERT STORE_INVENTORY(store_id,variant_id,quantity) VALUES(?,?,1)",store,secondVariant);assertEquals(product,pricing.pricedPage(tag,null,null,store,LocalDateTime.now(),0,1,true,false).getContent().getFirst().getId());assertEquals(second,pricing.pricedPage(tag,null,null,store,LocalDateTime.now(),0,1,false,false).getContent().getFirst().getId());var rows=List.<Map<String,Object>>of(Map.of("id",2,"scope","GLOBAL","priority",100,"discount_type","PERCENT","discount_value",new BigDecimal("90")),Map.of("id",1,"scope","VARIANT","priority",0,"discount_type","FIXED","discount_value",BigDecimal.TEN));assertEquals(0,PricingService.winnerPrice(new BigDecimal("100"),rows).compareTo(new BigDecimal("90")));}
 @Test void dashboardStoreConsistencyAndRanges(){long delivered=order("COD",true);sql.update("UPDATE ORDERS SET status=N'Đã giao' WHERE id=?",delivered);for(String range:List.of("DAY","WEEK","MONTH","YEAR")){auth(managerEmail,"MANAGER");var expected=managerDashboard.dashboard(range);auth(admin,"ADMIN");var actual=dashboard.dashboard(range,store);assertEquals(0,((BigDecimal)((Map<?,?>)actual.get("kpi")).get("revenue")).compareTo(new BigDecimal("100")));for(String key:List.of("orders","revenue","items_sold","average_order_value"))assertEquals(((Map<?,?>)expected.get("kpi")).get(key),((Map<?,?>)actual.get("kpi")).get(key));assertNotNull(dashboard.dashboard(range,null));}}
 @Test void systemConfigOnlyExposesAuditHistory() throws Exception {mvc.perform(get("/api/admin/system-config").with(user(admin).roles("ADMIN"))).andExpect(status().isOk()).andExpect(content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("site_display_name"))));mvc.perform(post("/api/admin/system-config/site_display_name").with(user(admin).roles("ADMIN")).with(csrf()).contentType("application/json").content("{\"value\":\"Test\"}")).andExpect(status().isMethodNotAllowed());}
 @Test void couponTypesTotalsAndPerUserLimits(){
  for(String type:List.of("PERCENT","FIXED","FREESHIP")){
   String code=tag+type;promotions.coupon(null,new AdminPromotionService.CouponInput(code,code,null,type,type.equals("PERCENT")?new BigDecimal("100"):new BigDecimal("30000"),BigDecimal.ZERO,null,10,1,LocalDateTime.now().minusDays(1),LocalDateTime.now().plusDays(1),true));
  }
  cart.addToCart(buyer,variant,store,1);
  for(String type:List.of("PERCENT","FIXED","FREESHIP")){var quote=checkout.quote(buyer,tag+type);assertTrue(quote.total().signum()>=0);assertEquals(0,quote.total().compareTo(type.equals("FREESHIP")?new BigDecimal("110"):new BigDecimal("30000")));}
  long address=sql.queryForObject("INSERT USER_ADDRESSES(user_email,full_name,phone,city,district,ward,address_line,is_default) OUTPUT INSERTED.id VALUES(?,'test','0','test','test','test','test',1)",Long.class,buyer);
  var form=new cyan.project.twinkle.dto.CheckoutForm();form.setAddressId(address);form.setPaymentMethod("COD");form.setCouponCode(tag+"FIXED");var o=checkout.processCheckout(buyer,form);em.flush();cart.addToCart(buyer,variant,store,1);assertThrows(Exception.class,()->checkout.quote(buyer,tag+"FIXED"));assertEquals(0,o.getTotal().compareTo(new BigDecimal("30000")));
 }
 @Test void supportAdminUsesExistingBackendAndMasksIdentity(){
  auth(buyer,"USER");var state=new cyan.project.twinkle.chat.ai.AiChatSessionState();var conversation=chat.handoff(state,new SupportChatService.Selection(store,product,null),SecurityContextHolder.getContext().getAuthentication());long id=((Number)conversation.get("id")).longValue();auth(admin,"ADMIN");chat.send(id,new SupportChatService.Send(UUID.randomUUID().toString(),"TWADMINTEST support reply"),SecurityContextHolder.getContext().getAuthentication());assertEquals(1,chat.staffInbox(SecurityContextHolder.getContext().getAuthentication(),0,20,store,"OPEN").total());auth(buyer,"USER");String messages=chat.messages(id,0,SecurityContextHolder.getContext().getAuthentication()).toString();assertFalse(messages.contains(admin));assertTrue(messages.contains("TWADMINTEST support reply"));
 }
 @Test void disabledAccountCannotAuthenticate(){
  String password=UUID.randomUUID().toString();sql.update("UPDATE USERS SET password_hash=? WHERE email=?",encoder.encode(password),buyer);users.save(new AdminUserService.Account(buyer,"buyer",null,null,false,Set.of("ROLE_USER")),false);em.clear();assertThrows(org.springframework.security.authentication.DisabledException.class,()->authentication.authenticate(org.springframework.security.authentication.UsernamePasswordAuthenticationToken.unauthenticated(buyer,password)));
 }
 @Test void canonicalMasterCrudAndHistoricalDeletePolicy(){
  String slug=tag.toLowerCase(Locale.ROOT);int category=catalog.master("categories",null,new AdminCatalogService.MasterInput(tag+"category",slug+"-category",null,null,"ACTIVE"));int brand=catalog.master("brands",null,new AdminCatalogService.MasterInput(tag+"brand",slug+"-brand",null,null,null));int p=catalog.product(null,new AdminCatalogService.ProductInput(tag+"product",slug+"-product",brand,category,new BigDecimal("200"),null,"ACTIVE"));long v=catalog.variant(null,new AdminCatalogService.VariantInput(p,"42","blue",tag+"SKU",BigDecimal.ZERO,null,"ACTIVE"));catalog.variant(v,new AdminCatalogService.VariantInput(p,"43","blue",tag+"SKU",BigDecimal.TEN,null,"INACTIVE"));assertEquals("43",sql.queryForObject("SELECT size FROM PRODUCT_VARIANTS WHERE id=?",String.class,v));catalog.delete("variants",v);catalog.delete("products",p);catalog.delete("categories",category);catalog.delete("brands",brand);assertThrows(org.springframework.dao.DataIntegrityViolationException.class,()->catalog.delete("products",product));
 }
 @Test void storeCrudManagerReassignmentAndStaleManagerDenial(){
  String email=tag+"free@test.invalid";users.save(new AdminUserService.Account(email,"free",null,null,true,Set.of("ROLE_MANAGER")),true);int id=stores.save(null,new AdminStoreService.StoreInput(tag+"new",tag.toLowerCase(Locale.ROOT)+"-new",null,null,null,"test",null,null,"test","OPEN",email));auth(email,"MANAGER");assertEquals(id,sql.queryForObject("SELECT store_id FROM STORES WHERE manager_email=?",Integer.class,email));auth(admin,"ADMIN");stores.save(id,new AdminStoreService.StoreInput(tag+"updated",tag.toLowerCase(Locale.ROOT)+"-new",null,null,null,"test",null,null,"test","OPEN",null));auth(email,"MANAGER");assertThrows(ManagerException.class,()->manager.store());auth(admin,"ADMIN");stores.delete(id);assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM STORES WHERE store_id=?",Integer.class,id));
 }
 @Test void managerCatalogPrimaryImageAppliedAndCanBeCleared(){
  auth(managerEmail,"MANAGER");long id=manager.catalog(new ManagerOperationsService.CatalogRequest("UPDATE_PRODUCT",product,null,"primary image",null,null,null,null,null,null,null,null,null,"/images/T-Winkle.png"));auth(admin,"ADMIN");requests.catalog(id,new AdminRequestService.Review(true,"image approved"));assertEquals("/images/T-Winkle.png",sql.queryForObject("SELECT image_url FROM PRODUCT_IMAGES WHERE product_id=? AND is_primary=1",String.class,product));var p=products.findById(product).orElseThrow();catalog.product(product,new AdminCatalogService.ProductInput(p.getName(),p.getSlug(),p.getBrand().getId(),p.getCategory().getId(),p.getBasePrice(),p.getDescription(),p.getStatus(),""));assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM PRODUCT_IMAGES WHERE product_id=?",Integer.class,product));
 }
}
