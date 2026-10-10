package cyan.project.twinkle.admin;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class AdminAuditService {
    private final JdbcTemplate sql;
    public void record(String actor,String action,String entity,Object id,String summary) {
        sql.update("INSERT ADMIN_AUDIT_LOG(actor_email,action_type,entity_type,entity_id,summary) VALUES(?,?,?,?,?)",actor,action,entity,String.valueOf(id),summary);
    }
}
