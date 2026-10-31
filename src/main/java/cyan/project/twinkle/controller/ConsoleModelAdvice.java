package cyan.project.twinkle.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.ui.Model;
import java.util.LinkedHashMap;

/** Shared server-rendered navigation. SecurityFilterChain guards each role's routes. */
@ControllerAdvice(assignableTypes={AdminController.class, ManagerController.class, SupportController.class})
public class ConsoleModelAdvice {
    private final cyan.project.twinkle.service.ConsoleViewService views;
    private final cyan.project.twinkle.service.ConsoleReturnService returns;
    public ConsoleModelAdvice(cyan.project.twinkle.service.ConsoleViewService views,cyan.project.twinkle.service.ConsoleReturnService returns){this.views=views;this.returns=returns;}
    @ModelAttribute
    public void console(HttpServletRequest request, Model model,org.springframework.security.core.Authentication authentication) {
        String[] parts=request.getRequestURI().substring(request.getContextPath().length()).split("/");
        String role=parts.length>1?parts[1]:"", page=parts.length>2?parts[2]:"";
        if(page.equals("dashboard"))page="";
        var menu=new LinkedHashMap<String,String>();
        if(!role.equals("support"))menu.put("","Dashboard");
        if(role.equals("admin")){menu.put("users","Người dùng");menu.put("stores","Cửa hàng");menu.put("categories","Danh mục");menu.put("brands","Thương hiệu");}
        if(!role.equals("support")){menu.put("products","Sản phẩm");menu.put("variants","Biến thể sản phẩm");menu.put("inventory","Kho hàng");menu.put("orders","Đơn hàng");menu.put("payments","Giao dịch");}
        if(role.equals("admin")){menu.put("promotions","Khuyến mãi");menu.put("coupons","Coupon");}
        menu.put(role.equals("support")?"":"support","Hội thoại");menu.put("reviews","Đánh giá");
        if(role.equals("admin")){menu.put("reports","Báo cáo");menu.put("history","Lịch sử Admin");}
        if(role.equals("manager"))menu.put("store-profile","Hồ sơ cửa hàng");
        model.addAttribute("consoleRole",role);model.addAttribute("consolePage",page);
        model.addAttribute("consoleTitle",menu.getOrDefault(page,"Hội thoại"));model.addAttribute("consoleMenu",menu.entrySet());
        model.addAttribute("consoleEmail",request.getUserPrincipal()==null?"":request.getUserPrincipal().getName());
        if(request.getMethod().equals("GET")){
            returns.remember(request.getSession(),request.getRequestURI().substring(request.getContextPath().length()).replaceAll("/$", ""),authentication);
            try{
                Object initial=views.initial(role,page,authentication);
                var mapper=tools.jackson.databind.json.JsonMapper.builder().build();
                model.addAttribute("consoleInitial",initial==null?null:mapper.convertValue(initial,java.util.Map.class));
                model.addAttribute("consoleInitialJson",mapper.writeValueAsString(initial));
                model.addAttribute("consoleColumns",views.columns(role,page));model.addAttribute("consoleLabels",views.labels());
            }catch(org.springframework.security.access.AccessDeniedException ex){throw ex;}
            catch(RuntimeException ex){org.slf4j.LoggerFactory.getLogger(ConsoleModelAdvice.class).warn("Console view failed for role {} page {}",role,page,ex);model.addAttribute("consoleError","Chưa thể tải dữ liệu. Vui lòng thử lại hoặc kiểm tra phân công cửa hàng.");}
        }
        model.addAttribute("chatMode","staff");
        if(parts.length>3 && parts[3].matches("\\d+"))model.addAttribute("conversationId",Long.parseLong(parts[3]));
    }
}
