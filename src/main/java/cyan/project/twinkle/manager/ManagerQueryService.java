package cyan.project.twinkle.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cyan.project.twinkle.repository.ProductRepository;
import cyan.project.twinkle.service.PricingService;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly=true)
public class ManagerQueryService {
    private final JdbcTemplate sql;
    private final ManagerStoreContextService context;
    private final ProductRepository products;
    private final PricingService pricing;
    public record PageDto(List<Map<String,Object>> items, long total, int page, int size) {}
    public List<Map<String,Object>> options(String kind,String search) {
        context.requireCurrentStore();
        String table=switch(kind){case "brands"->"BRANDS";case "categories"->"CATEGORIES";default->throw ManagerException.invalid("Loại danh mục không hợp lệ");};
        if(search.length()>150)throw ManagerException.invalid("Tìm kiếm quá dài");
        return sql.queryForList("SELECT TOP(100) id,name,slug FROM "+table+" WHERE name LIKE ? OR slug LIKE ? ORDER BY name,id","%"+search+"%","%"+search+"%");
    }
    public static String replenishment(int quantity,int threshold) { return quantity<=0 ? "OUT" : quantity<=threshold ? "LOW" : "AVAILABLE"; }
    public PageDto list(String area,int page,int size,String search,String status,String sort,String direction,String brand,String category,String sizeFilter,String color,Boolean pending,String method,String paymentStatus,String fromDate,String toDate) {
        int store=context.requireCurrentStore().getId();
        if(page<0 || size<1 || size>100 || search.length()>150) throw ManagerException.invalid("Phân trang/tìm kiếm không hợp lệ");size=30;
        var args=new ArrayList<Object>(); args.add(store);
        String select,from,where,defaultSort;
        switch(area) {
            case "products" -> {
                select="p.id,p.name,p.slug,p.base_price,p.status,p.updated_at,b.name AS brand,c.name AS category,"+
                    "(SELECT COUNT(*) FROM PRODUCT_VARIANTS v WHERE v.product_id=p.id) AS variant_count,"+
                    "(SELECT COUNT(DISTINCT size) FROM PRODUCT_VARIANTS v WHERE v.product_id=p.id) AS size_count,"+
                    "(SELECT COUNT(DISTINCT color) FROM PRODUCT_VARIANTS v WHERE v.product_id=p.id) AS color_count,"+
                    "COALESCE((SELECT SUM(si.quantity) FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id WHERE si.store_id=scope.store_id AND v.product_id=p.id),0) AS quantity";
                from="PRODUCTS p JOIN BRANDS b ON b.id=p.brand_id JOIN CATEGORIES c ON c.id=p.category_id CROSS JOIN (SELECT ? AS store_id) scope";
                where=" WHERE (p.name LIKE ? OR p.slug LIKE ?)"; defaultSort="p.id";
                args.add("%"+search+"%");args.add("%"+search+"%");
                if(!status.isBlank()){where+=" AND p.status=?";args.add(status);}
                if(!brand.isBlank()){where+=" AND b.slug=?";args.add(brand);}
                if(!category.isBlank()){where+=" AND c.slug=?";args.add(category);}
            }
            case "variants", "inventory" -> {
                boolean inv=area.equals("inventory");
                select="v.id,v.product_id,p.name AS product,v.sku,v.size,v.color,v.price_adjustment,v.status,COALESCE(si.quantity,0) AS quantity,COALESCE(si.reorder_level,10) AS reorder_level,si.updated_at,"+
                    "CASE WHEN COALESCE(si.quantity,0)=0 THEN 'OUT' WHEN si.quantity<=si.reorder_level THEN 'LOW' ELSE 'AVAILABLE' END AS replenishment_state,"+
                    "CASE WHEN EXISTS(SELECT 1 FROM INVENTORY_RESTOCK_REQUESTS r WHERE r.store_id=scope.store_id AND r.variant_id=v.id AND r.status='PENDING') THEN 1 ELSE 0 END AS pending_request";
                from="PRODUCT_VARIANTS v JOIN PRODUCTS p ON p.id=v.product_id CROSS JOIN (SELECT ? AS store_id) scope "+(inv?"JOIN":"LEFT JOIN")+" STORE_INVENTORY si ON si.variant_id=v.id AND si.store_id=scope.store_id";
                where=" WHERE (p.name LIKE ? OR v.sku LIKE ?)";defaultSort="v.id";
                args.add("%"+search+"%");args.add("%"+search+"%");
                if(!status.isBlank()){where+=inv ? " AND (CASE WHEN si.quantity=0 THEN 'OUT' WHEN si.quantity<=si.reorder_level THEN 'LOW' ELSE 'AVAILABLE' END)=?" : " AND v.status=?";args.add(status);}
                if(!sizeFilter.isBlank()){where+=" AND v.size=?";args.add(sizeFilter);}
                if(!color.isBlank()){where+=" AND v.color=?";args.add(color);}
                if(pending!=null){where+=" AND (CASE WHEN EXISTS(SELECT 1 FROM INVENTORY_RESTOCK_REQUESTS r WHERE r.store_id=scope.store_id AND r.variant_id=v.id AND r.status='PENDING') THEN 1 ELSE 0 END)=?";args.add(pending?1:0);}
            }
            case "orders" -> {
                select="o.id,o.order_code,o.created_at,o.updated_at,o.status,o.fulfillment_mode,CASE WHEN o.status=N'Chờ xác nhận đơn hàng' AND o.payment_method='BANKING' AND COALESCE(pay.status,'PENDING')<>'PAID' THEN N'Chờ xác nhận thanh toán' ELSE o.status END AS display_status,o.payment_method,pay.status AS payment_status,COALESCE(f.status,o.status) AS fulfillment_status,x.item_count,x.quantity,x.merchandise_value";
                from="ORDERS o JOIN (SELECT order_id,COUNT(*) AS item_count,SUM(quantity) AS quantity,SUM(line_total) AS merchandise_value FROM ORDER_ITEMS WHERE store_id=? GROUP BY order_id) x ON x.order_id=o.id LEFT JOIN PAYMENTS pay ON pay.order_id=o.id LEFT JOIN ORDER_STORE_FULFILLMENTS f ON f.order_id=o.id AND f.store_id="+store;
                where=" WHERE o.order_code LIKE ?";defaultSort="o.id";args.add("%"+search+"%");
                if(!status.isBlank()){where+=" AND COALESCE(f.status,o.status)=?";args.add(status);}
                if(!method.isBlank()){where+=" AND o.payment_method=?";args.add(method);}
                if(!paymentStatus.isBlank()){where+=" AND pay.status=?";args.add(paymentStatus);}
                if(!fromDate.isBlank()){where+=" AND o.created_at>=?";args.add(parseDate(fromDate));}
                if(!toDate.isBlank()){where+=" AND o.created_at<?";args.add(parseDate(toDate).plusDays(1));}
            }
            case "catalog-requests", "restock-requests" -> {
                boolean catalog=area.equals("catalog-requests");
                select=catalog?"r.id,r.request_type,r.product_id,r.variant_id,r.requested_data,r.reason,r.status,r.requester_email,r.reviewed_by,r.reviewed_at,r.created_at,r.updated_at":"r.id,r.variant_id,r.current_quantity,r.reorder_level,r.requested_quantity,r.reason,r.note,r.status,r.requested_by,r.reviewed_by,r.created_at,r.reviewed_at,r.fulfilled_at";
                from=(catalog?"CATALOG_CHANGE_REQUESTS":"INVENTORY_RESTOCK_REQUESTS")+" r";where=" WHERE r.store_id=? AND r.reason LIKE ?";defaultSort="r.id";args.add("%"+search+"%");
                if(!status.isBlank()){where+=" AND r.status=?";args.add(status);}
            }
            default -> throw ManagerException.invalid("Danh sách không hợp lệ");
        }
        // No user controlled SQL identifiers. Sorting keys are translated through a fixed whitelist.
        String order=switch(sort){case "name" -> area.equals("products")?"p.name":area.equals("variants")||area.equals("inventory")?"p.name":defaultSort;case "quantity" -> Set.of("products","variants","inventory","orders").contains(area)?"quantity":defaultSort;case "updated_at" -> area.equals("products")?"p.updated_at":area.equals("orders")?"o.updated_at":defaultSort;default -> defaultSort;};
        long total=sql.queryForObject("SELECT COUNT_BIG(*) FROM "+from+where,Long.class,args.toArray());
        args.add(Math.multiplyExact(page,size));args.add(size);
        var rows=sql.queryForList("SELECT "+select+" FROM "+from+where+" ORDER BY "+order+(direction.equalsIgnoreCase("asc")?" ASC":" DESC")+(order.equals(defaultSort)?"":", "+defaultSort+" ASC")+" OFFSET ? ROWS FETCH NEXT ? ROWS ONLY",args.toArray());
        if(area.equals("products")) {
            var ids=rows.stream().map(r->((Number)r.get("id")).intValue()).toList();
            var prices=pricing.calculateEffectivePricesBatch(products.findByIdIn(ids),LocalDateTime.now(),store);
            rows.forEach(r->r.put("effective_price",prices.get(((Number)r.get("id")).intValue())));
        }
        return new PageDto(rows,total,page,size);
    }
    private LocalDateTime parseDate(String value) {try{return java.time.LocalDate.parse(value).atStartOfDay();}catch(Exception ex){throw ManagerException.invalid("Ngày không hợp lệ");}}
    public Map<String,Object> product(int id) {
        int store=context.requireCurrentStore().getId();
        var rows=sql.queryForList("SELECT p.*,b.name AS brand,c.name AS category FROM PRODUCTS p JOIN BRANDS b ON b.id=p.brand_id JOIN CATEGORIES c ON c.id=p.category_id WHERE p.id=?",id);
        if(rows.isEmpty()) throw new ManagerException("NOT_FOUND","Sản phẩm không tồn tại",404);
        var dto=rows.getFirst();dto.put("effective_price",pricing.calculateProductPrice(products.findById(id).orElseThrow(),store,LocalDateTime.now()));
        dto.put("images",sql.queryForList("SELECT id,image_url,alt_text,sort_order,is_primary FROM PRODUCT_IMAGES WHERE product_id=? ORDER BY sort_order,id",id));
        dto.put("variants",sql.queryForList("SELECT v.*,COALESCE(si.quantity,0) AS quantity,si.reorder_level,si.updated_at FROM PRODUCT_VARIANTS v LEFT JOIN STORE_INVENTORY si ON si.variant_id=v.id AND si.store_id=? WHERE v.product_id=? ORDER BY v.id",store,id));
        dto.put("promotions",sql.queryForList("SELECT pr.* FROM PROMOTIONS pr JOIN PRODUCT_PROMOTIONS pp ON pp.promotion_id=pr.id WHERE pp.product_id=?",id));return dto;
    }
    public Map<String,Object> variant(long id) {
        int store=context.requireCurrentStore().getId();
        var rows=sql.queryForList("SELECT v.*,p.name AS product,si.quantity,si.reorder_level,si.updated_at FROM PRODUCT_VARIANTS v JOIN PRODUCTS p ON p.id=v.product_id LEFT JOIN STORE_INVENTORY si ON si.variant_id=v.id AND si.store_id=? WHERE v.id=?",store,id);
        if(rows.isEmpty())throw new ManagerException("NOT_FOUND","Biến thể không tồn tại",404);return rows.getFirst();
    }
    public Map<String,Object> order(long id) {
        int store=context.requireCurrentStore().getId();
        var rows=sql.queryForList("SELECT o.id,o.order_code,o.status,o.fulfillment_mode,CASE WHEN o.status=N'Chờ xác nhận đơn hàng' AND o.payment_method='BANKING' AND COALESCE(p.status,'PENDING')<>'PAID' THEN N'Chờ xác nhận thanh toán' ELSE o.status END AS display_status,o.created_at,o.updated_at,o.recipient_name,o.recipient_phone,o.shipping_address_line,o.shipping_ward,o.shipping_district,o.shipping_city,o.shipping_note,o.payment_method,p.status AS payment_status,COALESCE(f.status,o.status) AS fulfillment_status FROM ORDERS o LEFT JOIN PAYMENTS p ON p.order_id=o.id LEFT JOIN ORDER_STORE_FULFILLMENTS f ON f.order_id=o.id AND f.store_id=? WHERE o.id=? AND EXISTS(SELECT 1 FROM ORDER_ITEMS i WHERE i.order_id=o.id AND i.store_id=?)",store,id,store);
        if(rows.isEmpty())throw new org.springframework.security.access.AccessDeniedException("NOT_AUTHORIZED");
        var dto=rows.getFirst();dto.put("refunds",sql.queryForList("SELECT status,amount,processed_at FROM PAYMENT_REFUNDS WHERE order_id=?",id));dto.put("items",sql.queryForList("SELECT id,product_id,variant_id,product_name,variant_name,image_url,unit_price,discount_amount,quantity,line_total FROM ORDER_ITEMS WHERE order_id=? AND store_id=? ORDER BY id",id,store));
        dto.put("history",sql.queryForList("SELECT status,note,created_at FROM ORDER_STATUS_HISTORY WHERE order_id=? ORDER BY created_at,id",id));
        dto.put("cancellation",sql.queryForList("SELECT reason,other_reason,status,requested_at,responded_at,response_note FROM ORDER_CANCELLATIONS WHERE order_id=?",id));return dto;
    }
}


