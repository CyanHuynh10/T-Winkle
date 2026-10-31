package cyan.project.twinkle.invoice;

import cyan.project.twinkle.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.math.*;
import java.time.LocalDateTime;
import java.util.*;

/** Invoice values come from checkout snapshots, never today's catalog prices. */
@Service @RequiredArgsConstructor
public class InvoiceDataService {
    private final JdbcTemplate sql;
    public record Seller(String name,String address,String phone) {}
    public record Line(int index,String product,String variant,String store,int quantity,BigDecimal unitPrice,BigDecimal discount,BigDecimal total) {}
    public record Invoice(String number,String orderCode,LocalDateTime orderedAt,LocalDateTime issuedAt,LocalDateTime deliveredAt,
                          String issuerName,String issuerEmail,String customerName,String customerEmail,String customerPhone,
                          String recipientName,String recipientPhone,String address,String note,String fulfillment,String status,
                          String paymentMethod,String paymentStatus,List<Seller> sellers,List<Line> lines,
                          BigDecimal subtotal,BigDecimal productDiscount,BigDecimal couponDiscount,BigDecimal shippingFee,BigDecimal total,String scopeNote) {}
    public Invoice build(Order order,Payment payment,LocalDateTime deliveredAt,LocalDateTime issuedAt,Integer storeId,String issuerEmail) {
        var all=order.getOrderItems().stream().sorted(Comparator.comparing(OrderItem::getId)).toList();
        var items=all.stream().filter(i->storeId==null||storeId.equals(i.getStore().getId())).toList();
        var sellerStores=items.stream().map(OrderItem::getStore).collect(java.util.stream.Collectors.toMap(Store::getId,s->s,(a,b)->a,TreeMap::new));
        var sellers=sellerStores.values().stream().map(s->new Seller(s.getName(),address(s.getAddressLine(),s.getWard(),s.getDistrict(),s.getCity()),value(s.getPhone()))).toList();
        var lines=new ArrayList<Line>();
        for(var i:items)lines.add(new Line(lines.size()+1,i.getProductName(),i.getVariantName(),i.getStore().getName(),i.getQuantity(),i.getUnitPrice().add(i.getDiscountAmount()),i.getDiscountAmount().multiply(BigDecimal.valueOf(i.getQuantity())),i.getLineTotal()));
        var subtotal=storeId==null?order.getSubtotal():items.stream().map(i->i.getUnitPrice().add(i.getDiscountAmount()).multiply(BigDecimal.valueOf(i.getQuantity()))).reduce(BigDecimal.ZERO,BigDecimal::add);
        var discount=storeId==null?order.getProductDiscount():lines.stream().map(Line::discount).reduce(BigDecimal.ZERO,BigDecimal::add);
        var coupon=storeId==null?order.getCouponDiscount():allocation(order.getCouponDiscount(),all,storeId);
        var shipping=storeId==null?order.getShippingFee():allocation(order.getShippingFee(),all,storeId);
        var total=storeId==null?order.getTotal():subtotal.subtract(discount).subtract(coupon).add(shipping);
        String issuerName="T-Winkle (hệ thống)";
        if(issuerEmail!=null){var names=sql.queryForList("SELECT COALESCE(NULLIF(full_name,''),username) FROM USERS WHERE email=?",String.class,issuerEmail);issuerName=names.isEmpty()?issuerEmail:names.getFirst();}
        var user=order.getUser();
        return new Invoice("HD-"+order.getOrderCode()+(storeId==null?"":"-CH"+storeId),order.getOrderCode(),order.getCreatedAt(),issuedAt,deliveredAt,
            issuerName,issuerEmail==null?"":issuerEmail,value(user.getFullName()).isBlank()?user.getUsername():user.getFullName(),user.getEmail(),value(user.getPhone()),
            order.getRecipientName(),order.getRecipientPhone(),address(order.getShippingAddressLine(),order.getShippingWard(),order.getShippingDistrict(),order.getShippingCity()),value(order.getShippingNote()),order.getFulfillmentLabel(),storeId==null?order.getStatus():"Đã giao",
            method(payment.getMethod()),paymentStatus(payment.getStatus()),sellers,List.copyOf(lines),subtotal,discount,coupon,shipping,total,
            storeId!=null&&all.stream().map(i->i.getStore().getId()).distinct().count()>1?"Hóa đơn phần hàng của cửa hàng này. Coupon và phí vận chuyển được phân bổ theo giá trị hàng sau giảm giá trong đơn.":"");
    }
    // Round every store except the last down to cents; the last receives the remainder.
    // This preserves the order totals exactly, including a completely discounted order.
    private BigDecimal allocation(BigDecimal amount,List<OrderItem> items,int target) {
        var weights=new TreeMap<Integer,BigDecimal>();
        items.forEach(i->weights.merge(i.getStore().getId(),i.getLineTotal(),BigDecimal::add));
        if(weights.values().stream().allMatch(v->v.signum()==0)){weights.clear();items.forEach(i->weights.merge(i.getStore().getId(),BigDecimal.valueOf(i.getQuantity()),BigDecimal::add));}
        var denominator=weights.values().stream().reduce(BigDecimal.ZERO,BigDecimal::add);
        BigDecimal remaining=amount;
        for(var e:weights.entrySet()){
            var part=e.getKey().equals(weights.lastKey())?remaining:amount.multiply(e.getValue()).divide(denominator,2,RoundingMode.DOWN);
            remaining=remaining.subtract(part);if(e.getKey()==target)return part;
        }
        return BigDecimal.ZERO;
    }
    public static String method(String method){return switch(method){case "COD"->"Thanh toán khi nhận hàng";case "BANKING"->"Chuyển khoản ngân hàng";default->method;};}
    public static String paymentStatus(String status){return switch(status){case "PAID"->"Đã thanh toán";case "FAILED"->"Thanh toán thất bại";case "REFUNDED"->"Đã hoàn tiền";default->"Chờ xác nhận thanh toán";};}
    private static String value(String v){return v==null?"":v;}
    private static String address(String... parts){return String.join(", ",Arrays.stream(parts).filter(v->v!=null&&!v.isBlank()).toList());}
}
