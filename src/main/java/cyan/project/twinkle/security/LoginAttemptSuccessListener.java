package cyan.project.twinkle.security;

import cyan.project.twinkle.service.LoginAttemptService;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Component
public class LoginAttemptSuccessListener implements ApplicationListener<AuthenticationSuccessEvent> {

    private final LoginAttemptService loginAttemptService;

    public LoginAttemptSuccessListener(LoginAttemptService loginAttemptService) {
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent e) {
        String loginId = e.getAuthentication().getName();
        if (loginId != null) {
            loginAttemptService.loginSucceeded(loginId);
        }
    }
}
