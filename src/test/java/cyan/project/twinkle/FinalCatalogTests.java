package cyan.project.twinkle;

import cyan.project.twinkle.admin.AdminDashboardService;
import cyan.project.twinkle.manager.DashboardPeriod;
import cyan.project.twinkle.manager.ManagerDashboardService;
import cyan.project.twinkle.report.ReportService;
import cyan.project.twinkle.repository.OrderItemRepository;
import cyan.project.twinkle.service.DemoSalesService;
import cyan.project.twinkle.service.StorefrontProductService;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import java.io.ByteArrayInputStream;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class FinalCatalogTests {
    @Autowired JdbcTemplate sql;
    @Autowired DemoSalesService demo;
    @Autowired StorefrontProductService products;
    @Autowired OrderItemRepository orders;
    @Autowired AdminDashboardService admin;
    @Autowired ManagerDashboardService manager;
    @Autowired ReportService reports;
    @Autowired cyan.project.twinkle.chat.ai.AiReadOnlyTools ai;

    void auth(String email, String role) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                email, "", List.of(new SimpleGrantedAuthority("ROLE_" + role))));
    }
    String administrator() {
        return sql.queryForObject("SELECT TOP(1) u.email FROM USERS u JOIN USER_ROLES ur ON ur.user_email=u.email JOIN ROLES r ON r.id=ur.role_id WHERE r.name='ROLE_ADMIN' AND u.is_enabled=1 ORDER BY u.email", String.class);
    }
    @AfterEach void clear() { SecurityContextHolder.clearContext(); }

    @Test void simulatedUnitsStaySeparateFromDeliveredSalesAndFinancialMetrics() {
        int product = sql.queryForObject("SELECT MIN(product_id) FROM CATALOG_PRODUCT_PROVENANCE", Integer.class);
        long variant = sql.queryForObject("SELECT MIN(id) FROM PRODUCT_VARIANTS WHERE product_id=?", Long.class, product);
        long realBefore = orders.getSoldCountForProduct(product, "Đã giao");
        long demoBefore = demo.products(List.of(product)).get(product);
        var period = new DashboardPeriod("YEAR", null, null, null, null, 2026);
        auth(administrator(), "ADMIN");
        var before = (Map<?, ?>) admin.dashboard(period, null).get("kpi");
        sql.update("UPDATE DEMO_VARIANT_SALES SET quantity_sold=quantity_sold+123 WHERE variant_id=?", variant);
        long increment = 123L * sql.queryForObject("SELECT COUNT(*) FROM DEMO_VARIANT_SALES WHERE variant_id=?", Integer.class, variant);
        assertEquals(realBefore, orders.getSoldCountForProduct(product, "Đã giao"));
        assertEquals(demoBefore + increment, demo.products(List.of(product)).get(product));
        var detail = products.getProductDetailDTO(product, null);
        assertEquals(realBefore, detail.getSoldCount());
        assertEquals(demoBefore + increment, detail.getDemoSoldCount());
        assertEquals(detail.getDemoSoldCount().longValue(), detail.getVariants().stream().mapToLong(v -> v.getDemoSoldCount()).sum());
        var after = (Map<?, ?>) admin.dashboard(period, null).get("kpi");
        for (String key : List.of("orders", "delivered_orders", "revenue", "items_sold", "average_order_value"))
            assertEquals(before.get(key), after.get(key), key);
        assertEquals(((Number) before.get("demo_units_period_ending")).longValue() + increment,
                ((Number) after.get("demo_units_period_ending")).longValue());
    }

    @Test void managerDemoUnitsAreStoreScopedAndDashboardExportUsesTheSameLabelAndValue() throws Exception {
        var store = sql.queryForMap("SELECT TOP(1) s.store_id,s.manager_email FROM STORES s JOIN USERS u ON u.email=s.manager_email WHERE u.is_enabled=1 ORDER BY s.store_id");
        int id = ((Number) store.get("store_id")).intValue();
        auth((String) store.get("manager_email"), "MANAGER");
        var period = new DashboardPeriod("YEAR", null, null, null, null, 2026);
        long expected = sql.queryForObject("SELECT SUM(CONVERT(bigint,quantity_sold)) FROM DEMO_VARIANT_SALES WHERE store_id=? AND period_end>='2026-01-01' AND period_end<'2027-01-01'", Long.class, id);
        var kpi = (Map<?, ?>) manager.dashboard(period).get("kpi");
        assertEquals(expected, ((Number) kpi.get("demo_units_period_ending")).longValue());
        var prepared = reports.prepare(new ReportService.Prepare("DASHBOARD", Map.of("mode", "YEAR", "year", "2026"), List.of()));
        var file = reports.download(((Number) prepared.get("id")).longValue(), false);
        try (var workbook = new XSSFWorkbook(new ByteArrayInputStream(file.data()))) {
            boolean found = false;
            for (var row : workbook.getSheetAt(0)) {
                if (row.getCell(0) != null && row.getCell(0).toString().equals("Lượt bán mô phỏng (kỳ kết thúc trong bộ lọc)")) {
                    assertEquals(expected, (long) row.getCell(1).getNumericCellValue());
                    found = true;
                }
            }
            assertTrue(found, "Export must explicitly label simulated quantities");
        }
        assertEquals(0, ((Number)((Map<?, ?>)manager.dashboard(new DashboardPeriod("MONTH",null,null,null,"2026-08",null)).get("kpi")).get("demo_units_period_ending")).longValue());
    }

    @Test void catalogUsesFixedColorwaysAndSparseStoreAssortments() {
        assertEquals(0, sql.queryForObject("SELECT COUNT(*) FROM PRODUCT_VARIANTS v JOIN CATALOG_PRODUCT_PROVENANCE p ON p.product_id=v.product_id WHERE v.color<>p.dominant_color", Integer.class));
        assertEquals(0, sql.queryForObject("SELECT COUNT(*) FROM (SELECT product_id,size FROM PRODUCT_VARIANTS GROUP BY product_id,size HAVING COUNT(*)>1) d", Integer.class));
        assertTrue(sql.queryForObject("SELECT COUNT(*) FROM STORE_INVENTORY", Integer.class)
                < 6 * sql.queryForObject("SELECT COUNT(*) FROM PRODUCT_VARIANTS", Integer.class));
        assertTrue(sql.queryForObject("SELECT COUNT(*) FROM STORE_INVENTORY WHERE quantity=0", Integer.class)>0);
        assertEquals(0, sql.queryForObject("SELECT COUNT(*) FROM PRODUCT_VARIANTS v WHERE NOT EXISTS(SELECT 1 FROM DEMO_VARIANT_SALES d WHERE d.variant_id=v.id)", Integer.class));
    }

    @Test void aiToolsReadTheNewCatalogAndNeverInventMissingStoreInventory() {
        int product=sql.queryForObject("SELECT MIN(product_id) FROM CATALOG_PRODUCT_PROVENANCE",Integer.class);
        var context=new cyan.project.twinkle.chat.ai.AiShoppingContext();
        String arguments="{\"productId\":"+product+"}";
        long before=sql.queryForObject("SELECT COUNT_BIG(*) FROM ORDERS",Long.class);
        var details=(Map<?,?>)ai.execute(new cyan.project.twinkle.chat.ai.AiChatProvider.ToolCall("catalog","get_product_details",arguments),null,context);
        assertEquals(sql.queryForObject("SELECT name FROM PRODUCTS WHERE id=?",String.class,product),details.get("name"));
        var inventory=(List<Map<String,Object>>)ai.execute(new cyan.project.twinkle.chat.ai.AiChatProvider.ToolCall("stock","get_store_inventory",arguments),null,context);
        assertEquals(sql.queryForObject("SELECT COUNT(*) FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id WHERE v.product_id=?",Integer.class,product),inventory.size());
        for(var row:inventory) assertEquals(1,sql.queryForObject("SELECT COUNT(*) FROM STORE_INVENTORY WHERE variant_id=? AND store_id=?",Integer.class,row.get("variantId"),row.get("store_id")));
        var sales=(Map<?,?>)ai.execute(new cyan.project.twinkle.chat.ai.AiChatProvider.ToolCall("sales","get_sales_summary",arguments),null,context);
        assertEquals(orders.getSoldCountForProduct(product,"Đã giao"),sales.get("deliveredQuantity"));
        assertEquals(demo.products(List.of(product)).get(product),sales.get("demoQuantity"));
        assertTrue(sales.get("demoLabel").toString().contains("mô phỏng"));
        assertEquals(before,sql.queryForObject("SELECT COUNT_BIG(*) FROM ORDERS",Long.class));
    }
}
