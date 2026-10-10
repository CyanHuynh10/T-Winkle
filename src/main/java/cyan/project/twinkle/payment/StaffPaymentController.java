package cyan.project.twinkle.payment;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import cyan.project.twinkle.admin.AdminRequestService.Review;
import java.security.Principal;
import java.util.Map;
@RestController @RequiredArgsConstructor
public class StaffPaymentController {
 private final PaymentQueryService queries;private final PaymentVerificationService verification;
 @GetMapping({"/api/admin/payments","/api/manager/payments"})
 public PaymentQueryService.Page list(jakarta.servlet.http.HttpServletRequest request,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="30") int size,@RequestParam(defaultValue="") String search,@RequestParam(defaultValue="") String status,@RequestParam(required=false) Integer storeId,@RequestParam(defaultValue="") String method,@RequestParam(defaultValue="") String verificationStatus,@RequestParam(defaultValue="") String fromDate,@RequestParam(defaultValue="") String toDate){return queries.list(request.getRequestURI().startsWith("/api/admin/"),page,size,search,status,storeId,method,verificationStatus,fromDate,toDate);}
 @PostMapping({"/api/admin/payments/{id}/review","/api/manager/payments/{id}/review"})
 public Map<String,Object> review(@PathVariable long id,@jakarta.validation.Valid @RequestBody Review input,Principal actor){verification.review(id,actor.getName(),input.approve(),input.note());return Map.of("message","Đã xác minh giao dịch");}
}

