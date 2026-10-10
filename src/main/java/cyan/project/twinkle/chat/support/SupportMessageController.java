package cyan.project.twinkle.chat.support;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import java.security.Principal;
import java.util.Map;

@Controller @RequiredArgsConstructor
public class SupportMessageController {
    private final SupportChatService chat;
    @MessageMapping("/support/{id}/send")
    public void send(@DestinationVariable long id,SupportChatService.Send input,Principal principal) {
        if(!(principal instanceof Authentication auth)) throw new org.springframework.security.access.AccessDeniedException("CHAT_ACCESS_DENIED");
        chat.send(id,input,auth);
    }
    @MessageExceptionHandler
    @SendToUser(value="/queue/support-errors",broadcast=false)
    public Map<String,Object> error(Exception ex) {
        return Map.of("message","Tin nhắn chưa được gửi. Kiểm tra nội dung và quyền truy cập, rồi thử lại");
    }
}
