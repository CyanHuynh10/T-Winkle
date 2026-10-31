package cyan.project.twinkle.security;

import org.springframework.context.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.NullSecurityContextRepository;

@Configuration
public class ApiTokenConfig {
    @Bean @Order(1)
    SecurityFilterChain apiClientChain(HttpSecurity http,ApiTokenService tokens) throws Exception {
        return http.securityMatcher("/api/client/**")
                // Only this stateless bearer-only chain ignores CSRF; browser session forms retain protection.
                .csrf(csrf->csrf.disable()).requestCache(cache->cache.disable())
                .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .securityContext(c->c.securityContextRepository(new NullSecurityContextRepository()))
                .authorizeHttpRequests(a->a.requestMatchers("/api/client/manager/**").hasRole("MANAGER")
                        .requestMatchers("/api/client/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/client/orders").hasRole("USER").anyRequest().authenticated())
                .oauth2ResourceServer(resource->resource.jwt(jwt->jwt.decoder(tokens::decode).jwtAuthenticationConverter(tokens::authenticate))
                        .authenticationEntryPoint((request,response,error)->{response.setStatus(401);response.setHeader("WWW-Authenticate","Bearer");response.setContentType("application/json");response.getWriter().write("{\"message\":\"Valid bearer token required\"}");}))
                .exceptionHandling(e->e.accessDeniedHandler((request,response,error)->{response.setStatus(403);response.setContentType("application/json");response.getWriter().write("{\"message\":\"Insufficient authority\"}");}))
                .build();
    }
}
