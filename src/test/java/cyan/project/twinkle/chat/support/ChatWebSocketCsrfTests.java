package cyan.project.twinkle.chat.support;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.*;
import org.springframework.security.web.csrf.*;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.access.AccessDeniedException;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ChatWebSocketCsrfTests {
    @Test void separatelyMaskedPageAndHandshakeTokensStillMatchSameSession() {
        var raw=new DefaultCsrfToken("X-CSRF-TOKEN","_csrf",UUID.randomUUID().toString());
        var handler=new XorCsrfTokenRequestAttributeHandler();
        var page=new MockHttpServletRequest();
        var handshake=new MockHttpServletRequest();
        handler.handle(page,new MockHttpServletResponse(),() -> raw);
        handler.handle(handshake,new MockHttpServletResponse(),() -> raw);
        String pageToken=((CsrfToken)page.getAttribute(CsrfToken.class.getName())).getToken();
        String handshakeToken=((CsrfToken)handshake.getAttribute(CsrfToken.class.getName())).getToken();
        assertNotEquals(pageToken,handshakeToken);
        assertTrue(ChatWebSocketConfig.csrfMatches(raw.getToken(),pageToken));
        assertTrue(ChatWebSocketConfig.csrfMatches(raw.getToken(),handshakeToken));
        assertFalse(ChatWebSocketConfig.csrfMatches(UUID.randomUUID().toString(),pageToken));
        assertFalse(ChatWebSocketConfig.csrfMatches(raw.getToken(),null));
        var config=new ChatWebSocketConfig(mock(SupportAuthorizationService.class));
        var h=StompHeaderAccessor.create(StompCommand.CONNECT);
        h.setUser(new UsernamePasswordAuthenticationToken("customer","",List.of(new SimpleGrantedAuthority("ROLE_USER"))));
        h.setSessionAttributes(Map.of("chatCsrf",raw.getToken(),"chatCsrfHeader",raw.getHeaderName()));
        h.setNativeHeader(raw.getHeaderName(),pageToken);
        assertNotNull(config.guard().preSend(MessageBuilder.createMessage(new byte[0],h.getMessageHeaders()),null));
        var bad=StompHeaderAccessor.create(StompCommand.CONNECT);
        bad.setUser(h.getUser()); bad.setSessionAttributes(h.getSessionAttributes());
        assertThrows(AccessDeniedException.class,() -> config.guard().preSend(MessageBuilder.createMessage(new byte[0],bad.getMessageHeaders()),null));
    }
}
