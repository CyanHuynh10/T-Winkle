package cyan.project.twinkle.review;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;
import java.util.Map;
@RestController @RequiredArgsConstructor
@RequestMapping({"/api/manager/reviews","/api/admin/reviews","/api/support/reviews"})
public class StaffReviewController {
 private final StaffReviewService reviews;
 @GetMapping public StaffReviewService.Page list(Authentication auth,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="") String search,@RequestParam(required=false) Integer rating,@RequestParam(defaultValue="") String replied,@RequestParam(required=false) Integer storeId){return reviews.list(auth,page,search,rating,replied,storeId);}
 public record Reply(@jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(max=2000) String content){}
 @PostMapping("/{id}/reply") public Map<String,Object> reply(@PathVariable long id,@Valid @RequestBody Reply input,Authentication auth){reviews.reply(id,input.content(),auth);return Map.of("message","Đã lưu phản hồi");}
 @PostMapping("/{id}/delete") public Map<String,Object> delete(@PathVariable long id,Authentication auth){reviews.delete(id,auth);return Map.of("message","Đã xóa đánh giá");}
}
