package cyan.project.twinkle.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.io.Serializable;
import java.time.Instant;
import java.util.*;

/** Session-only navigation context. No browser-supplied URL or role is accepted. */
@Service
public class ConsoleReturnService {
    static final String ORIGIN = ConsoleReturnService.class.getName()+".origin";
    static final String ACTIVE = ConsoleReturnService.class.getName()+".active";
    private final JdbcTemplate sql;
    public ConsoleReturnService(JdbcTemplate sql) { this.sql=sql; }
    public record Destination(String email,String role,String path,Instant entered) implements Serializable {}
    private static final Map<String,Set<String>> PAGES=Map.of(
        "admin",Set.of("","dashboard","users","stores","categories","brands","products","variants","inventory","orders","payments","promotions","coupons","support","history","reviews","reports"),
        "manager",Set.of("","products","variants","inventory","orders","payments","reviews","support","store-profile"),
        "support",Set.of("","reviews"));
    public static String roleFor(String path) {
        if(path==null || !path.matches("/[a-z]+(?:/[a-z-]+)?(?:/[1-9][0-9]*)?"))return null;
        String[] parts=path.substring(1).split("/");
        String role=parts[0],page=parts.length>1?parts[1]:"";
        if(role.equals("support") && parts.length==3 && page.equals("conversations"))return role;
        if(!PAGES.getOrDefault(role,Set.of()).contains(page))return null;
        if(parts.length==3 && !(page.equals("support") || role.equals("manager") && Set.of("products","orders").contains(page)))return null;
        return role;
    }
    private Set<String> roles(Authentication auth) {
        if(auth==null || !auth.isAuthenticated() || auth instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)return Set.of();
        // Intersect current persisted roles with session authorities to handle revoked roles/accounts.
        Set<String> current=new HashSet<>(sql.queryForList("SELECT r.name FROM USER_ROLES ur JOIN ROLES r ON r.id=ur.role_id JOIN USERS u ON u.email=ur.user_email WHERE ur.user_email=? AND u.is_enabled=1",String.class,auth.getName()));
        current.retainAll(auth.getAuthorities().stream().map(a->a.getAuthority()).toList());
        return current;
    }
    private boolean valid(Destination d,Authentication auth,Set<String> roles) {
        return d!=null && auth!=null && d.email().equals(auth.getName()) && d.role().equals(roleFor(d.path())) && roles.contains("ROLE_"+d.role().toUpperCase(Locale.ROOT)) && d.entered().isAfter(Instant.now().minusSeconds(14400));
    }
    public void remember(HttpSession session,String path,Authentication auth) {
        session.removeAttribute(ACTIVE);
        String role=roleFor(path);
        if(role!=null && roles(auth).contains("ROLE_"+role.toUpperCase(Locale.ROOT)))session.setAttribute(ORIGIN,new Destination(auth.getName(),role,path,Instant.now()));
        else session.removeAttribute(ORIGIN);
    }
    public boolean enter(HttpSession session,Authentication auth) {
        Object stored=session.getAttribute(ORIGIN);
        if(stored instanceof Destination d && valid(d,auth,roles(auth))) {
            session.setAttribute(ACTIVE,new Destination(d.email(),d.role(),d.path(),Instant.now()));return true;
        }
        session.removeAttribute(ACTIVE);return false;
    }
    public Destination active(HttpSession session,Authentication auth) {
        if(session==null)return null;
        Object stored=session.getAttribute(ACTIVE);
        if(stored instanceof Destination d && valid(d,auth,roles(auth)))return d;
        session.removeAttribute(ACTIVE);return null;
    }
    public String finish(HttpSession session,Authentication auth) {
        Set<String> roles=roles(auth);
        Object stored=session==null?null:session.getAttribute(ACTIVE);
        if(session!=null){session.removeAttribute(ACTIVE);session.removeAttribute(ORIGIN);}
        if(stored instanceof Destination d && valid(d,auth,roles))return d.path();
        for(String role:List.of("admin","manager","support"))if(roles.contains("ROLE_"+role.toUpperCase(Locale.ROOT)))return "/"+role;
        return "/";
    }
}
