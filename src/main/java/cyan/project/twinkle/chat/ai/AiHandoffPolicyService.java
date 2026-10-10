package cyan.project.twinkle.chat.ai;

import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.util.*;

@Service
public class AiHandoffPolicyService {
    public static final List<String> REASONS = List.of("PRODUCT_DEFECT", "WRONG_ITEM", "MISSING_ITEM", "REFUND_REQUEST",
        "COMPLAINT", "ORDER_PROBLEM", "AI_UNRESOLVED", "OTHER");
    public static String normalize(String text) {
        return Normalizer.normalize(text.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
            .replaceAll("\\p{M}+", "").replace('đ', 'd').replaceAll("\\s+", " ").trim();
    }
    public String detect(String text) {
        String n = normalize(text);
        if (contains(n, "hoan tien", "refund")) return "REFUND_REQUEST";
        if (contains(n, "giao sai", "sai hang")) return "WRONG_ITEM";
        if (contains(n, "giao thieu", "thieu san pham")) return "MISSING_ITEM";
        if (contains(n, "hang loi", "san pham loi", "bi loi", "bi hong", "bong keo", "rach", "khong dung mo ta")) return "PRODUCT_DEFECT";
        if (contains(n, "khieu nai", "tranh chap")) return "COMPLAINT";
        if (contains(n, "gap nhan vien", "chat voi cua hang", "nguoi that")) return "OTHER";
        return null;
    }
    private boolean contains(String n, String... terms) {
        return Arrays.stream(terms).anyMatch(n::contains);
    }
    public void update(AiChatSessionState state, boolean clarification, boolean signal, String reason) {
        state.clarificationFailureCount = clarification ? state.clarificationFailureCount + 1 : 0;
        if (signal || state.clarificationFailureCount >= 2) {
            state.handoffRecommended = true;
            state.handoffReason = state.clarificationFailureCount >= 2 ? "AI_UNRESOLVED" : REASONS.contains(reason) ? reason : "OTHER";
        }
    }
}
