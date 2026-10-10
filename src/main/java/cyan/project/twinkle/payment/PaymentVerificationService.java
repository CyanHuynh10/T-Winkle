package cyan.project.twinkle.payment;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import cyan.project.twinkle.repository.*;
import cyan.project.twinkle.admin.AdminAuditService;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor
public class PaymentVerificationService {
 private final JdbcTemplate sql;private final PaymentRepository payments;private final OrderRepository orders;private final UserRepository users;private final AdminAuditService audit;
 private void deny(){throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Không có quyền xác minh thanh toán");}
 @Transactional public long report(long orderId,String actor){
  var order=orders.findForUpdate(orderId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  if(!order.getUser().getEmail().equals(actor))deny();
  var payment=payments.findOwnedByOrder(orderId,actor).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  if(!"BANKING".equals(payment.getMethod())||!"PENDING".equals(payment.getStatus())||"Đã hủy".equals(order.getStatus()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Thanh toán không cho phép báo chuyển khoản");
  var existing=sql.queryForList("SELECT id FROM PAYMENT_VERIFICATIONS WITH(UPDLOCK,HOLDLOCK) WHERE payment_id=? AND status='PENDING'",Long.class,payment.getId());
  if(!existing.isEmpty())return existing.getFirst();
  return sql.queryForObject("INSERT PAYMENT_VERIFICATIONS(payment_id,reported_by) OUTPUT INSERTED.id VALUES(?,?)",Long.class,payment.getId(),actor);
 }
 @Transactional public void review(long paymentId,String actor,boolean confirm,String note){
  if(note==null||note.isBlank()||note.length()>1000)throw new IllegalArgumentException("Review note required");
  var user=users.findByEmail(actor).orElseThrow(()->new ResponseStatusException(HttpStatus.FORBIDDEN));
  boolean admin=user.getRoles().stream().anyMatch(r->r.getName().equals("ROLE_ADMIN")),manager=user.getRoles().stream().anyMatch(r->r.getName().equals("ROLE_MANAGER"));
  if(!Boolean.TRUE.equals(user.getIsEnabled())||(!admin&&!manager))deny();
  Long orderId=sql.queryForObject("SELECT order_id FROM PAYMENTS WHERE id=?",Long.class,paymentId);
  var order=orders.findForUpdate(orderId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  if(actor.equals(order.getUser().getEmail()))deny();
  if(!admin){var assigned=sql.queryForList("SELECT store_id FROM STORES WHERE manager_email=?",Integer.class,actor);if(assigned.size()!=1||order.getOrderItems().stream().noneMatch(i->i.getStore().getId().equals(assigned.getFirst())))deny();}
  var payment=payments.findForUpdate(paymentId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  if(!"BANKING".equals(payment.getMethod())||payment.getAmount().compareTo(order.getTotal())!=0||"Đã hủy".equals(order.getStatus()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Thanh toán không hợp lệ để xác minh");
  if("PAID".equals(payment.getStatus())&&confirm)return;
  if(!"PENDING".equals(payment.getStatus()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Thanh toán đã kết thúc");
  var pending=sql.queryForList("SELECT id FROM PAYMENT_VERIFICATIONS WITH(UPDLOCK,HOLDLOCK) WHERE payment_id=? AND status='PENDING'",Long.class,paymentId);
  // Staff can verify a bank receipt without a customer report. Preserve provenance as a staff initiated review.
  long verification;
  if(pending.isEmpty()){if(!confirm)throw new ResponseStatusException(HttpStatus.CONFLICT,"Không có yêu cầu chờ xác minh");verification=sql.queryForObject("INSERT PAYMENT_VERIFICATIONS(payment_id,reported_by) OUTPUT INSERTED.id VALUES(?,?)",Long.class,paymentId,actor);}
  else verification=pending.getFirst();
  if(confirm){payment.setStatus("PAID");payment.setPaidAt(LocalDateTime.now());payments.saveAndFlush(payment);}
  sql.update("UPDATE PAYMENT_VERIFICATIONS SET status=?,reviewed_by=?,reviewed_at=SYSDATETIME(),updated_at=SYSDATETIME(),review_note=? WHERE id=?",confirm?"CONFIRMED":"REJECTED",actor,note,verification);
  audit.record(actor,confirm?"PAYMENT_CONFIRMED":"PAYMENT_REJECTED","PAYMENTS",paymentId,note);
 }
 @Transactional(readOnly=true) public Map<String,Object> latest(long paymentId){var rows=sql.queryForList("SELECT TOP(1) id,status,reported_at,reviewed_at,review_note FROM PAYMENT_VERIFICATIONS WHERE payment_id=? ORDER BY id DESC",paymentId);return rows.isEmpty()?Map.of():rows.getFirst();}
}
