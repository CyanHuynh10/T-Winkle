package cyan.project.twinkle.manager;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/manager") @RequiredArgsConstructor
public class ManagerApiController {
    private final ManagerOperationsService operations;
    private final ManagerQueryService queries;
    private final ManagerDashboardService dashboard;
    private final StoreFulfillmentService fulfillment;
    @GetMapping("/catalog-options") public java.util.List<Map<String,Object>> options(@RequestParam String kind,@RequestParam(defaultValue="") String search){return queries.options(kind,search);}
    @GetMapping({"/context","/store"}) public Map<String,Object> store(){return operations.store();}
    @PostMapping("/store") public Map<String,Object> profile(@Valid @RequestBody ManagerOperationsService.StoreProfile input){operations.profile(input);return Map.of("message","Đã cập nhật hồ sơ cửa hàng");}
    @PostMapping("/store/status") public Map<String,Object> status(@Valid @RequestBody ManagerOperationsService.StatusChange input){operations.status(input);return Map.of("message","Đã cập nhật trạng thái hoạt động");}
 @GetMapping("/dashboard") public Map<String,Object> dashboard(@RequestParam(defaultValue="MONTH") String range,@RequestParam(required=false) String mode,@RequestParam(required=false) String date,@RequestParam(required=false) String from,@RequestParam(required=false) String to,@RequestParam(required=false) String month,@RequestParam(required=false) Integer year){return dashboard.dashboard(new DashboardPeriod(mode==null?range:mode,date,from,to,month,year));}
    @GetMapping({"/products","/variants","/inventory","/orders","/catalog-requests","/restock-requests"})
    public ManagerQueryService.PageDto list(jakarta.servlet.http.HttpServletRequest request,
        @RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="30") int size,
        @RequestParam(defaultValue="") String search,@RequestParam(defaultValue="") String status,
        @RequestParam(defaultValue="id") String sort,@RequestParam(defaultValue="desc") String direction,
        @RequestParam(defaultValue="") String brand,@RequestParam(defaultValue="") String category,
        @RequestParam(defaultValue="") String sizeFilter,@RequestParam(defaultValue="") String color,
        @RequestParam(required=false) Boolean pending,@RequestParam(defaultValue="") String method,
        @RequestParam(defaultValue="") String paymentStatus,@RequestParam(defaultValue="") String fromDate,@RequestParam(defaultValue="") String toDate) {
        String area=request.getRequestURI().substring(request.getRequestURI().lastIndexOf('/')+1);
        return queries.list(area,page,size,search,status,sort,direction,brand,category,sizeFilter,color,pending,method,paymentStatus,fromDate,toDate);
    }
    @GetMapping("/products/{id}") public Map<String,Object> product(@PathVariable int id){return queries.product(id);}
    @GetMapping("/variants/{id}") public Map<String,Object> variant(@PathVariable long id){return queries.variant(id);}
    @GetMapping("/orders/{id}") public Map<String,Object> order(@PathVariable long id){return queries.order(id);}
    public record OrderTransition(@jakarta.validation.constraints.NotBlank String status){}
    @PostMapping("/orders/{id}/status") public Map<String,Object> transition(@PathVariable long id,@Valid @RequestBody OrderTransition input){fulfillment.transition(id,input.status());return Map.of("message","Đã cập nhật giao hàng tại cửa hàng");}
    @PostMapping("/catalog-requests") public Map<String,Object> catalog(@Valid @RequestBody ManagerOperationsService.CatalogRequest input){return Map.of("id",operations.catalog(input),"message","Đã gửi yêu cầu danh mục");}
    @PostMapping("/restock-requests") public Map<String,Object> restock(@Valid @RequestBody ManagerOperationsService.RestockRequest input){return Map.of("id",operations.restock(input),"message","Đã gửi yêu cầu nhập hàng");}
}
