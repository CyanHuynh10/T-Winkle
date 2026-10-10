package cyan.project.twinkle.chat.ai;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.Instant;
import java.util.ArrayDeque;
import java.io.Serializable;

@Component
public class AiRateLimiter {
    private final int minute;
    private final int hour;
    private static final String KEY=AiRateLimiter.class.getName();
    static class Window implements Serializable { final ArrayDeque<Instant> times=new ArrayDeque<>(); }
    public AiRateLimiter(@Value("${twinkle.ai.rate-limit.per-minute:10}") int minute,
                         @Value("${twinkle.ai.rate-limit.per-hour:100}") int hour) { this.minute=minute; this.hour=hour; }
    public void acquire(HttpSession session) {
        synchronized(session) {
            Window window=(Window)session.getAttribute(KEY);
            if(window==null) { window=new Window(); session.setAttribute(KEY,window); }
            Instant now=Instant.now();
            while(!window.times.isEmpty() && window.times.getFirst().isBefore(now.minusSeconds(3600))) window.times.removeFirst();
            if(window.times.size()>=hour || window.times.stream().filter(t -> t.isAfter(now.minusSeconds(60))).count()>=minute)
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,"Bạn đang gửi tin nhắn hơi nhanh. Vui lòng thử lại sau một chút");
            window.times.addLast(now);
        }
    }
}
