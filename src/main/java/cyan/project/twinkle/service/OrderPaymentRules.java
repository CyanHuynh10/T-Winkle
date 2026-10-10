package cyan.project.twinkle.service;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.RequiredArgsConstructor;
import cyan.project.twinkle.entity.Order;
import cyan.project.twinkle.exception.BusinessRuleException;
@Service @RequiredArgsConstructor
public class OrderPaymentRules {
 private final JdbcTemplate sql;
 public void confirmAllowed(Order order,String target){
  if("Đã xác nhận".equals(target)&&"BANKING".equals(order.getPaymentMethod())&&sql.queryForObject("SELECT COUNT(*) FROM PAYMENTS WHERE order_id=? AND method='BANKING' AND status='PAID'",Integer.class,order.getId())!=1)
   throw new BusinessRuleException("Chuyển khoản chưa được xác minh. Cần thanh toán PAID trước khi xác nhận đơn hàng");
 }
 public void delivered(Order order){if("COD".equals(order.getPaymentMethod()))sql.update("UPDATE PAYMENTS SET status='PAID',paid_at=SYSDATETIME() WHERE order_id=? AND method='COD' AND status='PENDING'",order.getId());}
}
