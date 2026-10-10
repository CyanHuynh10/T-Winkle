package cyan.project.twinkle.manager;

import cyan.project.twinkle.entity.Store;
import cyan.project.twinkle.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;

/** The browser never chooses the store or actor. Recheck active identity on every operation. */
@Service @RequiredArgsConstructor
public class ManagerStoreContextService {
    private final StoreRepository stores;
    private final org.springframework.jdbc.core.JdbcTemplate sql;
    public String actor() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_MANAGER")))
            throw new AccessDeniedException("NOT_AUTHORIZED");
        if (sql.queryForObject("SELECT COUNT(*) FROM USERS u WHERE u.email=? AND u.is_enabled=1 AND EXISTS(SELECT 1 FROM USER_ROLES ur JOIN ROLES r ON r.id=ur.role_id WHERE ur.user_email=u.email AND r.name='ROLE_MANAGER')",Integer.class,auth.getName())!=1)
            throw new AccessDeniedException("NOT_AUTHORIZED");
        return auth.getName();
    }
    @Transactional(readOnly = true)
    public Store requireCurrentStore() {
        List<Store> assigned = stores.findByManagerEmail(actor());
        if (assigned.size() != 1) throw new ManagerException("NOT_FOUND", "Không tìm thấy cửa hàng được phân công. Vui lòng liên hệ Admin", 404);
        return assigned.getFirst();
    }
}
