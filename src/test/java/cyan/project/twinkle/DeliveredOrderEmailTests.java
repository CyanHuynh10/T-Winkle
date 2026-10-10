package cyan.project.twinkle;

import cyan.project.twinkle.event.OrderDeliveredEvent;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.UserRepository;
import cyan.project.twinkle.service.*;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.mockito.ArgumentCaptor;

@SpringBootTest(properties={"spring.mail.username=sender@twinkle.test","spring.mail.password=synthetic-not-a-credential","app.base-url=https://store.twinkle.test"})
@ExtendWith(OutputCaptureExtension.class)
class DeliveredOrderEmailTests {
    @MockitoBean JavaMailSender sender;
    @Autowired JdbcTemplate sql;
    @Autowired OrderFulfillmentService fulfillment;
    @Autowired OrderDeliveredListener listener;
    @Autowired OrderService orders;
    @Autowired AuthService auth;
    @Autowired UserRepository users;
    @Autowired PlatformTransactionManager transactions;
    String buyer,admin,code;long id;

    @BeforeEach void fixture() {
        String tag="DM"+System.nanoTime();buyer=tag+"b@twinkle.test";admin=tag+"a@twinkle.test";code="TW"+tag;
        for(String email:List.of(buyer,admin)) {
            sql.update("INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES(?,?,'Synthetic account','!unusable-test-password',1)",email,email);
            sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name=?",email,email.equals(admin)?"ROLE_ADMIN":"ROLE_USER");
        }
        sql.update("INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,shipping_note,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total,created_at,updated_at) VALUES(?,?,N'Đang giao',N'Hà <script>unsafe</script>','0900000000',N'Snapshot <b>street</b>','Ward','District','City',N'Note <img src=x>','BANKING',300000,15000,30000,20000,295000,'2026-10-01T08:15:00','2026-10-01T08:15:00')",code,buyer);
        id=sql.queryForObject("SELECT id FROM ORDERS WHERE order_code=?",Long.class,code);
        for(int i=0;i<2;i++)sql.update("INSERT ORDER_ITEMS(order_id,product_id,variant_id,store_id,product_name,variant_name,unit_price,discount_amount,quantity,line_total) SELECT TOP(1) ?,v.product_id,si.variant_id,si.store_id,?,N'Size 42 - Snapshot cyan',?,0,?,? FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id ORDER BY si.store_id,si.variant_id",id,"Snapshot shoe "+i+" <b>name</b>",i==0?100000:85000,i==0?2:1,i==0?200000:85000);
        sql.update("INSERT PAYMENTS(order_id,method,status,amount) VALUES(?,'BANKING','PENDING',295000)",id);
        sql.update("INSERT ORDER_STATUS_HISTORY(order_id,status,created_at) VALUES(?,N'Đang giao','2026-10-01T08:16:00')",id);
        when(sender.createMimeMessage()).thenAnswer(invocation->new MimeMessage(Session.getInstance(new Properties())));
        doAnswer(invocation->{((MimeMessage)invocation.getArgument(0)).saveChanges();return null;}).when(sender).send(any(MimeMessage.class));
    }
    @AfterEach void cleanup() {
        sql.update("DELETE OTP_VERIFICATIONS WHERE user_email IN(?,?)",buyer,admin);
        sql.update("DELETE PAYMENTS WHERE order_id=?",id);sql.update("DELETE ORDER_STATUS_HISTORY WHERE order_id=?",id);sql.update("DELETE ORDER_ITEMS WHERE order_id=?",id);sql.update("DELETE ORDERS WHERE id=?",id);
        sql.update("DELETE USER_ROLES WHERE user_email IN(?,?)",buyer,admin);sql.update("DELETE USERS WHERE email IN(?,?)",buyer,admin);
    }
    String status(){return sql.queryForObject("SELECT status FROM ORDERS WHERE id=?",String.class,id);}
    Object sentAt(){return sql.queryForMap("SELECT delivery_mail_sent_at FROM ORDERS WHERE id=?",id).get("delivery_mail_sent_at");}
    long historyId(){return sql.queryForObject("SELECT id FROM ORDER_STATUS_HISTORY WHERE order_id=? AND status=N'Đã giao'",Long.class,id);}
    String html() throws Exception {var capture=ArgumentCaptor.forClass(MimeMessage.class);verify(sender,times(1)).send(capture.capture());return (String)capture.getValue().getContent();}

    @Test void committedDeliverySendsOwnerHtmlWithSnapshotsAndStoresMarker() throws Exception {
        var items=sql.queryForList("SELECT * FROM ORDER_ITEMS WHERE order_id=? ORDER BY id",id);
        var payment=sql.queryForMap("SELECT * FROM PAYMENTS WHERE order_id=?",id);
        var deliveredUpdatedAt=new AtomicReference<Timestamp>();
        doAnswer(invocation->{assertEquals("Đã giao",status());assertNull(sentAt());deliveredUpdatedAt.set(sql.queryForObject("SELECT updated_at FROM ORDERS WHERE id=?",Timestamp.class,id));((MimeMessage)invocation.getArgument(0)).saveChanges();return null;}).when(sender).send(any(MimeMessage.class));
        new TransactionTemplate(transactions).executeWithoutResult(tx->{fulfillment.transition(id,admin,"Đã giao");verify(sender,never()).send(any(MimeMessage.class));});
        assertEquals("Đã giao",status());assertNotNull(sentAt());
        var capture=ArgumentCaptor.forClass(MimeMessage.class);verify(sender).send(capture.capture());var message=capture.getValue();
        assertEquals(buyer,message.getAllRecipients()[0].toString());assertEquals("[T-Winkle] Đơn hàng "+code+" đã được giao thành công",message.getSubject());assertTrue(message.isMimeType("text/html"));
        String body=(String)message.getContent();
        for(String text:List.of(code,"Hà &lt;script&gt;unsafe&lt;/script&gt;","Snapshot &lt;b&gt;street&lt;/b&gt;","Note &lt;img src=x&gt;","Snapshot shoe 0","Snapshot shoe 1","Size 42 - Snapshot cyan","Số lượng:","100.000","85.000","200.000","300.000","15.000","30.000","20.000","295.000","01/10/2026 08:15","Đã giao","Chuyển khoản ngân hàng","Chờ xác nhận thanh toán","https://store.twinkle.test/orders/"+id))assertTrue(body.contains(text),text);
        var delivery=sql.queryForObject("SELECT created_at FROM ORDER_STATUS_HISTORY WHERE id=?",Timestamp.class,historyId()).toLocalDateTime();assertTrue(body.contains(delivery.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));
        assertFalse(body.contains("<script>unsafe"));assertFalse(body.contains("<img src=x>"));assertFalse(body.contains("http://localhost"));
        assertEquals(items,sql.queryForList("SELECT * FROM ORDER_ITEMS WHERE order_id=? ORDER BY id",id));assertEquals(payment,sql.queryForMap("SELECT * FROM PAYMENTS WHERE order_id=?",id));
        assertEquals(deliveredUpdatedAt.get(),sql.queryForObject("SELECT updated_at FROM ORDERS WHERE id=?",Timestamp.class,id));
        var preview = java.nio.file.Path.of("target/integration-audit/closeout-email-preview.html");
        java.nio.file.Files.createDirectories(preview.getParent());
        java.nio.file.Files.writeString(preview,body,java.nio.charset.StandardCharsets.UTF_8);
    }
    @Test void otherStatusAndReadPathsDoNotSend() {
        sql.update("UPDATE ORDERS SET status=N'Chờ xác nhận đơn hàng' WHERE id=?",id);
        assertThrows(BusinessRuleException.class,()->fulfillment.transition(id,admin,"Đã xác nhận"));
        sql.update("UPDATE PAYMENTS SET status='PAID',paid_at=SYSDATETIME() WHERE order_id=?",id);
        fulfillment.transition(id,admin,"Đã xác nhận");orders.getOrderDetail(id,buyer);orders.getOrderTracking(id,buyer);
        verifyNoInteractions(sender);assertNull(sentAt());
    }
    @Test void duplicateTransitionAndEventDoNotResend() {
        fulfillment.transition(id,admin,"Đã giao");Object stamp=sentAt();
        assertThrows(BusinessRuleException.class,()->fulfillment.transition(id,admin,"Đã giao"));
        listener.onDelivered(new OrderDeliveredEvent(id,historyId()));
        verify(sender,times(1)).send(any(MimeMessage.class));assertEquals(stamp,sentAt());
        assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM ORDER_STATUS_HISTORY WHERE order_id=? AND status=N'Đã giao'",Integer.class,id));
    }
    @Test void persistentSentMarkerSuppressesNotification() {
        sql.update("UPDATE ORDERS SET delivery_mail_sent_at='2026-10-02T10:00:00' WHERE id=?",id);Object stamp=sentAt();
        fulfillment.transition(id,admin,"Đã giao");verifyNoInteractions(sender);assertEquals(stamp,sentAt());assertEquals("Đã giao",status());
    }
    @Test void smtpFailureCannotRollbackDeliveryAndDoesNotLeakDiagnostics(CapturedOutput output) {
        doThrow(new MailSendException("SYNTHETIC_PRIVATE_DIAGNOSTIC")).when(sender).send(any(MimeMessage.class));
        fulfillment.transition(id,admin,"Đã giao");assertEquals("Đã giao",status());assertNull(sentAt());assertTrue(historyId()>0);
        assertThrows(BusinessRuleException.class,()->fulfillment.transition(id,admin,"Đã giao"));verify(sender,times(1)).send(any(MimeMessage.class));
        assertTrue(output.getOut().contains("Delivery remains committed; no automatic retry"));assertFalse(output.getAll().contains("SYNTHETIC_PRIVATE_DIAGNOSTIC"));assertFalse(output.getAll().contains(buyer));
    }
    @Test void rolledBackDeliveryPublishesNoMail() {
        assertThrows(IllegalStateException.class,()->new TransactionTemplate(transactions).executeWithoutResult(tx->{fulfillment.transition(id,admin,"Đã giao");throw new IllegalStateException("Controlled rollback");}));
        assertEquals("Đang giao",status());assertNull(sentAt());verifyNoInteractions(sender);
        assertEquals(0,sql.queryForObject("SELECT COUNT(*) FROM ORDER_STATUS_HISTORY WHERE order_id=? AND status=N'Đã giao'",Integer.class,id));
    }
    @Test void concurrentDeliveryRequestsSendOnce() throws Exception {
        var pool=Executors.newFixedThreadPool(2);var start=new CountDownLatch(1);
        try {
            var tasks=new ArrayList<Future<Boolean>>();for(int i=0;i<2;i++)tasks.add(pool.submit(()->{start.await();try{fulfillment.transition(id,admin,"Đã giao");return true;}catch(BusinessRuleException rejected){return false;}}));
            start.countDown();int successes=0;for(var task:tasks)if(task.get(30,TimeUnit.SECONDS))successes++;
            assertEquals(1,successes);verify(sender,times(1)).send(any(MimeMessage.class));assertNotNull(sentAt());
        } finally {pool.shutdownNow();}
    }
    @Test void otpStillConstructsAndSendsThroughSharedSender() throws Exception {
        auth.generateAndSendOtp(users.findByEmail(buyer).orElseThrow(),"FORGOT_PASSWORD");
        var capture=ArgumentCaptor.forClass(SimpleMailMessage.class);verify(sender).send(capture.capture());var message=capture.getValue();
        assertEquals(buyer,message.getTo()[0]);assertEquals("Mã OTP xác thực T-Winkle",message.getSubject());assertTrue(message.getText().matches(".*[0-9]{6}.*"));verify(sender,never()).send(any(MimeMessage.class));
        assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM OTP_VERIFICATIONS WHERE user_email=? AND type='FORGOT_PASSWORD'",Integer.class,buyer));
    }
    @ParameterizedTest @CsvSource({"COD,PAID,Thanh toán khi nhận hàng,Đã thanh toán","BANKING,PENDING,Chuyển khoản ngân hàng,Chờ xác nhận thanh toán","BANKING,FAILED,Chuyển khoản ngân hàng,Thanh toán thất bại","BANKING,REFUNDED,Chuyển khoản ngân hàng,Đã hoàn tiền"})
    void readablePaymentLabels(String method,String paymentStatus,String methodLabel,String statusLabel) throws Exception {
        sql.update("UPDATE ORDERS SET payment_method=? WHERE id=?",method,id);sql.update("UPDATE PAYMENTS SET method=?,status=? WHERE order_id=?",method,paymentStatus,id);
        fulfillment.transition(id,admin,"Đã giao");String body=html();assertTrue(body.contains(methodLabel));assertTrue(body.contains(statusLabel));
    }
}
