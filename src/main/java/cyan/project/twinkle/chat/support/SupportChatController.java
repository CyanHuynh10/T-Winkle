package cyan.project.twinkle.chat.support;

import cyan.project.twinkle.chat.ai.AiChatSessionState;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.*;

@RestController @RequestMapping("/api/support") @RequiredArgsConstructor
public class SupportChatController {
    private final SupportChatService support;
    @GetMapping("/context") public Map<String,Object> context(Authentication auth){return support.staffContext(auth);}
    @PostMapping("/conversations/{id}/delete") public Map<String,Object> delete(@PathVariable long id,Authentication auth){support.delete(id,auth);return Map.of("message","Đã xóa cuộc hội thoại");}
    @PostMapping("/conversations/direct")
    public Map<String,Object> direct(@RequestBody SupportChatService.Selection selection,Authentication auth) {
        return support.direct(selection.storeId(),auth);
    }
    @GetMapping("/staff-inbox")
    public SupportChatService.StaffInbox staffInbox(Authentication auth,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="30") int size,@RequestParam(required=false) Integer storeId,@RequestParam(defaultValue="") String status){return support.staffInbox(auth,page,size,storeId,status);}
    @PostMapping("/conversations/{id}/read")
    public Map<String,Object> read(@PathVariable long id,@RequestBody SupportChatService.ReadState input,Authentication auth){support.read(id,input,auth);return Map.of("message","Đã đọc");}
    @PostMapping("/conversations/{id}/messages")
    public Map<String,Object> send(@PathVariable long id,@RequestBody SupportChatService.Send input,Authentication auth){support.send(id,input,auth);return Map.of("message","Đã gửi tin nhắn");}
    @GetMapping("/handoff-options")
    public List<Map<String,Object>> options(HttpSession session,Authentication auth) {
        var state=AiChatSessionState.get(session);
        synchronized(state) { return support.options(state.shoppingContext,auth.getName()); }
    }
    @PostMapping("/conversations/handoff")
    public Map<String,Object> handoff(@RequestBody SupportChatService.Selection selection,HttpSession session,Authentication auth) {
        var state=AiChatSessionState.get(session);
        synchronized(state) { return support.handoff(state,selection,auth); }
    }
    @GetMapping("/conversations")
    public List<Map<String,Object>> mine(Authentication auth) { return support.mine(auth); }
    @GetMapping("/inbox")
    public List<Map<String,Object>> inbox(Authentication auth) { return support.inbox(auth); }
    @GetMapping("/conversations/{id}")
    public Map<String,Object> conversation(@PathVariable long id,Authentication auth) { return support.conversation(id,auth); }
    @GetMapping("/conversations/{id}/messages")
    public List<Map<String,Object>> messages(@PathVariable long id,@RequestParam(defaultValue="0") long beforeId,Authentication auth) {
        return support.messages(id,beforeId,auth);
    }
}

