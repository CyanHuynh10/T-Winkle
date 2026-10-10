package cyan.project.twinkle.chat.ai;

import java.util.List;
import java.util.Map;

public interface AiChatProvider {
    record ToolCall(String id, String name, String arguments) {}
    record Reply(String content, List<ToolCall> tools) {}
    boolean available();
    Reply complete(List<Map<String, Object>> messages, List<Map<String, Object>> tools, boolean structured);
    default Reply complete(List<Map<String, Object>> messages, List<Map<String, Object>> tools, boolean structured, String forcedTool) {
        return complete(messages,tools,structured);
    }
}
