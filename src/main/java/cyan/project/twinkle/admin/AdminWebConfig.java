package cyan.project.twinkle.admin;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.HandlerInterceptor;
@Configuration @RequiredArgsConstructor
public class AdminWebConfig implements WebMvcConfigurer {
    private final AdminContextService context;
    @Override public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor(){
            @Override public boolean preHandle(jakarta.servlet.http.HttpServletRequest request,jakarta.servlet.http.HttpServletResponse response,Object handler){context.actor();response.setHeader("Cache-Control","no-store");return true;}
        }).addPathPatterns("/admin","/admin/**","/api/admin/**");
    }
}
