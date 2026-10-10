package cyan.project.twinkle.chat.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;
import java.net.URI;
import java.net.http.*;
import java.util.*;

@Component
@lombok.extern.slf4j.Slf4j
public class GroqAiChatProvider implements AiChatProvider {
    private final GroqAiProperties properties;
    private final String provider;
    private final HttpClient client;
    private final JsonMapper json = JsonMapper.builder().build();

    @org.springframework.beans.factory.annotation.Autowired
    public GroqAiChatProvider(GroqAiProperties properties, @Value("${twinkle.ai.provider:GROQ}") String provider) {
        this(properties,provider,HttpClient.newBuilder().connectTimeout(properties.getConnectTimeout())
            .followRedirects(HttpClient.Redirect.NEVER).build());
    }
    GroqAiChatProvider(GroqAiProperties properties,String provider,HttpClient client) {
        this.properties = properties;
        this.provider = provider;
        this.client = client;
    }
    public boolean available() {
        return "GROQ".equalsIgnoreCase(provider) && properties.getApiKey() != null && !properties.getApiKey().isBlank();
    }
    Map<String, Object> requestBody(List<Map<String, Object>> messages, List<Map<String, Object>> tools, boolean structured) {
        return requestBody(messages,tools,structured,null);
    }
    Map<String, Object> requestBody(List<Map<String, Object>> messages, List<Map<String, Object>> tools, boolean structured,String forcedTool) {
        var body = new LinkedHashMap<String, Object>();
        body.put("model", properties.getModel());
        body.put("messages", messages);
        body.put("temperature", 0.2);
        body.put("max_completion_tokens", 2400);
        body.put("reasoning_effort", "low");
        body.put("include_reasoning", false);
        if (structured) body.put("response_format", envelopeSchema());
        else if (!tools.isEmpty()) {
            body.put("tools", tools);
            body.put("tool_choice",forcedTool==null?
                messages.stream().noneMatch(m -> "tool".equals(m.get("role"))) ? "required" : "auto":
                Map.of("type","function","function",Map.of("name",forcedTool)));
            body.put("parallel_tool_calls", false);
        }
        return body;
    }
    public Reply complete(List<Map<String, Object>> messages, List<Map<String, Object>> tools, boolean structured) {
        return complete(messages,tools,structured,null);
    }
    @Override public Reply complete(List<Map<String, Object>> messages, List<Map<String, Object>> tools, boolean structured,String forcedTool) {
        if (!available()) throw new AiUnavailableException();
        try {
            var uri = URI.create(properties.getBaseUrl().replaceAll("/+$", "") + "/chat/completions");
            // The production key must never be sent to an unexpected host or redirected.
            if (!"https".equals(uri.getScheme()) || !"api.groq.com".equals(uri.getHost())) throw new AiUnavailableException();
            var request = HttpRequest.newBuilder(uri).timeout(properties.getReadTimeout())
                .header("Authorization", "Bearer " + properties.getApiKey())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(requestBody(messages, tools, structured,forcedTool)))).build();
            var response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
            try (var stream = response.body()) {
                if (response.statusCode() != 200) {
                    if(response.statusCode()==429) {
                        long seconds=30;
                        try { seconds=(long)Math.ceil(Double.parseDouble(response.headers().firstValue("retry-after").orElse("30"))); }
                        catch(NumberFormatException ignored) {}
                        throw new AiRateLimitException(seconds);
                    }
                    String category="PROVIDER_ERROR";
                    if(response.statusCode()==400) {
                        String error=new String(stream.readNBytes(8192),java.nio.charset.StandardCharsets.UTF_8).toLowerCase(Locale.ROOT);
                        if(error.contains("tool_use_failed")) {
                            category="TOOL_USE_FAILED";
                            var recognized=tools.stream().map(t -> ((Map<?,?>)t.get("function")).get("name").toString())
                                .filter(error::contains).toList();
                            log.warn("Groq rejected tool generation: recognizedTools={}",recognized);
                        }
                        else if(error.contains("include_reasoning")) category="INCLUDE_REASONING";
                        else if(error.contains("parallel_tool_calls")) category="PARALLEL_TOOL_CALLS";
                        else if(error.contains("model")) category="MODEL_REQUEST";
                        else if(error.contains("tool")) category="TOOL_REQUEST";
                    }
                    log.warn("Groq request unavailable: status={}, category={}",response.statusCode(),category);
                    throw new AiUnavailableException();
                }
                byte[] bytes = stream.readNBytes(262145);
                if (bytes.length > 262144) throw new AiUnavailableException();
                return mapResponse(new String(bytes, java.nio.charset.StandardCharsets.UTF_8));
            }
        } catch (AiRateLimitException ex) {
            throw ex;
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new AiUnavailableException();
        } catch (Exception ex) {
            if (!(ex instanceof AiUnavailableException)) log.warn("Groq request unavailable: category={}",ex.getClass().getSimpleName());
            // Do not propagate provider bodies, authorization headers, or private prompts.
            throw new AiUnavailableException();
        }
    }
    Reply mapResponse(String body) {
        var node = json.readTree(body).path("choices").path(0).path("message");
        if (node.isMissingNode()) throw new AiUnavailableException();
        List<ToolCall> calls = new ArrayList<>();
        for (var call : node.path("tool_calls")) {
            calls.add(new ToolCall(call.path("id").asText(), call.path("function").path("name").asText(),
                call.path("function").path("arguments").asText()));
        }
        return new Reply(node.path("content").isNull() ? "" : node.path("content").asText(""), List.copyOf(calls));
    }
    static Map<String, Object> envelopeSchema() {
        var fields = new LinkedHashMap<String, Object>();
        fields.put("message", Map.of("type", "string"));
        fields.put("clarificationRequired", Map.of("type", "boolean"));
        fields.put("handoffRecommended", Map.of("type", "boolean"));
        fields.put("handoffReason", Map.of("type", "string", "enum", AiHandoffPolicyService.REASONS));
        var schema = Map.of("type", "object", "properties", fields, "required", List.copyOf(fields.keySet()), "additionalProperties", false);
        return Map.of("type", "json_schema", "json_schema", Map.of("name", "twinkle_answer", "strict", true, "schema", schema));
    }
}
