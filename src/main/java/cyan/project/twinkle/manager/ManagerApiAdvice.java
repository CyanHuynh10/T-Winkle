package cyan.project.twinkle.manager;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.Map;

@RestControllerAdvice(assignableTypes=ManagerApiController.class)
public class ManagerApiAdvice {
    @ExceptionHandler(ManagerException.class) ResponseEntity<?> manager(ManagerException ex){return error(ex.status,ex.code,ex.getMessage());}
    @ExceptionHandler(AccessDeniedException.class) ResponseEntity<?> denied(){return error(403,"NOT_AUTHORIZED","Bạn không có quyền thực hiện thao tác này");}
    @ExceptionHandler({MethodArgumentNotValidException.class,org.springframework.http.converter.HttpMessageNotReadableException.class,org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class,ArithmeticException.class})
    ResponseEntity<?> invalid(){return error(400,"INVALID_INPUT","Thông tin không hợp lệ. Vui lòng kiểm tra các trường");}
    @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<?> conflict(){return error(409,"CONFLICT","Yêu cầu bị trùng hoặc dữ liệu đã thay đổi. Vui lòng tải lại");}
    @ExceptionHandler(cyan.project.twinkle.exception.BusinessRuleException.class) ResponseEntity<?> business(cyan.project.twinkle.exception.BusinessRuleException ex){return error(409,"CONFLICT",ex.getMessage());}
    @ExceptionHandler(Exception.class) ResponseEntity<?> failure(){return error(500,"CONFLICT","Chưa thể xử lý yêu cầu. Vui lòng thử lại");}
    private ResponseEntity<?> error(int status,String code,String message){return ResponseEntity.status(status).body(Map.of("code",code,"message",message));}
}

