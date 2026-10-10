package cyan.project.twinkle.payment;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cyan.project.twinkle.admin.AdminContextService;
import cyan.project.twinkle.manager.ManagerStoreContextService;
import java.util.*;
@Service @RequiredArgsConstructor
public class PaymentQueryService {
 private final JdbcTemplate sql;private final AdminContextService admin;private final ManagerStoreContextService manager;
 public record Page(List<Map<String,Object>> items,long total,int page,int size){}
 @Transactional(readOnly=true) public Page list(boolean global,int page,int size,String search,String status,Integer store,String method,String verification){return list(global,page,size,search,status,store,method,verification,"","");}
 @Transactional(readOnly=true) public Page list(boolean global,int page,int size,String search,String status,Integer store,String method,String verification,String fromDate,String toDate){
  if(page<0||page>1000000||size<1||size>100||search.length()>150)throw new IllegalArgumentException();size=30;if(global)admin.actor();else store=manager.requireCurrentStore().getId();
  String source=" FROM PAYMENTS p JOIN ORDERS o ON o.id=p.order_id LEFT JOIN PAYMENT_REFUNDS refund ON refund.payment_id=p.id LEFT JOIN ORDER_CANCELLATIONS cancellation ON cancellation.order_id=o.id OUTER APPLY(SELECT TOP(1) id,status,reported_at,reported_by,reviewed_at,reviewed_by,review_note FROM PAYMENT_VERIFICATIONS v WHERE v.payment_id=p.id ORDER BY v.id DESC) v WHERE o.order_code LIKE ?";var args=new ArrayList<Object>();args.add("%"+search+"%");
  if(store!=null){source+=" AND EXISTS(SELECT 1 FROM ORDER_ITEMS i WHERE i.order_id=o.id AND i.store_id=?)";args.add(store);}if(!status.isBlank()){source+=" AND p.status=?";args.add(status);}if(!method.isBlank()){source+=" AND p.method=?";args.add(method);}if(!verification.isBlank()){source+=" AND v.status=?";args.add(verification);}
  if(!fromDate.isBlank()){source+=" AND p.created_at>=?";args.add(java.time.LocalDate.parse(fromDate).atStartOfDay());}if(!toDate.isBlank()){source+=" AND p.created_at<?";args.add(java.time.LocalDate.parse(toDate).plusDays(1).atStartOfDay());}
  long total=sql.queryForObject("SELECT COUNT_BIG(*)"+source,Long.class,args.toArray());args.add(Math.multiplyExact(page,size));args.add(size);
  String storeNames=global?"(SELECT STRING_AGG(s.name,N', ') FROM STORES s WHERE EXISTS(SELECT 1 FROM ORDER_ITEMS i WHERE i.order_id=o.id AND i.store_id=s.store_id))":"(SELECT name FROM STORES WHERE store_id="+store+")";
  return new Page(sql.queryForList("SELECT "+storeNames+" AS stores,COALESCE(v.reviewed_at,p.paid_at,p.created_at) AS updated_at,p.id,p.order_id,o.order_code,o.user_email AS customer,p.amount,p.method,p.status,p.created_at,p.paid_at,refund.status AS refund_status,cancellation.status AS cancellation_status,v.status AS verification_status,v.reported_at,v.reported_by,v.reviewed_at,v.reviewed_by,v.review_note"+source+" ORDER BY p.id DESC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY",args.toArray()),total,page,size);
 }
}

