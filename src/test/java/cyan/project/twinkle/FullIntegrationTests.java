package cyan.project.twinkle;

import cyan.project.twinkle.dto.CheckoutForm;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.service.*;
import cyan.project.twinkle.repository.*;
import cyan.project.twinkle.manager.*;
import cyan.project.twinkle.chat.ai.*;
import cyan.project.twinkle.chat.support.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(properties={"twinkle.payment.bank.bank-id=BIDV","twinkle.payment.bank.account-no=1234567890","twinkle.payment.bank.account-name=TWFINALFIX SYNTHETIC"}) @Transactional
class FullIntegrationTests {
 @MockitoBean JavaMailSender mail;
 @Autowired JdbcTemplate sql; @Autowired AuthService auth; @Autowired PasswordEncoder encoder; @Autowired UserRepository users;
 @Autowired CartService cart; @Autowired CheckoutService checkout; @Autowired StoreFulfillmentService fulfillment; @Autowired OrderCancellationService cancellations;
 @Autowired SupportChatService chat;
 @Autowired jakarta.persistence.EntityManager entityManager;
 @Autowired org.springframework.web.context.WebApplicationContext web;
 String tag,buyer,manager,otherManager,admin; int store,otherStore,product;long variant;String original;
 @BeforeEach void fixture(){
  tag="TWFINALFIX"+System.nanoTime();buyer=tag+"u@test.invalid";manager=tag+"m@test.invalid";otherManager=tag+"n@test.invalid";admin=tag+"a@test.invalid";
  original=encoder.encode("Fixture-current-123");
  for(String email:List.of(buyer,manager,otherManager,admin)){
   sql.update("INSERT USERS(email,username,full_name,phone,password_hash,is_enabled) VALUES(?,?,?,'0900000000',?,1)",email,email,tag,original);
   sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name=?",email,email.equals(admin)?"ROLE_ADMIN":email.equals(buyer)?"ROLE_USER":"ROLE_MANAGER");
  }
  store=sql.queryForObject("INSERT STORES(slug,name,address_line,city,manager_email,status) OUTPUT INSERTED.store_id VALUES(?,?,N'Fixture street',N'Fixture city',?,'OPEN')",Integer.class,tag.toLowerCase(),tag,manager);
  otherStore=sql.queryForObject("INSERT STORES(slug,name,address_line,city,manager_email,status) OUTPUT INSERTED.store_id VALUES(?,?,N'Fixture street',N'Fixture city',?,'CLOSED')",Integer.class,tag.toLowerCase()+"b",tag+"b",otherManager);
  var v=sql.queryForMap("SELECT TOP(1) v.id,v.product_id FROM PRODUCT_VARIANTS v JOIN PRODUCTS p ON p.id=v.product_id WHERE v.status='ACTIVE' AND p.status='ACTIVE' ORDER BY v.id");variant=((Number)v.get("id")).longValue();product=((Number)v.get("product_id")).intValue();
  sql.update("INSERT STORE_INVENTORY(store_id,variant_id,quantity,reorder_level) VALUES(?,?,10,10),(?,?,10,10)",store,variant,otherStore,variant);
 }
 @AfterEach void clear(){SecurityContextHolder.clearContext();}
 UsernamePasswordAuthenticationToken actor(String email,String role){var a=new UsernamePasswordAuthenticationToken(email,"unused",List.of(new SimpleGrantedAuthority("ROLE_"+role)));SecurityContextHolder.getContext().setAuthentication(a);return a;}
 long order(String mode,String method,boolean multi){
  long id=sql.queryForObject("INSERT ORDERS(order_code,user_email,fulfillment_mode,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total) OUTPUT INSERTED.id VALUES(?,?,?,N'Chờ xác nhận đơn hàng','Fixture','0900000000','','','','',?,100,0,0,0,100)",Long.class,tag+UUID.randomUUID().toString().substring(0,5),buyer,mode,method);
  for(int s:multi?List.of(store,otherStore):List.of(store)){sql.update("INSERT ORDER_ITEMS(order_id,product_id,store_id,variant_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) VALUES(?,?,?,?,'Fixture','Fixture',1,100,0,100)",id,product,s,variant);sql.update("INSERT ORDER_STORE_FULFILLMENTS(order_id,store_id,status) VALUES(?,?,N'Chờ xác nhận đơn hàng')",id,s);}
  sql.update("INSERT PAYMENTS(order_id,method,status,amount) VALUES(?,?,'PENDING',100)",id,method);return id;
 }
 String status(long id){return sql.queryForObject("SELECT status FROM ORDERS WHERE id=?",String.class,id);}
 @Test void everyModeAndMethodEnforcesLifecycleAndPaymentGate(){
  for(String mode:List.of("PICKUP","DELIVERY"))for(String method:List.of("COD","BANKING")){
   long id=order(mode,method,false);actor(manager,"MANAGER");
   if(method.equals("BANKING")){assertThrows(BusinessRuleException.class,()->fulfillment.transition(id,"Đã xác nhận"));sql.update("UPDATE PAYMENTS SET status='PAID' WHERE order_id=?",id);}
   var sequence=OrderStatus.sequence(mode);
   assertThrows(ManagerException.class,()->fulfillment.transition(id,"Đã giao"));
   for(int i=1;i<sequence.size();i++){fulfillment.transition(id,sequence.get(i));assertEquals(sequence.get(i),status(id));}
   assertEquals("PAID",sql.queryForObject("SELECT status FROM PAYMENTS WHERE order_id=?",String.class,id));
   assertThrows(ManagerException.class,()->fulfillment.transition(id,"Đã giao"));
   if(mode.equals("PICKUP"))assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM ORDER_STATUS_HISTORY WHERE order_id=? AND status=N'Đang giao'",Integer.class,id));
  }
 }
 @Test void multiStoreProgressAggregatesLeastAdvancedAndRejectsOtherStore(){
  long id=order("DELIVERY","COD",true);actor(manager,"MANAGER");
  fulfillment.transition(id,"Đã xác nhận");fulfillment.transition(id,"Đang chuẩn bị đơn hàng");assertEquals("Chờ xác nhận đơn hàng",status(id));
  actor(otherManager,"MANAGER");fulfillment.transition(id,"Đã xác nhận");assertEquals("Đã xác nhận",status(id));
  assertEquals("Đang chuẩn bị đơn hàng",sql.queryForObject("SELECT status FROM ORDER_STORE_FULFILLMENTS WHERE order_id=? AND store_id=?",String.class,id,store));
  long onlyA=order("PICKUP","COD",false);assertThrows(org.springframework.security.access.AccessDeniedException.class,()->fulfillment.transition(onlyA,"Đã xác nhận"));
 }
 @Test void paidBankingCancellationCreatesPendingRefundThenRecordsOneTruthfulCompletion(){
  long id=order("PICKUP","BANKING",false);sql.update("UPDATE PAYMENTS SET status='PAID' WHERE order_id=?",id);
  sql.update("INSERT ORDER_CANCELLATIONS(order_id,requested_by_email,reason,status,requested_at) VALUES(?,?,'Fixture','PENDING',SYSDATETIME())",id,buyer);
  var approve=new OrderCancellationService.Decision(true,false,null,"Fixture cancellation");cancellations.review(id,admin,approve);
  assertEquals("Đã hủy",status(id));assertEquals("PAID",sql.queryForObject("SELECT status FROM PAYMENTS WHERE order_id=?",String.class,id));
  assertEquals("PENDING",sql.queryForObject("SELECT status FROM PAYMENT_REFUNDS WHERE order_id=?",String.class,id));
  var complete=new OrderCancellationService.Decision(true,true,"Fixture receipt","Fixture transfer confirmed");cancellations.review(id,admin,complete);cancellations.review(id,admin,complete);
  assertEquals("REFUNDED",sql.queryForObject("SELECT status FROM PAYMENTS WHERE order_id=?",String.class,id));
  assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM PAYMENT_REFUNDS WHERE order_id=? AND status='COMPLETED' AND processed_by=? AND processed_at IS NOT NULL",Integer.class,id,admin));
  assertEquals(11,sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WHERE store_id=? AND variant_id=?",Integer.class,store,variant));
  assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM INVENTORY_MOVEMENTS WHERE reference_type='ORDER_CANCELLATION' AND reference_id=?",Integer.class,id));
 }
 @Test void unpaidBankingAndCodCancellationHaveNoRefundAndRestoreOnce(){
  for(String method:List.of("COD","BANKING")){long id=order("DELIVERY",method,false);sql.update("INSERT ORDER_CANCELLATIONS(order_id,requested_by_email,reason,status,requested_at) VALUES(?,?,'Fixture','PENDING',SYSDATETIME())",id,buyer);var decision=new OrderCancellationService.Decision(true,false,null,"Fixture cancellation");cancellations.review(id,admin,decision);cancellations.review(id,admin,decision);assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM PAYMENT_REFUNDS WHERE order_id=?",Integer.class,id));assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM ORDER_STATUS_HISTORY WHERE order_id=? AND status=N'Đã hủy'",Integer.class,id));}
 }
 @Test void passwordChangeIsAccountBoundOneTimeExpiringAndRateLimited() throws Exception {
  String next=auth.requestPasswordChange(buyer,"Fixture-current-123","Fixture-new-123","Fixture-new-123");
  assertThrows(Exception.class,()->auth.requestPasswordChange(buyer,"Fixture-current-123","Fixture-new-123","Fixture-new-123"));
  var capture=org.mockito.ArgumentCaptor.forClass(SimpleMailMessage.class);verify(mail).send(capture.capture());var matcher=java.util.regex.Pattern.compile("[0-9]{6}").matcher(capture.getValue().getText());assertTrue(matcher.find());String otp=matcher.group();
  assertThrows(Exception.class,()->auth.confirmPasswordChange(manager,otp,next,original));
  assertThrows(Exception.class,()->auth.confirmPasswordChange(buyer,"000000",next,original));
  entityManager.flush();
  assertEquals(1,sql.queryForObject("SELECT attempts FROM OTP_VERIFICATIONS WHERE user_email=? AND type='CHANGE_PASSWORD'",Integer.class,buyer));
  auth.confirmPasswordChange(buyer,otp,next,original);assertTrue(encoder.matches("Fixture-new-123",users.findByEmail(buyer).orElseThrow().getPasswordHash()));
  assertThrows(Exception.class,()->auth.confirmPasswordChange(buyer,otp,next,original));
 }
 @Test void expiredPasswordOtpCannotChangePassword() throws Exception {
  var next=auth.requestPasswordChange(buyer,"Fixture-current-123","Fixture-new-123","Fixture-new-123");
  var capture=org.mockito.ArgumentCaptor.forClass(SimpleMailMessage.class);verify(mail).send(capture.capture());var matcher=java.util.regex.Pattern.compile("[0-9]{6}").matcher(capture.getValue().getText());assertTrue(matcher.find());
  sql.update("UPDATE OTP_VERIFICATIONS SET expires_at=DATEADD(minute,-10,SYSDATETIME()) WHERE user_email=?",buyer);
  entityManager.clear();
  assertThrows(Exception.class,()->auth.confirmPasswordChange(buyer,matcher.group(),next,original));
  assertTrue(encoder.matches("Fixture-current-123",users.findByEmail(buyer).orElseThrow().getPasswordHash()));
 }
 @Test void storeSelectionShowsClosedStoresReusesAndReopensHistoryWithCustomerUnread(){
  var state=new AiChatSessionState();var owner=actor(buyer,"USER");
  var options=chat.options(state.shoppingContext,buyer);assertTrue(options.stream().anyMatch(s->((Number)s.get("storeId")).intValue()==otherStore&&s.get("status").equals("CLOSED")));
  boolean closedSeen=false;for(var s:options){if(s.get("status").equals("CLOSED"))closedSeen=true;else assertFalse(closedSeen);}
  var selection=new SupportChatService.Selection(otherStore,null,null);long id=((Number)chat.direct(otherStore,owner).get("id")).longValue();
  assertEquals("DIRECT",sql.queryForObject("SELECT source FROM SUPPORT_CONVERSATIONS WHERE id=?",String.class,id));
  chat.send(id,new SupportChatService.Send(UUID.randomUUID().toString(),"Fixture customer message"),owner);
  sql.update("UPDATE SUPPORT_CONVERSATIONS SET status='CLOSED',closed_at=SYSDATETIME() WHERE id=?",id);
  assertEquals(id,((Number)chat.handoff(state,selection,owner).get("id")).longValue());
  chat.send(id,new SupportChatService.Send(UUID.randomUUID().toString(),"Fixture staff message"),actor(otherManager,"MANAGER"));
  var list=chat.mine(owner);assertTrue(((Number)list.stream().filter(c->((Number)c.get("id")).longValue()==id).findFirst().orElseThrow().get("unreadCount")).intValue()>0);
  var messages=chat.messages(id,0,owner);long latest=((Number)messages.getLast().get("id")).longValue();chat.read(id,new SupportChatService.ReadState(latest),owner);assertEquals(0,((Number)chat.mine(owner).getFirst().get("unreadCount")).intValue());
  assertTrue(messages.stream().anyMatch(m->m.get("content").equals("Fixture customer message")));assertTrue(messages.stream().noneMatch(m->m.containsKey("staffName")));
 }
 @Test void pickupCheckoutWithoutAddressUsesStoresAndHasZeroShipping(){
  cart.addToCart(buyer,product,variant,store,1);var form=new CheckoutForm();form.setPaymentMethod("COD");form.setFulfillmentMode("PICKUP");
  var quote=checkout.quote(buyer,null,"PICKUP");var result=checkout.processCheckout(buyer,form);
  assertEquals("PICKUP",result.getFulfillmentMode());assertEquals(0,result.getShippingFee().signum());assertEquals(0,quote.total().compareTo(result.getTotal()));assertEquals("",result.getShippingAddressLine());
 }
 @Test void allFourCheckoutChoicesPersistSnapshotsAndCanonicalQuote(){
  long address=sql.queryForObject("INSERT USER_ADDRESSES(user_email,full_name,phone,address_line,ward,district,city,is_default) OUTPUT INSERTED.id VALUES(?,'Fixture','0900000000','Fixture road','Fixture ward','Fixture district','Fixture city',1)",Long.class,buyer);
  for(String mode:List.of("PICKUP","DELIVERY"))for(String method:List.of("COD","BANKING")){
   cart.addToCart(buyer,product,variant,store,1);var form=new CheckoutForm();form.setPaymentMethod(method);form.setFulfillmentMode(mode);if(mode.equals("DELIVERY"))form.setAddressId(address);
   var quote=checkout.quote(buyer,null,mode);var result=checkout.processCheckout(buyer,form);entityManager.flush();
   assertEquals(mode,result.getFulfillmentMode());assertEquals(method,result.getPaymentMethod());assertEquals(0,quote.total().compareTo(result.getTotal()));assertEquals(mode.equals("PICKUP")?0:1,result.getShippingFee().signum());assertEquals(mode.equals("PICKUP")?"":"Fixture road",result.getShippingAddressLine());
  }
 }
 @Test void settingsRequiresAuthenticationCsrfAndBoundSessionThenInvalidatesSession() throws Exception {
  var mvc=org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup(web).apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity()).build();
  var principal=new cyan.project.twinkle.security.CustomUserDetails(users.findByEmail(buyer).orElseThrow());
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/settings")).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is3xxRedirection());
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/settings/password/request").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user(principal))).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isForbidden());
  var session=new org.springframework.mock.web.MockHttpSession();
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/settings/password/request").session(session).with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user(principal)).with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()).param("currentPassword","Fixture-current-123").param("newPassword","Fixture-new-123").param("confirmPassword","Fixture-new-123")).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl("/settings"));
  assertNotNull(session.getAttribute("PASSWORD_CHANGE_HASH"));assertFalse(session.getAttribute("PASSWORD_CHANGE_HASH").toString().contains("Fixture-new-123"));
  var capture=org.mockito.ArgumentCaptor.forClass(SimpleMailMessage.class);verify(mail).send(capture.capture());var matcher=java.util.regex.Pattern.compile("[0-9]{6}").matcher(capture.getValue().getText());assertTrue(matcher.find());
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/settings/password/confirm").session(session).with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user(principal)).with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()).param("otp",matcher.group())).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl("/login?passwordChanged"));assertTrue(session.isInvalid());
 }
 @Test void passwordOtpLocksAfterFiveIncorrectAttempts() throws Exception {
  var next=auth.requestPasswordChange(buyer,"Fixture-current-123","Fixture-new-123","Fixture-new-123");
  for(int i=0;i<5;i++)assertThrows(Exception.class,()->auth.confirmPasswordChange(buyer,"000000",next,original));
  entityManager.flush();assertEquals(5,sql.queryForObject("SELECT attempts FROM OTP_VERIFICATIONS WHERE user_email=? AND type='CHANGE_PASSWORD'",Integer.class,buyer));assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM OTP_VERIFICATIONS WHERE user_email=? AND type='CHANGE_PASSWORD' AND is_used=1",Integer.class,buyer));
 }
}
