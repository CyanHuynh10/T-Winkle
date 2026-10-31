package cyan.project.twinkle.security;

import cyan.project.twinkle.service.OrderService;
import cyan.project.twinkle.manager.ManagerQueryService;
import cyan.project.twinkle.admin.AdminQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.util.*;

@RestController @RequiredArgsConstructor
public class ApiClientController {
    private final ApiTokenService tokens;
    private final OrderService orders;
    private final ManagerQueryService manager;
    private final AdminQueryService admin;
    @PostMapping("/api/tokens")
    public ResponseEntity<?> issue(Authentication auth){return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(tokens.issue(auth));}
    @GetMapping("/api/client/me")
    public Map<String,Object> me(Authentication auth){return Map.of("email",auth.getName(),"authorities",auth.getAuthorities().stream().map(Object::toString).toList());}
    @GetMapping("/api/client/orders")
    public Map<String,Object> orders(Authentication auth,@RequestParam(defaultValue="0") int page){
        if(page<0||page>1000000)throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST);
        var result=orders.getUserOrders(auth.getName(),page);
        var rows=result.getContent().stream().map(o->Map.of("id",o.getId(),"orderCode",o.getOrderCode(),"status",o.getStatus(),"total",o.getTotal())).toList();
        return Map.of("items",rows,"total",result.getTotalElements(),"page",result.getNumber(),"size",result.getSize());
    }
    @GetMapping("/api/client/manager/inventory")
    public Object inventory(@RequestParam(defaultValue="0") int page){return manager.list("inventory",page,30,"","","id","desc","","","","",null,"","","","");}
    @GetMapping("/api/client/admin/stores")
    public Object stores(@RequestParam(defaultValue="0") int page){return admin.list("stores",page,30,"","",null,"id","desc","","","","","","");}
    @DeleteMapping("/api/client/token")
    public ResponseEntity<?> revoke(Authentication auth){tokens.revoke(auth);return ResponseEntity.noContent().build();}
}
