package cyan.project.twinkle.chat.ai;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.time.Duration;

@Component
@ConfigurationProperties(prefix = "twinkle.ai.groq")
@Getter @Setter
public class GroqAiProperties {
    private String apiKey = "";
    private String model = "openai/gpt-oss-120b";
    private String baseUrl = "https://api.groq.com/openai/v1";
    private Duration connectTimeout = Duration.ofSeconds(10);
    private Duration readTimeout = Duration.ofSeconds(45);
}
