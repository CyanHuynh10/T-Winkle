package cyan.project.twinkle.chat.ai;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.*;
import org.springframework.boot.context.properties.source.MapConfigurationPropertySource;
import java.net.http.*;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GroqProviderTests {
    @Test void footContextOnlySkipsToolsForAnUnambiguousMeasurementStatement() {
        assertFalse(AiChatOrchestrator.needsTools(AiHandoffPolicyService.normalize("Chân mình dài 26 cm.")));
        assertTrue(AiChatOrchestrator.needsTools(AiHandoffPolicyService.normalize("Tìm giúp mình giày Adidas cho chân dài 26 cm.")));
    }
    @Test void typedConfigurationAndRequestModel() {
        var source=new MapConfigurationPropertySource(Map.of("twinkle.ai.groq.model","openai/gpt-oss-120b",
            "twinkle.ai.groq.connect-timeout","3s","twinkle.ai.groq.read-timeout","8s"));
        var props=new Binder(source).bind("twinkle.ai.groq",Bindable.of(GroqAiProperties.class)).get();
        assertEquals(3,props.getConnectTimeout().toSeconds()); assertEquals(8,props.getReadTimeout().toSeconds());
        var provider=new GroqAiChatProvider(props,"GROQ",mock(HttpClient.class));
        assertFalse(provider.available());
        assertThrows(AiUnavailableException.class,() -> provider.complete(List.of(),List.of(),false));
        var tools=List.<Map<String,Object>>of(Map.of("type","function"));
        var request=provider.requestBody(List.of(Map.of("role","user","content","hello")),tools,false);
        assertEquals("openai/gpt-oss-120b",request.get("model")); assertEquals(tools,request.get("tools"));
        assertEquals(false,request.get("include_reasoning"));
        assertEquals("required",request.get("tool_choice"));
        assertEquals(Map.of("type","function","function",Map.of("name","get_store_inventory")),
            provider.requestBody(List.of(),tools,false,"get_store_inventory").get("tool_choice"));
        assertFalse(provider.requestBody(List.of(),tools,true).containsKey("tools"));
        assertTrue(provider.requestBody(List.of(),List.of(),true).containsKey("response_format"));
    }
    @Test void providerMapsToolsAndDropsInternalReasoning() {
        var provider=new GroqAiChatProvider(new GroqAiProperties(),"GROQ",mock(HttpClient.class));
        var reply=provider.mapResponse("""
            {"choices":[{"message":{"content":null,"reasoning":"PRIVATE","tool_calls":[
              {"id":"call1","function":{"name":"get_store_inventory","arguments":"{}"}}]}}]}
            """);
        assertEquals("",reply.content()); assertEquals(1,reply.tools().size());
        assertEquals("get_store_inventory",reply.tools().getFirst().name());
        assertFalse(reply.toString().contains("PRIVATE"));
    }
    @Test @SuppressWarnings("unchecked") void errorsAndTimeoutAreSafe() throws Exception {
        var props=new GroqAiProperties(); props.setApiKey("fake-unit-test-key");
        var client=mock(HttpClient.class);
        var response=(HttpResponse<java.io.InputStream>)mock(HttpResponse.class);
        when(response.statusCode()).thenReturn(500);
        when(response.body()).thenReturn(new ByteArrayInputStream("{secret:raw-provider-error}".getBytes(StandardCharsets.UTF_8)));
        when(client.send(any(HttpRequest.class),any(HttpResponse.BodyHandler.class))).thenReturn(response);
        var provider=new GroqAiChatProvider(props,"GROQ",client);
        assertEquals("AI_UNAVAILABLE",assertThrows(AiUnavailableException.class,() -> provider.complete(List.of(),List.of(),false)).getMessage());
        when(client.send(any(HttpRequest.class),any(HttpResponse.BodyHandler.class))).thenThrow(new HttpTimeoutException("private"));
        assertEquals("AI_UNAVAILABLE",assertThrows(AiUnavailableException.class,() -> provider.complete(List.of(),List.of(),false)).getMessage());
    }
}
