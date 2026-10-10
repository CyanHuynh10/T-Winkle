package cyan.project.twinkle.report;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ResponseStatusException;
import cyan.project.twinkle.manager.ManagerException;
import java.util.Map;
@RestControllerAdvice(assignableTypes={ReportController.class,cyan.project.twinkle.review.StaffReviewController.class})
public class FinalFeatureAdvice {
 @ExceptionHandler(AccessDeniedException.class) ResponseEntity<?> denied(){return ResponseEntity.status(403).body(Map.of("message","Bạn không có quyền thực hiện thao tác này"));}
 @ExceptionHandler(ManagerException.class) ResponseEntity<?> manager(ManagerException e){return ResponseEntity.status(e.status).body(Map.of("message",e.getMessage()));}
 @ExceptionHandler(ResponseStatusException.class) ResponseEntity<?> response(ResponseStatusException e){return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason()==null?"Thông tin không hợp lệ":e.getReason()));}
 @ExceptionHandler({IllegalArgumentException.class,org.springframework.web.bind.MethodArgumentNotValidException.class,org.springframework.http.converter.HttpMessageNotReadableException.class,org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class}) ResponseEntity<?> invalid(){return ResponseEntity.badRequest().body(Map.of("message","Thông tin không hợp lệ"));}
 @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class) ResponseEntity<?> conflict(){return ResponseEntity.status(409).body(Map.of("message","Dữ liệu đã thay đổi hoặc đang được sử dụng"));}
}
