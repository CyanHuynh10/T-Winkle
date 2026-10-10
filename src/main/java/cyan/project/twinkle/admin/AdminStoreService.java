package cyan.project.twinkle.admin;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
@Service @RequiredArgsConstructor
public class AdminStoreService {
 private final JdbcTemplate sql;private final AdminContextService context;private final AdminAuditService audit;
 public record StoreInput(@NotBlank @Size(max=150) String name,@NotBlank @Size(max=80) @Pattern(regexp="[a-z0-9]+(?:-[a-z0-9]+)*") String slug,@Size(max=500) String description,@Size(max=500) String imageUrl,@Pattern(regexp="[0-9+() .-]{0,20}") String phone,@NotBlank @Size(max=200) String addressLine,@Size(max=100) String ward,@Size(max=100) String district,@NotBlank @Size(max=100) String city,@NotBlank @Pattern(regexp="OPEN|CLOSED") String status,@Email @Size(max=100) String managerEmail){}
 @Transactional public int save(Integer id,StoreInput input){String actor=context.actor();AdminCatalogService.url(input.imageUrl());String manager=input.managerEmail()==null||input.managerEmail().isBlank()?null:input.managerEmail();
  if(manager!=null){if(sql.queryForObject("SELECT COUNT(*) FROM USERS u WITH(UPDLOCK,HOLDLOCK) JOIN USER_ROLES ur ON ur.user_email=u.email JOIN ROLES r ON r.id=ur.role_id WHERE u.email=? AND u.is_enabled=1 AND r.name='ROLE_MANAGER'",Integer.class,manager)!=1)throw new IllegalArgumentException("Enabled manager required");if(sql.queryForObject("SELECT COUNT(*) FROM STORES WITH(UPDLOCK,HOLDLOCK) WHERE manager_email=? AND store_id<>?",Integer.class,manager,id==null?-1:id)>0)throw new ResponseStatusException(HttpStatus.CONFLICT,"Manager đã được gán cửa hàng khác");}
  String old=null;int result;
  if(id==null)result=sql.queryForObject("INSERT STORES(name,slug,description,image_url,phone,address_line,ward,district,city,status,manager_email) OUTPUT INSERTED.store_id VALUES(?,?,?,?,?,?,?,?,?,?,?)",Integer.class,input.name(),input.slug(),input.description(),input.imageUrl(),input.phone(),input.addressLine(),input.ward(),input.district(),input.city(),input.status(),manager);
  else{old=sql.queryForObject("SELECT status FROM STORES WITH(UPDLOCK,HOLDLOCK) WHERE store_id=?",String.class,id);sql.update("UPDATE STORES SET name=?,slug=?,description=?,image_url=?,phone=?,address_line=?,ward=?,district=?,city=?,status=?,manager_email=? WHERE store_id=?",input.name(),input.slug(),input.description(),input.imageUrl(),input.phone(),input.addressLine(),input.ward(),input.district(),input.city(),input.status(),manager,id);result=id;}
  if(old!=null&&!old.equals(input.status()))sql.update("INSERT STORE_STATUS_HISTORY(store_id,old_status,new_status,changed_by) VALUES(?,?,?,?)",result,old,input.status(),actor);
  audit.record(actor,id==null?"STORE_CREATED":"STORE_UPDATED","STORES",result,"Store profile saved.");audit.record(actor,"STORE_MANAGER_ASSIGNED","STORES",result,manager==null?"Manager assignment removed.":"Assigned "+manager);return result;
 }
 @Transactional public void delete(int id){String actor=context.actor();if(sql.update("DELETE STORES WHERE store_id=?",id)!=1)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Cửa hàng không tồn tại");audit.record(actor,"STORE_DELETED","STORES",id,"Unused store deleted.");}
}
