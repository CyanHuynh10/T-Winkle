package cyan.project.twinkle.chat.ai;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.security.Principal;
import java.util.Map;
import java.util.concurrent.Executor;

@RestController @RequestMapping("/api/ai-chat")
public class AiChatController {
    private final AiChatOrchestrator orchestrator;
    private final AiRateLimiter rate;
    private final Executor executor;
    private final int maxLength;
    public AiChatController(AiChatOrchestrator orchestrator,AiRateLimiter rate,
        @Qualifier("chatExecutor") Executor executor,@Value("${twinkle.ai.max-input-length:2000}") int maxLength) {
        this.orchestrator=orchestrator; this.rate=rate; this.executor=executor; this.maxLength=maxLength;
    }
    public record Input(@NotBlank @Size(max=2000) String content) {}
    @GetMapping("/session")
    public Map<String,Object> session(HttpSession session) {
        var state=AiChatSessionState.get(session);
        synchronized(state) { return state.view(orchestrator.available()); }
    }
    @PostMapping("/reset")
    public Map<String,Object> reset(HttpSession session) {
        // Keep the same monitor so an in-flight response cannot resurrect an old transcript after reset.
        var state=AiChatSessionState.get(session);
        synchronized(state) {
            session.setAttribute(AiChatSessionState.KEY,new AiChatSessionState());
        }
        return Map.of("reset",true);
    }
    @PostMapping(value="/messages/stream",produces="text/event-stream")
    public SseEmitter send(@Valid @RequestBody Input input,HttpSession session,Principal principal) {
        if(input.content().length()>maxLength) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Tin nhắn quá dài");
        rate.acquire(session);
        String email=principal.getName();
        var state=AiChatSessionState.get(session);
        var emitter=new SseEmitter(240000L);
        try {
            executor.execute(() -> {
                try {
                    var result=orchestrator.reply(state,email,input.content().trim(),label -> emit(emitter,"status",Map.of("label",label)));
                    session.getCreationTime(); // Invalidated sessions must not return their private transcript.
                    if(session.getAttribute(AiChatSessionState.KEY)!=state) throw new IllegalStateException("CHAT_RESET");
                    emit(emitter,"done",result);
                    emitter.complete();
                } catch(Exception ex) {
                    emit(emitter,"error",Map.of("message",AiChatOrchestrator.UNAVAILABLE)); emitter.complete();
                }
            });
        } catch(java.util.concurrent.RejectedExecutionException ex) {
            emitter.complete();
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,"Vui lòng thử lại sau một chút");
        }
        return emitter;
    }
    private static void emit(SseEmitter emitter,String event,Object data) {
        try { emitter.send(SseEmitter.event().name(event).data(data)); }
        catch(java.io.IOException ex) { throw new IllegalStateException("CLIENT_DISCONNECTED"); }
    }
}
