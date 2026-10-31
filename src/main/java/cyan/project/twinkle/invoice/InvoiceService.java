package cyan.project.twinkle.invoice;

import cyan.project.twinkle.manager.ManagerStoreContextService;
import cyan.project.twinkle.repository.*;
import cyan.project.twinkle.report.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.util.*;

@Service @RequiredArgsConstructor
public class InvoiceService {
    private final JdbcTemplate sql;
    private final ManagerStoreContextService manager;
    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final InvoiceDataService data;
    private final InvoicePdfRenderer renderer;
    private final ReportService reports;
    private final Clock managerClock;
    public record Prepare(String orderCode) {}
    @Transactional(isolation=org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public Map<String,Object> prepare(Prepare input) {
        var store=manager.requireCurrentStore();String actor=manager.actor();
        if(input==null||input.orderCode()==null||input.orderCode().isBlank()||input.orderCode().length()>50)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Vui lòng nhập mã đơn hàng hợp lệ");
        String code=input.orderCode().trim();
        var found=sql.queryForList("SELECT o.id,COALESCE(f.status,o.status) AS status,f.delivered_at FROM ORDERS o LEFT JOIN ORDER_STORE_FULFILLMENTS f ON f.order_id=o.id AND f.store_id=? WHERE o.order_code=? AND EXISTS(SELECT 1 FROM ORDER_ITEMS i WHERE i.order_id=o.id AND i.store_id=?)",store.getId(),code,store.getId());
        if(found.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy đơn hàng thuộc cửa hàng bạn quản lý");
        var row=found.getFirst();
        if(!"Đã giao".equals(row.get("status")))throw new ResponseStatusException(HttpStatus.CONFLICT,"Chỉ xuất hóa đơn khi phần hàng của cửa hàng đã giao");
        long id=((Number)row.get("id")).longValue();var order=orders.findById(id).orElseThrow();
        var payment=payments.findByOrderId(id).orElseThrow(()->new ResponseStatusException(HttpStatus.CONFLICT,"Đơn hàng chưa có thông tin thanh toán"));
        LocalDateTime delivered=row.get("delivered_at") instanceof java.sql.Timestamp t?t.toLocalDateTime():sql.queryForList("SELECT TOP(1) created_at FROM ORDER_STATUS_HISTORY WHERE order_id=? AND status=N'Đã giao' ORDER BY id DESC",java.sql.Timestamp.class,id).stream().findFirst().map(java.sql.Timestamp::toLocalDateTime).orElse(null);
        var invoice=data.build(order,payment,delivered,LocalDateTime.now(managerClock),store.getId(),actor);
        var bytes=renderer.render(invoice);
        // ORDERS is the existing report category; MIME identifies a PDF invoice, no schema change.
        return reports.storeInvoice("T-Winkle_Hoa-don_"+id+"_CH"+store.getId()+".pdf",bytes,"Mã đơn: "+code,invoice.lines().size());
    }
}
