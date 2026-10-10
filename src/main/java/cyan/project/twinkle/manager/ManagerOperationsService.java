package cyan.project.twinkle.manager;

import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.json.JsonMapper;
import java.math.BigDecimal;
import java.util.*;

@Service @RequiredArgsConstructor
public class ManagerOperationsService {
    private final JdbcTemplate sql;
    private final ManagerStoreContextService context;
    public record StoreProfile(@NotBlank @Size(max=180) String name,@Size(max=500) String description,
        @Pattern(regexp="[0-9+() .-]{0,20}") String phone,@NotBlank @Size(max=200) String addressLine,
        @Size(max=100) String ward,@Size(max=100) String district,@NotBlank @Size(max=100) String city,@Size(max=500) String imageUrl) {}
    public record StatusChange(@NotBlank @Pattern(regexp="OPEN|CLOSED") String status) {}
    public record CatalogRequest(@NotBlank String requestType,Integer productId,Long variantId,
        @NotBlank @Size(max=1000) String reason,@Size(max=180) String name,@Size(max=4000) String description,
        @DecimalMin("0") BigDecimal basePrice,@Size(max=50) String size,@Size(max=80) String color,@DecimalMin("0") BigDecimal priceAdjustment,
        Integer brandId,Integer categoryId,@Size(max=180) String slug,@Size(max=500) String imageUrl) {
        public CatalogRequest(String requestType,Integer productId,Long variantId,String reason,String name,String description,BigDecimal basePrice,String size,String color,BigDecimal priceAdjustment) {
            this(requestType,productId,variantId,reason,name,description,basePrice,size,color,priceAdjustment,null,null,null,null);
        }
    }
    public record RestockRequest(@NotNull Long variantId,@Min(1) @Max(1000000) int requestedQuantity,@NotBlank @Size(max=1000) String reason,@Size(max=1000) String note) {}
    @Transactional(readOnly=true)
    public Map<String,Object> store() {
        int id=context.requireCurrentStore().getId();
        return sql.queryForMap("SELECT store_id,slug,name,description,image_url,phone,address_line,ward,district,city,status,rating_average,review_count,manager_email,created_at FROM STORES WHERE store_id=?",id);
    }
    @Transactional
    public void profile(StoreProfile input) {
        int id=context.requireCurrentStore().getId();
        if(input.imageUrl()!=null && !input.imageUrl().isBlank() && !input.imageUrl().matches("^(https://[^\\s]+|/(?!/)[^\\s]*)$"))throw ManagerException.invalid("Ảnh phải dùng HTTPS hoặc đường dẫn nội bộ");
        sql.update("UPDATE STORES SET name=?,description=?,phone=?,address_line=?,ward=?,district=?,city=?,image_url=? WHERE store_id=?",input.name().trim(),input.description(),input.phone(),input.addressLine().trim(),input.ward(),input.district(),input.city().trim(),input.imageUrl(),id);
    }
    @Transactional
    public void status(StatusChange input) {
        int id=context.requireCurrentStore().getId();String actor=context.actor();
        String old=sql.queryForObject("SELECT status FROM STORES WITH(UPDLOCK,HOLDLOCK) WHERE store_id=?",String.class,id);
        if(old.equals(input.status()))return;
        sql.update("UPDATE STORES SET status=? WHERE store_id=?",input.status(),id);
        sql.update("INSERT STORE_STATUS_HISTORY(store_id,old_status,new_status,changed_by) VALUES(?,?,?,?)",id,old,input.status(),actor);
    }
    @Transactional
    public long catalog(CatalogRequest input) {
        int store=context.requireCurrentStore().getId();String actor=context.actor();
        if(!Set.of("ADD_PRODUCT","UPDATE_PRODUCT","REMOVE_PRODUCT","ADD_VARIANT","UPDATE_VARIANT","REMOVE_VARIANT").contains(input.requestType()))throw ManagerException.invalid("Loại yêu cầu không hợp lệ");
        if(!input.requestType().equals("ADD_PRODUCT") && input.productId()==null)throw ManagerException.invalid("Cần chọn sản phẩm");
        if(input.productId()!=null && sql.queryForObject("SELECT COUNT(*) FROM PRODUCTS WHERE id=?",Integer.class,input.productId())==0)throw ManagerException.invalid("Sản phẩm không tồn tại");
        if(input.brandId()!=null && sql.queryForObject("SELECT COUNT(*) FROM BRANDS WHERE id=?",Integer.class,input.brandId())==0)throw ManagerException.invalid("Thương hiệu không tồn tại");
        if(input.categoryId()!=null && sql.queryForObject("SELECT COUNT(*) FROM CATEGORIES WHERE id=?",Integer.class,input.categoryId())==0)throw ManagerException.invalid("Danh mục không tồn tại");
        if(input.imageUrl()!=null && !input.imageUrl().isBlank() && !input.imageUrl().matches("^(https://[^\\s]+|/(?!/)[^\\s]*)$"))throw ManagerException.invalid("Ảnh phải dùng HTTPS hoặc đường dẫn nội bộ");
        if(Set.of("UPDATE_VARIANT","REMOVE_VARIANT").contains(input.requestType()) && input.variantId()==null)throw ManagerException.invalid("Cần chọn biến thể");
        if(input.variantId()!=null && sql.queryForObject("SELECT COUNT(*) FROM PRODUCT_VARIANTS WHERE id=? AND product_id=?",Integer.class,input.variantId(),input.productId())==0)throw ManagerException.invalid("Biến thể không thuộc sản phẩm");
        if(input.requestType().equals("ADD_PRODUCT") && (input.name()==null || input.name().isBlank() || input.basePrice()==null))throw ManagerException.invalid("Cần tên và giá sản phẩm đề xuất");
        if(input.requestType().equals("ADD_VARIANT") && (input.size()==null || input.size().isBlank() || input.color()==null || input.color().isBlank()))throw ManagerException.invalid("Cần size và màu đề xuất");
        String json=JsonMapper.builder().build().writeValueAsString(input);
        return sql.queryForObject("INSERT CATALOG_CHANGE_REQUESTS(store_id,requester_email,request_type,product_id,variant_id,requested_data,reason) OUTPUT INSERTED.id VALUES(?,?,?,?,?,?,?)",Long.class,store,actor,input.requestType(),input.productId(),input.variantId(),json,input.reason().trim());
    }
    @Transactional
    public long restock(RestockRequest input) {
        int store=context.requireCurrentStore().getId();String actor=context.actor();
        var rows=sql.queryForList("SELECT quantity,reorder_level FROM STORE_INVENTORY WITH(UPDLOCK,HOLDLOCK) WHERE store_id=? AND variant_id=?",store,input.variantId());
        if(rows.isEmpty())throw new org.springframework.security.access.AccessDeniedException("NOT_AUTHORIZED");
        int quantity=((Number)rows.getFirst().get("quantity")).intValue(),threshold=((Number)rows.getFirst().get("reorder_level")).intValue();
        if(quantity>threshold)throw new ManagerException("CONFLICT","Chỉ báo nhập hàng khi sắp hết hoặc hết hàng",409);
        if(sql.queryForObject("SELECT COUNT(*) FROM INVENTORY_RESTOCK_REQUESTS WHERE store_id=? AND variant_id=? AND status='PENDING'",Integer.class,store,input.variantId())>0)
            throw new ManagerException("DUPLICATE_REQUEST","Đã có yêu cầu nhập hàng đang chờ",409);
        return sql.queryForObject("INSERT INVENTORY_RESTOCK_REQUESTS(store_id,variant_id,current_quantity,reorder_level,requested_quantity,reason,note,requested_by) OUTPUT INSERTED.id VALUES(?,?,?,?,?,?,?,?)",Long.class,store,input.variantId(),quantity,threshold,input.requestedQuantity(),input.reason().trim(),input.note(),actor);
    }
}
