package cyan.project.twinkle.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Component
public class RoleBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());

        var cache = new org.springframework.security.web.savedrequest.HttpSessionRequestCache();
        var saved = cache.getRequest(request, response);
        cache.removeRequest(request, response);
        String destination = "/";
        if (roles.contains("ROLE_ADMIN")) {
            destination = "/admin";
        } else if (roles.contains("ROLE_MANAGER")) {
            destination = "/manager";
        } else if (roles.contains("ROLE_SUPPORT")) {
            destination = "/support";
        } else if (roles.contains("ROLE_USER") && saved != null) {
            // Only restore customer destinations, using a local path, never a supplied origin.
            String path = java.net.URI.create(saved.getRedirectUrl()).getPath();
            if(path.startsWith(request.getContextPath())) path=path.substring(request.getContextPath().length());
            if (path.matches("/chat(?:/store/\\d+|/start/\\d+)?") || path.equals("/settings")) destination = path;
        }
        response.sendRedirect(request.getContextPath() + destination);
    }
}
