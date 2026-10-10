package cyan.project.twinkle.chat.ai;

import jakarta.servlet.http.HttpSession;
import java.io.Serializable;
import java.time.Instant;
import java.util.*;

public class AiChatSessionState implements Serializable {
    public static final String KEY = AiChatSessionState.class.getName();
    public static final int MAX_RECENT_MESSAGES = 16;
    public record Message(String id, String role, String content) implements Serializable {}
    public final List<Message> recentMessages = new ArrayList<>();
    public String rollingSummary = "";
    public final AiShoppingContext shoppingContext = new AiShoppingContext();
    public int clarificationFailureCount;
    public boolean handoffRecommended;
    public String handoffReason;
    public final Instant createdAt = Instant.now();
    public Instant lastActivityAt = createdAt;
    public static AiChatSessionState get(HttpSession session) {
        synchronized (session) {
            var state = (AiChatSessionState) session.getAttribute(KEY);
            if (state == null) { state = new AiChatSessionState(); session.setAttribute(KEY, state); }
            return state;
        }
    }
    public void append(String role, String content) {
        recentMessages.add(new Message(UUID.randomUUID().toString(), role, content));
        while (recentMessages.size() > MAX_RECENT_MESSAGES) {
            recentMessages.removeFirst();
            // Deterministic rolling summary retains shopping facts only; no stale prices or transcript.
            rollingSummary = "Thông tin mua sắm đã xác nhận trong phiên: " + shoppingContext.snapshot();
        }
        lastActivityAt = Instant.now();
    }
    public Map<String, Object> view(boolean available) {
        return Map.of("messages", List.copyOf(recentMessages), "handoffRecommended", handoffRecommended,
            "handoffReason", handoffReason == null ? "" : handoffReason, "available", available);
    }
}
