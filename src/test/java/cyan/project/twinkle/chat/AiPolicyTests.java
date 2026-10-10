package cyan.project.twinkle.chat;

import cyan.project.twinkle.chat.ai.*;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class AiPolicyTests {
    @Test void deterministicVietnameseHandoffAndNormalShopping() {
        var policy=new AiHandoffPolicyService();
        assertEquals("PRODUCT_DEFECT",policy.detect("Hàng tôi nhận BỊ LỖI."));
        assertEquals("REFUND_REQUEST",policy.detect("Tôi muốn HOÀN TIỀN."));
        assertEquals("MISSING_ITEM",policy.detect("Shop giao thiếu sản phẩm."));
        assertNull(policy.detect("Tìm giúp tôi sneaker đen dưới 2 triệu."));
    }
    @Test void twoClarificationsRecommendHandoffAndResolutionResetsCounter() {
        var policy=new AiHandoffPolicyService(); var state=new AiChatSessionState();
        policy.update(state,true,false,"OTHER"); assertFalse(state.handoffRecommended);
        policy.update(state,true,false,"OTHER"); assertTrue(state.handoffRecommended);
        assertEquals("AI_UNRESOLVED",state.handoffReason);
        policy.update(state,false,false,"OTHER"); assertEquals(0,state.clarificationFailureCount);
    }
    @Test void boundedMemoryAndLogoutDropSessionState() {
        var session=new MockHttpSession(); var state=AiChatSessionState.get(session);
        state.shoppingContext.setFootLengthCm(new BigDecimal("26"));
        for(int i=0;i<40;i++) state.append(i%2==0?"user":"assistant","hello "+i);
        assertEquals(16,state.recentMessages.size()); assertFalse(state.rollingSummary.contains("hello"));
        assertSame(state,AiChatSessionState.get(session));
        session.invalidate(); assertThrows(IllegalStateException.class,() -> AiChatSessionState.get(session));
        assertTrue(AiChatSessionState.get(new MockHttpSession()).recentMessages.isEmpty());
    }
    @Test void resettingAiDoesNotResetQuota() {
        var session=new MockHttpSession(); var rate=new AiRateLimiter(2,5);
        rate.acquire(session); session.setAttribute(AiChatSessionState.KEY,new AiChatSessionState()); rate.acquire(session);
        assertThrows(ResponseStatusException.class,() -> rate.acquire(session));
    }
}
