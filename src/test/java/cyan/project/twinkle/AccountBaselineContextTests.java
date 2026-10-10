package cyan.project.twinkle;

import cyan.project.twinkle.manager.ManagerStoreContextService;
import cyan.project.twinkle.security.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

/** Read-only checks of required identities; no cleanup is performed by tests. */
@SpringBootTest @Transactional
class AccountBaselineContextTests {
    @Autowired ManagerStoreContextService context;
    @Autowired CustomUserDetailsService details;
    @Test void allSixManagersResolveTheirActualStore() {
        try {
            for(var entry:Map.of("district1","q1","district3","q3","district5","q5","district7","q7","thuduc","thu-duc","binhthanh","binh-thanh").entrySet()) {
                String email=entry.getKey()+"@twinkle.com";
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(email,"",List.of(new SimpleGrantedAuthority("ROLE_MANAGER"))));
                assertEquals(entry.getValue(),context.requireCurrentStore().getSlug());
                assertTrue(details.loadUserByUsername(email).isEnabled());
            }
        }finally{SecurityContextHolder.clearContext();}
    }
    @Test void requiredCustomerAdminAndSupportHaveExactlyTheirActiveRole() {
        for(var entry:Map.of("24110064@student.hcmute.edu.vn","ROLE_USER","admin@twinkle.com","ROLE_ADMIN","support1@twinkle.com","ROLE_SUPPORT").entrySet()) {
            var user=details.loadUserByUsername(entry.getKey());assertTrue(user.isEnabled());
            assertEquals(List.of(entry.getValue()),user.getAuthorities().stream().map(a->a.getAuthority()).toList());
        }
    }
}
