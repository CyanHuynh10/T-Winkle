package cyan.project.twinkle.review;

import cyan.project.twinkle.admin.AdminAuditService;
import cyan.project.twinkle.chat.support.SupportAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.*;

@Service @RequiredArgsConstructor
public class StaffReviewService {
 private final JdbcTemplate sql;
 private final SupportAuthorizationService access;
 private final AdminAuditService audit;
 public record Page(List<Map<String,Object>> items,long total,int page,int size) {}
 private void staff(Authentication auth){if(!(access.role(auth,"ADMIN")||access.role(auth,"MANAGER")||access.role(auth,"SUPPORT")))throw new AccessDeniedException("REVIEW_ACCESS_DENIED");}
 // A mismatched historical order/product/customer linkage is unscoped, visible only to Admin.
 private static final String SOURCE=" FROM REVIEWS r JOIN PRODUCTS p ON p.id=r.product_id JOIN USERS u ON u.email=r.user_email LEFT JOIN ORDER_ITEMS i ON i.id=r.order_item_id AND i.order_id=r.order_id AND i.product_id=r.product_id AND EXISTS(SELECT 1 FROM ORDERS o WHERE o.id=r.order_id AND o.user_email=r.user_email) LEFT JOIN STORES s ON s.store_id=i.store_id LEFT JOIN REVIEW_RESPONSES a ON a.review_id=r.id LEFT JOIN USERS actor ON actor.email=a.responder_email";
 @Transactional(readOnly=true) public Page list(Authentication auth,int page,String search,Integer rating,String replied,Integer store){
  staff(auth);if(page<0||page>1000000||search.length()>150||rating!=null&&(rating<1||rating>5)||!Set.of("","yes","no").contains(replied))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Bộ lọc không hợp lệ");
  String where=" WHERE (?=1 OR (?=1 AND s.manager_email=?) OR (?=1 AND EXISTS(SELECT 1 FROM STORE_STAFF_ASSIGNMENTS t WHERE t.store_id=i.store_id AND t.user_email=? AND t.active=1))) AND (? IS NULL OR i.store_id=?) AND (p.name LIKE ? OR r.comment LIKE ?) AND (? IS NULL OR r.rating=?)"+(replied.equals("yes")?" AND a.id IS NOT NULL":replied.equals("no")?" AND a.id IS NULL":"");
  var args=new ArrayList<Object>(Arrays.asList(access.role(auth,"ADMIN"),access.role(auth,"MANAGER"),auth.getName(),access.role(auth,"SUPPORT"),auth.getName(),store,store,"%"+search+"%","%"+search+"%",rating,rating));
  long total=sql.queryForObject("SELECT COUNT_BIG(*)"+SOURCE+where,Long.class,args.toArray());args.add(page*30);args.add(30);
  var rows=sql.queryForList("SELECT r.id,p.name AS product,i.store_id,s.name AS store,COALESCE(NULLIF(u.full_name,''),u.username) AS customer,r.rating,r.comment,r.created_at,a.content AS response,a.updated_at AS response_at,COALESCE(NULLIF(actor.full_name,''),actor.username) AS responder,(SELECT STRING_AGG(ro.name,', ') FROM USER_ROLES ur JOIN ROLES ro ON ro.id=ur.role_id WHERE ur.user_email=a.responder_email) AS responder_role"+SOURCE+where+" ORDER BY r.created_at DESC,r.id DESC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY",args.toArray());
  return new Page(rows,total,page,30);
 }
 private Map<String,Object> locked(long id,Authentication auth,boolean deletion){
  staff(auth);if(deletion&&!(access.role(auth,"ADMIN")||access.role(auth,"MANAGER")))throw new AccessDeniedException("REVIEW_DELETE_DENIED");
  var rows=sql.queryForList("SELECT r.id,r.order_item_id,i.store_id FROM REVIEWS r WITH(UPDLOCK,HOLDLOCK) LEFT JOIN ORDER_ITEMS i ON i.id=r.order_item_id AND i.order_id=r.order_id AND i.product_id=r.product_id AND EXISTS(SELECT 1 FROM ORDERS o WHERE o.id=r.order_id AND o.user_email=r.user_email) WHERE r.id=?",id);
  if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Đánh giá không tồn tại");var row=rows.getFirst();
  if(!access.role(auth,"ADMIN")&&(row.get("store_id")==null||!access.staff(auth,((Number)row.get("store_id")).intValue())))throw new AccessDeniedException("REVIEW_ACCESS_DENIED");return row;
 }
 @Transactional public void reply(long id,String content,Authentication auth){
  var row=locked(id,auth,false);if(row.get("store_id")==null)throw new ResponseStatusException(HttpStatus.CONFLICT,"Đánh giá chưa xác định được cửa hàng");
  content=content==null?"":content.trim();if(content.isBlank()||content.length()>2000||content.matches("(?s).*<[^>]*>.*"))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Phản hồi phải là văn bản từ 1 đến 2000 ký tự");
  if(sql.update("UPDATE REVIEW_RESPONSES SET responder_email=?,content=?,updated_at=SYSDATETIME() WHERE review_id=?",auth.getName(),content,id)==0)
   sql.update("INSERT REVIEW_RESPONSES(review_id,order_item_id,store_id,responder_email,content) VALUES(?,?,?,?,?)",id,row.get("order_item_id"),row.get("store_id"),auth.getName(),content);
 }
 @Transactional public void delete(long id,Authentication auth){var row=locked(id,auth,true);sql.update("DELETE REVIEW_RESPONSES WHERE review_id=?",id);sql.update("DELETE REVIEWS WHERE id=?",id);audit.record(auth.getName(),"REVIEW_DELETED","REVIEWS",id,"Store "+row.get("store_id"));}
 @Transactional(readOnly=true) public List<cyan.project.twinkle.dto.ProductDetailDTO.ReviewDTO> publicReviews(int product){
  return sql.query("SELECT COALESCE(NULLIF(u.full_name,''),u.username) AS display_name,r.rating,r.comment,r.created_at,a.content,a.updated_at,s.name AS store_name"+SOURCE+" WHERE r.product_id=? AND r.status='APPROVED' ORDER BY r.created_at DESC,r.id DESC",(rs,n)->new cyan.project.twinkle.dto.ProductDetailDTO.ReviewDTO(rs.getString("display_name"),rs.getInt("rating"),rs.getString("comment"),rs.getTimestamp("created_at").toLocalDateTime(),rs.getString("content"),rs.getString("store_name"),rs.getTimestamp("updated_at")==null?null:rs.getTimestamp("updated_at").toLocalDateTime()),product);
 }
}
