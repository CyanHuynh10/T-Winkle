package cyan.project.twinkle.admin;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
@RestControllerAdvice(basePackages={"cyan.project.twinkle.admin","cyan.project.twinkle.payment"})
public class AdminApiAdvice {
    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    public ResponseEntity<?> business(org.springframework.web.server.ResponseStatusException e){return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason()==null?"Không thể xử lý yêu cầu":e.getReason()));}
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<?> denied(){return ResponseEntity.status(403).body(Map.of("message","Bạn không có quyền thực hiện thao tác này"));}
    @ExceptionHandler({org.springframework.web.bind.MethodArgumentNotValidException.class,IllegalArgumentException.class,org.springframework.http.converter.HttpMessageNotReadableException.class})
    public ResponseEntity<?> invalid(){return ResponseEntity.badRequest().body(Map.of("message","Thông tin nhập không hợp lệ. Kiểm tra các trường bắt buộc"));}
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<?> dependency(){return ResponseEntity.status(409).body(Map.of("message","Dữ liệu bị trùng hoặc còn tham chiếu lịch sử. Hãy ngừng hoạt động thay vì xóa"));}
    @ExceptionHandler(org.springframework.dao.EmptyResultDataAccessException.class)
    public ResponseEntity<?> missing(){return ResponseEntity.status(404).body(Map.of("message","Dữ liệu không tồn tại"));}
    @ExceptionHandler(cyan.project.twinkle.exception.BusinessRuleException.class)
    public ResponseEntity<?> rule(cyan.project.twinkle.exception.BusinessRuleException e){return ResponseEntity.status(409).body(Map.of("message",e.getMessage()));}
    @ExceptionHandler(cyan.project.twinkle.manager.ManagerException.class)
    public ResponseEntity<?> transition(cyan.project.twinkle.manager.ManagerException e){return ResponseEntity.status(e.status).body(Map.of("message",e.getMessage()));}
}
