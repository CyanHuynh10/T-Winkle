package cyan.project.twinkle.chat.support;

import org.springframework.context.annotation.*;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.config.*;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.http.server.*;
import org.springframework.web.socket.*;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.Executor;
import java.util.regex.Pattern;

@Configuration @EnableWebSocketMessageBroker
public class ChatWebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final SupportAuthorizationService access;
    public ChatWebSocketConfig(SupportAuthorizationService access) { this.access=access; }
    @Bean("chatExecutor")
    public Executor chatExecutor() {
        var pool=new ThreadPoolTaskExecutor();
        pool.setCorePoolSize(2); pool.setMaxPoolSize(8); pool.setQueueCapacity(20); pool.setThreadNamePrefix("twinkle-chat-"); pool.initialize();
        return pool;
    }
    @Override public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Default same-origin handshake restriction; no wildcard origins.
        registry.addEndpoint("/ws/chat").addInterceptors(new HandshakeInterceptor() {
            public boolean beforeHandshake(ServerHttpRequest request,ServerHttpResponse response,WebSocketHandler handler,Map<String,Object> attributes) {
                if(!(request instanceof ServletServerHttpRequest servlet)) return false;
                var token=(CsrfToken)servlet.getServletRequest().getAttribute(CsrfToken.class.getName());
                if(token==null) return false;
                token.getToken(); // Materialize the deferred session token.
                var stored=new org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository().loadToken(servlet.getServletRequest());
                if(stored==null) return false;
                attributes.put("chatCsrf",stored.getToken()); attributes.put("chatCsrfHeader",stored.getHeaderName()); return true;
            }
            public void afterHandshake(ServerHttpRequest request,ServerHttpResponse response,WebSocketHandler handler,Exception exception) {}
        });
    }
    @Override public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }
    @Override public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(16384).setSendBufferSizeLimit(65536).setSendTimeLimit(10000);
    }
    @Override public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(guard());
    }
    public ChannelInterceptor guard() {
        return new ChannelInterceptor() {
            @Override public Message<?> preSend(Message<?> message,MessageChannel channel) {
                var h=MessageHeaderAccessor.getAccessor(message,StompHeaderAccessor.class);
                if(h==null || h.getCommand()==null) return message;
                if(!(h.getUser() instanceof Authentication auth) || !auth.isAuthenticated()) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
                var command=h.getCommand();
                if(command==StompCommand.CONNECT) {
                    var attrs=h.getSessionAttributes();
                    if(attrs==null || attrs.get("chatCsrf")==null) throw new AccessDeniedException("CSRF_REQUIRED");
                    String supplied=h.getFirstNativeHeader(attrs.get("chatCsrfHeader").toString());
                    if(!csrfMatches(attrs.get("chatCsrf").toString(),supplied))
                        throw new AccessDeniedException("CSRF_REQUIRED");
                } else if(command==StompCommand.SUBSCRIBE || command==StompCommand.SEND) {
                    String destination=h.getDestination();
                    if(command==StompCommand.SUBSCRIBE && "/user/queue/support-errors".equals(destination)) return message;
                    if(command==StompCommand.SUBSCRIBE && "/user/queue/support-inbox".equals(destination)) {
                        if(!(access.role(auth,"USER") || access.role(auth,"ADMIN") || access.role(auth,"MANAGER") || access.role(auth,"SUPPORT"))) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
                        return message;
                    }
                    String pattern=command==StompCommand.SEND?"^/app/support/(\\d+)/send$":"^/user/queue/support/(\\d+)$";
                    var match=Pattern.compile(pattern).matcher(destination==null?"":destination);
                    if(!match.matches()) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
                    access.require(Long.parseLong(match.group(1)),auth);
                } else if(command!=StompCommand.DISCONNECT && command!=StompCommand.UNSUBSCRIBE) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
                return message;
            }
        };
    }
    static boolean csrfMatches(String expected,String supplied) {
        if(supplied==null) return false;
        byte[] actual;
        try {
            byte[] encoded=Base64.getUrlDecoder().decode(supplied);
            int length=expected.getBytes(StandardCharsets.UTF_8).length;
            if(encoded.length!=2*length) return false;
            actual=new byte[length];
            for(int i=0;i<length;i++) actual[i]=(byte)(encoded[i]^encoded[length+i]);
        } catch(IllegalArgumentException ex) { return false; }
        return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8),actual);
    }
}
