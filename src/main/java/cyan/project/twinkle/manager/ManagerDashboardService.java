package cyan.project.twinkle.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service @RequiredArgsConstructor
public class ManagerDashboardService {
    private final JdbcTemplate sql;
    private final ManagerStoreContextService context;
    private final Clock managerClock;
    public record Window(LocalDateTime start,LocalDateTime end,String grouping) {}
    public static Window window(String range,LocalDate today) {
        return switch(range) {
            case "DAY" -> new Window(today.atStartOfDay(),today.plusDays(1).atStartOfDay(),"DATEPART(hour,o.created_at)");
            case "WEEK" -> {var start=today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));yield new Window(start.atStartOfDay(),start.plusWeeks(1).atStartOfDay(),"CONVERT(varchar(10),o.created_at,23)");}
            case "MONTH" -> {var start=today.withDayOfMonth(1);yield new Window(start.atStartOfDay(),start.plusMonths(1).atStartOfDay(),"CONVERT(varchar(10),o.created_at,23)");}
            case "YEAR" -> {var start=today.withDayOfYear(1);yield new Window(start.atStartOfDay(),start.plusYears(1).atStartOfDay(),"DATEPART(month,o.created_at)");}
            default -> throw ManagerException.invalid("Khoảng thời gian không hợp lệ");
        };
    }
    @Transactional(readOnly=true)
    public Map<String,Object> dashboard(String range) {return dashboard(new DashboardPeriod(range,null,null,null,null,null));}
    @Transactional(readOnly=true) public Map<String,Object> dashboard(DashboardPeriod period) {
        String range=period.mode();int store=context.requireCurrentStore().getId();var w=period.window(managerClock);
        var result=new LinkedHashMap<String,Object>();result.put("range",range);result.put("start",w.start());result.put("end",w.end());
        String source=" FROM ORDER_ITEMS i JOIN ORDERS o ON o.id=i.order_id JOIN PRODUCT_VARIANTS v ON v.id=i.variant_id LEFT JOIN ORDER_STORE_FULFILLMENTS f ON f.order_id=o.id AND f.store_id=i.store_id WHERE i.store_id=? AND o.created_at>=? AND o.created_at<?";
        Object[] args={store,w.start(),w.end()};
        String delivered="COALESCE(f.status,o.status)=N'Đã giao'";
        var kpi=sql.queryForMap("SELECT COUNT(DISTINCT o.id) AS orders,COUNT(DISTINCT CASE WHEN "+delivered+" THEN o.id END) AS delivered_orders,COALESCE(SUM(CASE WHEN "+delivered+" THEN i.line_total ELSE 0 END),0) AS revenue,COALESCE(SUM(CASE WHEN "+delivered+" THEN i.quantity ELSE 0 END),0) AS items_sold,COUNT(DISTINCT CASE WHEN COALESCE(f.status,o.status)=N'Chờ xác nhận đơn hàng' THEN o.id END) AS pending_orders,COUNT(DISTINCT CASE WHEN COALESCE(f.status,o.status)=N'Đã hủy' THEN o.id END) AS cancelled_orders"+source,args);
        var revenue=(java.math.BigDecimal)kpi.get("revenue");long deliveredOrders=((Number)kpi.get("delivered_orders")).longValue();
        kpi.put("average_order_value",deliveredOrders==0?java.math.BigDecimal.ZERO:revenue.divide(java.math.BigDecimal.valueOf(deliveredOrders),2,java.math.RoundingMode.HALF_UP));
        long orders=((Number)kpi.get("orders")).longValue();kpi.put("cancellation_rate",orders==0?0.0:((Number)kpi.get("cancelled_orders")).doubleValue()/orders);
        kpi.put("demo_units_period_ending",sql.queryForObject("SELECT COALESCE(SUM(CONVERT(bigint,quantity_sold)),0) FROM DEMO_VARIANT_SALES WHERE is_demo=1 AND store_id=? AND period_end>=? AND period_end<?",Long.class,store,w.start(),w.end()));
        result.put("kpi",kpi);
        result.put("trend",sql.queryForList("SELECT "+w.grouping()+" AS label,COALESCE(SUM(CASE WHEN "+delivered+" THEN i.line_total ELSE 0 END),0) AS value,COUNT(DISTINCT o.id) AS orders,COUNT(DISTINCT CASE WHEN COALESCE(f.status,o.status)=N'Đã hủy' THEN o.id END) AS cancelled"+source+" GROUP BY "+w.grouping()+" ORDER BY "+w.grouping(),args));
        result.put("order_status",sql.queryForList("SELECT COALESCE(f.status,o.status) AS label,COUNT(DISTINCT o.id) AS value"+source+" GROUP BY COALESCE(f.status,o.status)",args));
        result.put("payments",sql.queryForList("SELECT o.payment_method AS label,COUNT(DISTINCT o.id) AS value"+source+" GROUP BY o.payment_method",args));
        for(String dimension:List.of("products","sizes","colors")) {
            String key=switch(dimension){case "products"->"i.product_id";case "sizes"->"v.size";default->"v.color";};
            String label=dimension.equals("products")?"MAX(i.product_name)":key;
            result.put("top_"+dimension,sql.queryForList("SELECT TOP(8) "+label+" AS label,SUM(i.quantity) AS value,SUM(i.line_total) AS revenue"+source+" AND "+delivered+" GROUP BY "+key+" ORDER BY SUM(i.quantity) DESC,"+key,args));
        }
        result.put("inventory",sql.queryForList("SELECT CASE WHEN quantity=0 THEN 'OUT' WHEN quantity<=reorder_level THEN 'LOW' ELSE 'AVAILABLE' END AS label,COUNT(*) AS value FROM STORE_INVENTORY WHERE store_id=? GROUP BY CASE WHEN quantity=0 THEN 'OUT' WHEN quantity<=reorder_level THEN 'LOW' ELSE 'AVAILABLE' END",store));
        result.put("low_stock",sql.queryForList("SELECT TOP(8) v.sku AS label,si.quantity AS value FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id WHERE si.store_id=? AND si.quantity>0 AND si.quantity<=si.reorder_level ORDER BY si.quantity,v.id",store));
        result.put("restock",sql.queryForList("SELECT status AS label,COUNT(*) AS value FROM INVENTORY_RESTOCK_REQUESTS WHERE store_id=? GROUP BY status",store));
        result.put("support",sql.queryForMap("SELECT COUNT(*) AS conversations,COALESCE(SUM(CASE WHEN c.status='OPEN' THEN 1 ELSE 0 END),0) AS open_conversations,COALESCE(SUM(CASE WHEN c.created_at>=? AND c.created_at<? THEN 1 ELSE 0 END),0) AS new_conversations,(SELECT COUNT(*) FROM SUPPORT_MESSAGES m JOIN SUPPORT_CONVERSATIONS sc ON sc.id=m.conversation_id WHERE sc.store_id=? AND m.created_at>=? AND m.created_at<?) AS messages,(SELECT COUNT(*) FROM SUPPORT_CONVERSATIONS sc WHERE sc.store_id=? AND EXISTS(SELECT 1 FROM SUPPORT_MESSAGES m WHERE m.conversation_id=sc.id AND m.sender_type='USER' AND m.id>COALESCE((SELECT rs.last_read_message_id FROM SUPPORT_CONVERSATION_READ_STATE rs WHERE rs.conversation_id=sc.id AND rs.user_email=?),0))) AS unread_conversations FROM SUPPORT_CONVERSATIONS c WHERE c.store_id=?",w.start(),w.end(),store,w.start(),w.end(),store,context.actor(),store));
        return result;
    }
}
