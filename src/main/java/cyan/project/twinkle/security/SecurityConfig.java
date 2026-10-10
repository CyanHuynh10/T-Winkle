package cyan.project.twinkle.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.session.HttpSessionEventPublisher;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService customUserDetailsService;
    private final RoleBasedAuthenticationSuccessHandler loginSuccess;

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.security.core.session.SessionRegistry sessionRegistry() {
        return new org.springframework.security.core.session.SessionRegistryImpl();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .securityContext(context -> context
                .securityContextRepository(securityContextRepository())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/manager/**").hasRole("MANAGER")
                .requestMatchers("/manager/support", "/manager/support/**").hasRole("MANAGER")
                .requestMatchers("/api/ai-chat/**").hasRole("USER")
                .requestMatchers("/api/support/**", "/ws/chat", "/ws/chat/**").authenticated()
                .requestMatchers("/payments/manage", "/payments/manage/**").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers("/admin", "/admin/**").hasRole("ADMIN")
                .requestMatchers("/manager/**").hasRole("MANAGER")
                .requestMatchers("/settings", "/settings/**").authenticated()
                .requestMatchers("/support", "/support/**").hasRole("SUPPORT")
                .requestMatchers("/chat/**").hasRole("USER")
                .requestMatchers(
                    "/cart/**",
                    "/checkout/**",
                    "/orders/**",
                    "/profile/**",
                    "/addresses/**",
                    "/wishlist/**",
                    "/reviews/**",
                    "/payments/**"
                ).authenticated()
                .anyRequest().permitAll()
            )
            .exceptionHandling(errors -> errors
                .authenticationEntryPoint((request,response,exception) -> {
                    if(!request.getRequestURI().startsWith(request.getContextPath()+"/api/manager/") && !request.getRequestURI().startsWith(request.getContextPath()+"/api/admin/")) {
                        new org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint("/login").commence(request,response,exception);
                        return;
                    }
                    response.setStatus(401); response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"code\":\"NOT_AUTHORIZED\",\"message\":\"Vui lòng đăng nhập lại\"}");
                })
                .accessDeniedHandler((request,response,exception) -> {
                    if(!request.getRequestURI().startsWith(request.getContextPath()+"/api/manager/") && !request.getRequestURI().startsWith(request.getContextPath()+"/api/admin/")) {
                        new org.springframework.security.web.access.AccessDeniedHandlerImpl().handle(request,response,exception);
                        return;
                    }
                    response.setStatus(403); response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"code\":\"NOT_AUTHORIZED\",\"message\":\"Bạn không có quyền thực hiện thao tác này\"}");
                })
            )
            .formLogin(form -> form
                .loginPage("/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .successHandler(loginSuccess)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .sessionManagement(session -> session
                .maximumSessions(1)
                .sessionRegistry(sessionRegistry())
                .expiredUrl("/login?expired")
            );

        return http.build();
    }
}
