package cyan.project.twinkle.chat.support;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import java.util.Map;

@Service @RequiredArgsConstructor
public class SupportAuthorizationService {
    private final JdbcTemplate sql;
    public boolean role(Authentication auth,String role) {
        return auth!=null && auth.isAuthenticated() && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_"+role)) && (role.equals("USER") || sql.queryForObject("SELECT COUNT(*) FROM USERS u JOIN USER_ROLES ur ON ur.user_email=u.email JOIN ROLES r ON r.id=ur.role_id WHERE u.email=? AND u.is_enabled=1 AND r.name=?",Integer.class,auth.getName(),"ROLE_"+role)==1);
    }
    public boolean staff(Authentication auth,int storeId) {
        if(auth==null || !auth.isAuthenticated()) return false;
        if(role(auth,"ADMIN")) return true;
        if(role(auth,"MANAGER") && Boolean.TRUE.equals(sql.queryForObject(
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM STORES WHERE store_id=? AND manager_email=?) THEN 1 ELSE 0 END",
            Boolean.class,storeId,auth.getName()))) return true;
        return role(auth,"SUPPORT") && Boolean.TRUE.equals(sql.queryForObject(
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM STORE_STAFF_ASSIGNMENTS WHERE store_id=? AND user_email=? AND active=1) THEN 1 ELSE 0 END",
            Boolean.class,storeId,auth.getName()));
    }
    public Map<String,Object> require(long id,Authentication auth) {
        if(auth==null || !auth.isAuthenticated()) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
        var rows=sql.queryForList("""
            SELECT c.*,st.name AS storeName,st.image_url AS storeAvatar FROM SUPPORT_CONVERSATIONS c
            JOIN STORES st ON st.store_id=c.store_id WHERE c.id=?
            """,id);
        if(rows.isEmpty()) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
        var c=rows.getFirst();
        if(!auth.getName().equals(c.get("user_email")) && !staff(auth,((Number)c.get("store_id")).intValue()))
            throw new AccessDeniedException("CHAT_ACCESS_DENIED");
        return c;
    }
    public boolean internal(Map<String,Object> c,Authentication auth) {
        return !auth.getName().equals(c.get("user_email"));
    }
}

