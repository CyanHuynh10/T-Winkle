package cyan.project.twinkle.chat.ai;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.*;
import java.util.Map;

@RestControllerAdvice(assignableTypes=AiChatController.class)
public class ChatInputExceptionAdvice {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> invalidInput() {
        return ResponseEntity.badRequest().body(Map.of("message","Tin nhắn phải có nội dung và không vượt quá 2000 ký tự"));
    }
}
