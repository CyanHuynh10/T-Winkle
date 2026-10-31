package cyan.project.twinkle.service;

import cyan.project.twinkle.admin.*;
import cyan.project.twinkle.manager.*;
import cyan.project.twinkle.payment.PaymentQueryService;
import cyan.project.twinkle.review.StaffReviewService;
import cyan.project.twinkle.report.ReportService;
import cyan.project.twinkle.chat.support.SupportChatService;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.json.JsonMapper;
import java.util.*;

/** Read-only view adapter; delegates authorization, pagination and pricing to existing services. */
@Service
public class ConsoleViewService {
    private final AdminQueryService admin;
    private final ManagerQueryService manager;
    private final AdminDashboardService adminDashboard;
    private final ManagerDashboardService managerDashboard;
    private final PaymentQueryService payments;
    private final StaffReviewService reviews;
    private final ReportService reports;
    private final SupportChatService chat;
    private final Map<String,Object> metadata;
    public ConsoleViewService(AdminQueryService admin,ManagerQueryService manager,AdminDashboardService adminDashboard,
            ManagerDashboardService managerDashboard,PaymentQueryService payments,StaffReviewService reviews,ReportService reports,SupportChatService chat) throws java.io.IOException {
        this.admin=admin;this.manager=manager;this.adminDashboard=adminDashboard;this.managerDashboard=managerDashboard;
        this.payments=payments;this.reviews=reviews;this.reports=reports;this.chat=chat;
        try(var stream=new ClassPathResource("static/js/console/metadata.json").getInputStream()){
            metadata=JsonMapper.builder().build().readValue(stream,Map.class);
        }
    }
    public Map<String,Object> labels(){return (Map<String,Object>)metadata.get("labels");}
    public List<String> columns(String role,String page){
        if(page.equals("reviews"))return List.of("product","store","customer","rating","comment","response","responder","created_at");
        if(page.equals("payments"))return List.of("order_code","amount","method","status","refund_status","verification_status","reported_at","reviewed_by");
        if(page.equals("reports"))return List.of("store","manager","report_type","file_name","row_count","sent_at");
        return (List<String>)((Map<String,Object>)metadata.get(role.equals("admin")?"adminColumns":"managerColumns")).get(page.equals("history")?"audit":page);
    }
    @Transactional(readOnly=true)
    public Object initial(String role,String page,Authentication authentication){
        if(page.equals("support")||role.equals("support")&&!page.equals("reviews"))return chat.staffInbox(authentication,0,30);
        if(page.equals("reviews"))return reviews.list(authentication,0,"",null,"",null);
        if(page.isEmpty())return role.equals("admin")?adminDashboard.dashboard("MONTH",null):managerDashboard.dashboard("MONTH");
        if(page.equals("payments"))return payments.list(role.equals("admin"),0,30,"","",null,"","","","");
        if(page.equals("reports"))return reports.list(0,"",null);
        if(columns(role,page)==null)return null;
        if(role.equals("admin"))return admin.list(page.equals("history")?"audit":page,0,30,"","",null,"id","desc","","","","","","");
        return manager.list(page,0,30,"","","id","desc","","","","",null,"","","","");
    }
    public StockPresentation stock(Map<String,Object> row,String role,String page){
        boolean tracked=!role.equals("manager") || !page.equals("variants") || row.get("inventory_store_id")!=null;
        return StockPresentation.of(row.get("quantity") instanceof Number n?n:null,tracked);
    }
    public String cellClass(String key){
        if(key.matches(".*(email|customer|requester|requested_by|reviewed_by|performed_by|actor|responder).*"))return "tw-cell-email";
        if(Set.of("name","product","store","stores","assigned_store","brand","category","full_name").contains(key))return "tw-cell-name";
        if(Set.of("comment","response","reason","note","summary","review_note","filter_snapshot","requested_data","file_name").contains(key))return "tw-cell-text";
        if(key.matches(".*(price|amount|total|quantity|count|level|limit|priority|adjustment|delta).*"))return "tw-cell-number";
        return "tw-cell-nowrap";
    }
    public String display(String key,Object value){
        if(value==null)return "—";
        if(value instanceof Boolean b)return b?"Hoạt động":"Ngừng";
        if(key.equals("replenishment_state"))return value.toString().equals("AVAILABLE")?"Đủ ngưỡng nhập":"Cần nhập hàng";
        if(key.endsWith("_at")){try{return java.time.LocalDateTime.parse(value.toString()).format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));}catch(java.time.format.DateTimeParseException ignored){}}
        if(key.equals("roles"))return value.toString().replace("ROLE_ADMIN","Admin").replace("ROLE_MANAGER","Manager").replace("ROLE_SUPPORT","Support").replace("ROLE_USER","User");
        if(key.equals("refund_status"))return Map.of("COMPLETED","Hoàn tiền","PENDING","Chờ hoàn tiền","FAILED","Hoàn tiền thất bại").getOrDefault(value.toString(),value.toString());
        return ((Map<String,String>)metadata.get("states")).getOrDefault(value.toString(),value.toString());
    }
}
