package cyan.project.twinkle.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@Profile({"ui-preview", "development"})
public class PreviewSecurityConfig {

    @Bean
    public SecurityFilterChain previewSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/ui-preview", "/ui-preview/**", "/test-card",
                    "/css/**", "/js/**", "/images/**", "/fonts/**", "/favicon.ico", "/static/**",
                    "/*.png", "/*.jpg", "/*.jpeg", "/*.svg",
                    "/login", "/register", "/forgot-password", "/reset-password",
                    "/", "/products", "/products/**", "/stores", "/stores/**", "/cart", "/checkout", "/profile",
                    "/addresses", "/wishlist", "/settings", "/orders", "/orders/**", "/chat",
                    "/manager/**",
                    "/admin/**",
                    "/shipper/**",
                    "/support/**",
                    "/error"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
