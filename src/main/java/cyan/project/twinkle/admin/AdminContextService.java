package cyan.project.twinkle.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AdminContextService {
    private final JdbcTemplate sql;
    public String actor() {
        var auth=SecurityContextHolder.getContext().getAuthentication();
        if(auth==null || !auth.isAuthenticated() || auth.getAuthorities().stream().noneMatch(a->a.getAuthority().equals("ROLE_ADMIN"))) throw new AccessDeniedException("ADMIN_REQUIRED");
        if(sql.queryForObject("SELECT COUNT(*) FROM USERS u JOIN USER_ROLES ur ON ur.user_email=u.email JOIN ROLES r ON r.id=ur.role_id WHERE u.email=? AND u.is_enabled=1 AND r.name='ROLE_ADMIN'",Integer.class,auth.getName())!=1) throw new AccessDeniedException("ADMIN_REQUIRED");
        return auth.getName();
    }
}
