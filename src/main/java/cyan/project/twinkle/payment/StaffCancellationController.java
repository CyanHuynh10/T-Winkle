package cyan.project.twinkle.payment;
import cyan.project.twinkle.service.OrderCancellationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;
@RestController @RequiredArgsConstructor
public class StaffCancellationController {
    private final OrderCancellationService cancellations;
    @PostMapping({"/api/admin/orders/{id}/cancellation","/api/manager/orders/{id}/cancellation"})
    public Map<String,Object> review(@PathVariable long id, Principal actor, @RequestBody OrderCancellationService.Decision input) {
        cancellations.review(id,actor.getName(),input); return Map.of("message","Đã xử lý yêu cầu hủy");
    }
}
