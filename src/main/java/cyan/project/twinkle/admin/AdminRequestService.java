package cyan.project.twinkle.admin;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import tools.jackson.databind.json.JsonMapper;
import cyan.project.twinkle.manager.ManagerOperationsService.CatalogRequest;
import jakarta.validation.Validator;
import java.util.*;
import java.math.BigDecimal;

@Service @RequiredArgsConstructor
public class AdminRequestService {
 private final JdbcTemplate sql;private final AdminContextService context;private final AdminAuditService audit;private final AdminCatalogService catalog;private final Validator validator;
 public record Review(@jakarta.validation.constraints.NotNull Boolean approve,@jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max=1000) String note){}
 private void pending(Map<String,Object> row){if(!row.get("status").equals("PENDING"))throw new ResponseStatusException(HttpStatus.CONFLICT,"Yêu cầu đã được xử lý");}
 private <T>T validate(T dto){if(!validator.validate(dto).isEmpty())throw new IllegalArgumentException("Invalid catalog payload");return dto;}
 @Transactional public void catalog(long id,Review review){String actor=context.actor();var rows=sql.queryForList("SELECT * FROM CATALOG_CHANGE_REQUESTS WITH(UPDLOCK,HOLDLOCK) WHERE id=?",id);if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Yêu cầu không tồn tại");var row=rows.getFirst();pending(row);
  if(review.approve()){
   var r=JsonMapper.builder().build().readValue((String)row.get("requested_data"),CatalogRequest.class);validate(r);
   if(!r.requestType().equals(row.get("request_type"))||!Objects.equals(r.productId(),row.get("product_id"))||!Objects.equals(r.variantId(),row.get("variant_id")))throw new IllegalArgumentException("Request mismatch");
   Map<String,Object> p=r.productId()==null?Map.of():sql.queryForMap("SELECT * FROM PRODUCTS WHERE id=?",r.productId());
   switch(r.requestType()){
    case "ADD_PRODUCT","UPDATE_PRODUCT"->catalog.product(r.productId(),validate(new AdminCatalogService.ProductInput(r.name()!=null?r.name():(String)p.get("name"),r.slug()!=null?r.slug():(String)p.get("slug"),r.brandId()!=null?r.brandId():(Integer)p.get("brand_id"),r.categoryId()!=null?r.categoryId():(Integer)p.get("category_id"),r.basePrice()!=null?r.basePrice():(BigDecimal)p.get("base_price"),r.description()!=null?r.description():(String)p.get("description"),r.productId()==null?"ACTIVE":(String)p.get("status"),r.imageUrl())));
    case "REMOVE_PRODUCT"->sql.update("UPDATE PRODUCTS SET status='INACTIVE',updated_at=SYSDATETIME() WHERE id=?",r.productId());
    case "ADD_VARIANT","UPDATE_VARIANT"->{var v=r.variantId()==null?Map.<String,Object>of():sql.queryForMap("SELECT * FROM PRODUCT_VARIANTS WHERE id=? AND product_id=?",r.variantId(),r.productId());catalog.variant(r.variantId(),validate(new AdminCatalogService.VariantInput(r.productId(),r.size()!=null?r.size():(String)v.get("size"),r.color()!=null?r.color():(String)v.get("color"),r.variantId()==null?"TW-"+UUID.randomUUID():(String)v.get("sku"),r.priceAdjustment()!=null?r.priceAdjustment():r.variantId()==null?BigDecimal.ZERO:(BigDecimal)v.get("price_adjustment"),r.imageUrl()!=null?r.imageUrl():(String)v.get("image_url"),r.variantId()==null?"ACTIVE":(String)v.get("status"))));}
    case "REMOVE_VARIANT"->sql.update("UPDATE PRODUCT_VARIANTS SET status='INACTIVE' WHERE id=? AND product_id=?",r.variantId(),r.productId());
    default->throw new IllegalArgumentException();
   }
  }
  sql.update("UPDATE CATALOG_CHANGE_REQUESTS SET status=?,reviewed_by=?,reviewed_at=SYSDATETIME(),updated_at=SYSDATETIME(),review_note=? WHERE id=?",review.approve()?"APPLIED":"REJECTED",actor,review.note(),id);audit.record(actor,review.approve()?"CATALOG_REQUEST_APPROVED":"CATALOG_REQUEST_REJECTED","CATALOG_CHANGE_REQUESTS",id,review.note());
 }
 @Transactional public void adjust(int store,long variant,int quantity,String reason,String type,Long reference){String actor=context.actor();if(quantity<0||reason==null||reason.isBlank()||reason.length()>1000||!Set.of("MANUAL_ADJUSTMENT","RESTOCK","CORRECTION","RETURN").contains(type))throw new IllegalArgumentException();int old=sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WITH(UPDLOCK,HOLDLOCK) WHERE store_id=? AND variant_id=?",Integer.class,store,variant);sql.update("UPDATE STORE_INVENTORY SET quantity=?,updated_at=SYSDATETIME() WHERE store_id=? AND variant_id=?",quantity,store,variant);sql.update("INSERT INVENTORY_MOVEMENTS(store_id,variant_id,old_quantity,quantity_delta,new_quantity,movement_type,reason,reference_type,reference_id,performed_by) VALUES(?,?,?,?,?,?,?,?,?,?)",store,variant,old,quantity-old,quantity,type,reason,reference==null?null:"RESTOCK_REQUEST",reference,actor);audit.record(actor,"INVENTORY_ADJUSTED","STORE_INVENTORY",store+":"+variant,reason);}
 @Transactional public void restock(long id,Review review){String actor=context.actor();var rows=sql.queryForList("SELECT * FROM INVENTORY_RESTOCK_REQUESTS WITH(UPDLOCK,HOLDLOCK) WHERE id=?",id);if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Yêu cầu không tồn tại");var r=rows.getFirst();pending(r);if(review.approve()){int store=((Number)r.get("store_id")).intValue();long variant=((Number)r.get("variant_id")).longValue();int old=sql.queryForObject("SELECT quantity FROM STORE_INVENTORY WITH(UPDLOCK,HOLDLOCK) WHERE store_id=? AND variant_id=?",Integer.class,store,variant);int delta=((Number)r.get("requested_quantity")).intValue();if(delta<1)throw new IllegalArgumentException();adjust(store,variant,Math.addExact(old,delta),review.note(),"RESTOCK",id);}sql.update("UPDATE INVENTORY_RESTOCK_REQUESTS SET status=?,reviewed_by=?,reviewed_at=SYSDATETIME(),fulfilled_at=CASE WHEN ?=1 THEN SYSDATETIME() ELSE NULL END,note=? WHERE id=?",review.approve()?"FULFILLED":"REJECTED",actor,review.approve(),review.note(),id);audit.record(actor,review.approve()?"RESTOCK_APPROVED":"RESTOCK_REJECTED","INVENTORY_RESTOCK_REQUESTS",id,review.note());}
}

