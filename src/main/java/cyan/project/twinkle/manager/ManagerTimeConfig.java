package cyan.project.twinkle.manager;
import org.springframework.context.annotation.*;
import java.time.*;
@Configuration
public class ManagerTimeConfig {
    @Bean public Clock managerClock(){return Clock.system(ZoneId.of("Asia/Ho_Chi_Minh"));}
}
