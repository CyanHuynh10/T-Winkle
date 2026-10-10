package cyan.project.twinkle.admin;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.*;

@Service @RequiredArgsConstructor
public class AdminUserService {
    private final JdbcTemplate sql;
    private final AdminContextService context;
    private final AdminAuditService audit;
    private final PasswordEncoder encoder;
    private final org.springframework.security.core.session.SessionRegistry sessions;
    public static final String DEFAULT_PASSWORD = "123456";
    public record Account(@NotBlank @Email @Size(max=100) String email,@NotBlank @Size(max=50) String username,@Size(max=100) String fullName,@Pattern(regexp="[0-9+() .-]{0,20}") String phone,@NotNull Boolean enabled,@NotEmpty Set<@NotBlank String> roles) {}
    @Transactional
    public void save(Account input,boolean create) {
        String actor=context.actor();
        // Serialize every role mutation on the database role row to protect the last active administrator.
        sql.queryForList("SELECT id FROM ROLES WITH(UPDLOCK,HOLDLOCK) WHERE name='ROLE_ADMIN'");
        var old=sql.queryForList("SELECT is_enabled FROM USERS WITH(UPDLOCK,HOLDLOCK) WHERE email=?",input.email());
        if(create && !old.isEmpty())throw new ResponseStatusException(HttpStatus.CONFLICT,"Email đã tồn tại");
        if(!create && old.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Tài khoản không tồn tại");
        var allowed=Set.of("ROLE_USER","ROLE_MANAGER","ROLE_SUPPORT","ROLE_ADMIN");
        if(!allowed.containsAll(input.roles()))throw new IllegalArgumentException("Unknown role");
        var previous=new HashSet<>(sql.queryForList("SELECT r.name FROM USER_ROLES ur JOIN ROLES r ON r.id=ur.role_id WHERE ur.user_email=?",String.class,input.email()));
        if(!input.enabled() || !input.roles().contains("ROLE_ADMIN")) protect(input.email(),actor,previous);
        if(create)sql.update("INSERT USERS(email,username,full_name,phone,password_hash,is_enabled) VALUES(?,?,?,?,?,?)",input.email(),input.username().trim(),input.fullName(),input.phone(),encoder.encode(DEFAULT_PASSWORD),input.enabled());
        else sql.update("UPDATE USERS SET username=?,full_name=?,phone=?,is_enabled=?,updated_at=SYSDATETIME() WHERE email=?",input.username().trim(),input.fullName(),input.phone(),input.enabled(),input.email());
        if(!input.enabled() || !input.roles().contains("ROLE_MANAGER")) sql.update("UPDATE STORES SET manager_email=NULL WHERE manager_email=?",input.email());
        if(!input.enabled() || !input.roles().contains("ROLE_SUPPORT")) sql.update("UPDATE STORE_STAFF_ASSIGNMENTS SET active=0 WHERE user_email=?",input.email());
        sql.update("DELETE USER_ROLES WHERE user_email=?",input.email());
        input.roles().forEach(r->sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name=?",input.email(),r));
        audit.record(actor,create?"USER_CREATED":"USER_UPDATED","USERS",input.email(),create?"Account created with encoded default credential":"Profile updated");
        if(!previous.equals(input.roles()))audit.record(actor,"USER_ROLE_CHANGED","USERS",input.email(),String.join(",",input.roles()));
        audit.record(actor,input.enabled()?"USER_ENABLED":"USER_DISABLED","USERS",input.email(),"Account status: "+input.enabled());
    }
    @Transactional
    public void resetDefaultPassword(String email) {
        String actor=context.actor();
        var target=sql.queryForList("SELECT email FROM USERS WITH(UPDLOCK,HOLDLOCK) WHERE email=?",email);
        if(target.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Tài khoản không tồn tại");
        String canonical=target.getFirst().get("email").toString();
        sql.update("UPDATE USERS SET password_hash=?,updated_at=SYSDATETIME() WHERE email=?",encoder.encode(DEFAULT_PASSWORD),canonical);
        sql.update("UPDATE PASSWORD_RESET_TOKENS SET is_used=1 WHERE user_email=? AND is_used=0",canonical);
        sql.update("UPDATE OTP_VERIFICATIONS SET is_used=1 WHERE user_email=? AND type IN('FORGOT_PASSWORD','CHANGE_PASSWORD') AND is_used=0",canonical);
        audit.record(actor,"USER_DEFAULT_PASSWORD_RESET","USERS",canonical,"Default credential reset; outstanding password verification invalidated");
        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(new org.springframework.transaction.support.TransactionSynchronization() {
            @Override public void afterCommit() {
                for(Object principal:sessions.getAllPrincipals()) {
                    if(principal instanceof org.springframework.security.core.userdetails.UserDetails user && canonical.equalsIgnoreCase(user.getUsername()))
                        sessions.getAllSessions(principal,false).forEach(org.springframework.security.core.session.SessionInformation::expireNow);
                }
            }
        });
    }
    private void protect(String email,String actor,Set<String> previous) {
        if(email.equalsIgnoreCase(actor))throw new ResponseStatusException(HttpStatus.CONFLICT,"Không được vô hiệu hóa hoặc bỏ quyền Admin của chính bạn");
        if(previous.contains("ROLE_ADMIN") && sql.queryForObject("SELECT COUNT(*) FROM USERS u JOIN USER_ROLES ur ON ur.user_email=u.email JOIN ROLES r ON r.id=ur.role_id WHERE u.is_enabled=1 AND r.name='ROLE_ADMIN' AND u.email<>?",Integer.class,email)==0)
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Phải giữ ít nhất một Admin hoạt động");
    }
    @Transactional public void delete(String email) {
        String actor=context.actor();sql.queryForList("SELECT id FROM ROLES WITH(UPDLOCK,HOLDLOCK) WHERE name='ROLE_ADMIN'");
        var roles=new HashSet<>(sql.queryForList("SELECT r.name FROM USER_ROLES ur JOIN ROLES r ON r.id=ur.role_id WHERE ur.user_email=?",String.class,email));
        protect(email,actor,roles);
        // Disposable authentication/profile state does not constitute business history.
        // Inspect the complete live FK graph before deleting any part of an account.
        var references=sql.queryForList("SELECT OBJECT_SCHEMA_NAME(f.parent_object_id) AS schema_name,OBJECT_NAME(f.parent_object_id) AS table_name,c.name AS column_name FROM sys.foreign_keys f JOIN sys.foreign_key_columns fc ON fc.constraint_object_id=f.object_id JOIN sys.columns c ON c.object_id=fc.parent_object_id AND c.column_id=fc.parent_column_id WHERE f.referenced_object_id=OBJECT_ID('dbo.USERS')");
        for(var ref:references){String table=ref.get("table_name").toString();if(Set.of("USER_ROLES","OTP_VERIFICATIONS","PASSWORD_RESET_TOKENS","USER_ADDRESSES","WISHLIST_ITEMS").contains(table))continue;String qualified="["+ref.get("schema_name").toString().replace("]","]]")+"].["+table.replace("]","]]")+"]";String column="["+ref.get("column_name").toString().replace("]","]]")+"]";if(sql.queryForObject("SELECT COUNT(*) FROM "+qualified+" WHERE "+column+"=?",Integer.class,email)>0)throw new ResponseStatusException(HttpStatus.CONFLICT,"Tài khoản có lịch sử hoặc phân công đang được tham chiếu, hãy vô hiệu hóa thay vì xóa");}
        for(String table:List.of("OTP_VERIFICATIONS","PASSWORD_RESET_TOKENS","USER_ADDRESSES","WISHLIST_ITEMS"))sql.update("DELETE FROM "+table+" WHERE user_email=?",email);
        // FK constraints remain authoritative: historical references reject the entire transaction.
        sql.update("DELETE USER_ROLES WHERE user_email=?",email);
        if(sql.update("DELETE USERS WHERE email=?",email)!=1)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Tài khoản không tồn tại");
        audit.record(actor,"USER_DELETED","USERS",email,"Unused account deleted.");
    }
}
