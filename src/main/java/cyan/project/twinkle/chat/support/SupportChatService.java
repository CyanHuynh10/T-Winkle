package cyan.project.twinkle.chat.support;

import cyan.project.twinkle.chat.ai.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.*;
import java.util.regex.Pattern;

@Service @RequiredArgsConstructor
public class SupportChatService {
    private final JdbcTemplate sql;
    private final SupportAuthorizationService access;
    private final SimpMessagingTemplate broker;
    private final cyan.project.twinkle.admin.AdminAuditService audit;
    @Transactional(readOnly=true)
    public Map<String,Object> staffContext(Authentication auth) {
        if(!(access.role(auth,"ADMIN")||access.role(auth,"MANAGER")||access.role(auth,"SUPPORT")))throw new AccessDeniedException("CHAT_ACCESS_DENIED");
        var profile=sql.queryForMap("SELECT email,COALESCE(NULLIF(full_name,''),username) AS name,avatar_url FROM USERS WHERE email=?",auth.getName());
        profile.put("stores",sql.queryForList("SELECT store_id AS id,name FROM STORES s WHERE ?=1 OR (?=1 AND manager_email=?) OR (?=1 AND EXISTS(SELECT 1 FROM STORE_STAFF_ASSIGNMENTS a WHERE a.store_id=s.store_id AND a.user_email=? AND a.active=1)) ORDER BY name,store_id",access.role(auth,"ADMIN"),access.role(auth,"MANAGER"),auth.getName(),access.role(auth,"SUPPORT"),auth.getName()));return profile;
    }
    @Transactional
    public void delete(long id,Authentication auth) {
        if(!(access.role(auth,"ADMIN")||access.role(auth,"MANAGER")))throw new AccessDeniedException("CHAT_DELETE_DENIED");
        var locked=sql.queryForList("SELECT id FROM SUPPORT_CONVERSATIONS WITH(UPDLOCK,HOLDLOCK) WHERE id=?",id);
        if(locked.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Cuộc hội thoại không tồn tại");
        var c=access.require(id,auth);int store=((Number)c.get("store_id")).intValue();
        if(!access.staff(auth,store))throw new AccessDeniedException("CHAT_DELETE_DENIED");
        // Live FK graph: read cursor references both conversation and message.
        sql.update("DELETE SUPPORT_CONVERSATION_READ_STATE WHERE conversation_id=?",id);
        sql.update("DELETE SUPPORT_MESSAGES WHERE conversation_id=?",id);
        sql.update("DELETE SUPPORT_CONVERSATIONS WHERE id=?",id);
        audit.record(auth.getName(),"CONVERSATION_DELETED","SUPPORT_CONVERSATIONS",id,"Store "+store);
        var recipients=new HashSet<>(staffRecipients(store));recipients.add((String)c.get("user_email"));
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization(){@Override public void afterCommit(){for(String recipient:recipients)broker.convertAndSendToUser(recipient,"/queue/support-inbox",Map.of("event","DELETED","conversationId",id));}});
    }
    public record StaffInbox(List<Map<String,Object>> items,long total,int page,int size) {}
    @Transactional(readOnly=true)
    public StaffInbox staffInbox(Authentication auth,int page,int size) {return staffInbox(auth,page,size,null,"");}
    @Transactional(readOnly=true)
    public StaffInbox staffInbox(Authentication auth,int page,int size,Integer storeId,String status) {
        if(page<0 || size<1 || size>100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Phân trang không hợp lệ");size=30;
        if(!(access.role(auth,"ADMIN") || access.role(auth,"MANAGER") || access.role(auth,"SUPPORT"))) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
        String scope=" FROM SUPPORT_CONVERSATIONS c JOIN STORES s ON s.store_id=c.store_id WHERE (?=1 OR (?=1 AND s.manager_email=?) OR (?=1 AND EXISTS(SELECT 1 FROM STORE_STAFF_ASSIGNMENTS a WHERE a.store_id=c.store_id AND a.user_email=? AND a.active=1))) AND (? IS NULL OR c.store_id=?) AND (?='' OR c.status=?)";
        Object[] args={access.role(auth,"ADMIN"),access.role(auth,"MANAGER"),auth.getName(),access.role(auth,"SUPPORT"),auth.getName(),storeId,storeId,status,status};
        long count=sql.queryForObject("SELECT COUNT_BIG(*)"+scope,Long.class,args);
        var values=new ArrayList<Object>();values.add(auth.getName());values.addAll(Arrays.asList(args));values.add(Math.multiplyExact(page,size));values.add(size);
        return new StaffInbox(sql.queryForList("SELECT c.id,c.status,s.name AS storeName,c.last_message_at AS lastMessageAt,c.handoff_summary AS handoffSummary,(SELECT TOP(1) content FROM SUPPORT_MESSAGES m WHERE m.conversation_id=c.id ORDER BY m.id DESC) AS lastMessage,(SELECT COUNT(*) FROM SUPPORT_MESSAGES m WHERE m.conversation_id=c.id AND m.sender_type='USER' AND m.id>COALESCE((SELECT last_read_message_id FROM SUPPORT_CONVERSATION_READ_STATE r WHERE r.conversation_id=c.id AND r.user_email=?),0)) AS unreadCount"+scope+" ORDER BY COALESCE(c.last_message_at,c.created_at) DESC,c.id DESC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY",values.toArray()),count,page,size);
    }
    public record ReadState(long lastReadMessageId) {}
    @Transactional
    public void read(long id,ReadState input,Authentication auth) {
        var c=access.require(id,auth);
        // Owner and authorized staff each maintain an independent persistent read cursor.
        if(sql.queryForObject("SELECT COUNT(*) FROM SUPPORT_MESSAGES WHERE conversation_id=? AND id=?",Integer.class,id,input.lastReadMessageId())!=1)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Tin nhắn không thuộc cuộc trò chuyện");
        var rows=sql.queryForList("SELECT last_read_message_id FROM SUPPORT_CONVERSATION_READ_STATE WITH(UPDLOCK,HOLDLOCK) WHERE conversation_id=? AND user_email=?",id,auth.getName());
        if(rows.isEmpty())sql.update("INSERT SUPPORT_CONVERSATION_READ_STATE(conversation_id,user_email,last_read_message_id) VALUES(?,?,?)",id,auth.getName(),input.lastReadMessageId());
        else sql.update("UPDATE SUPPORT_CONVERSATION_READ_STATE SET last_read_message_id=CASE WHEN COALESCE(last_read_message_id,0)<? THEN ? ELSE last_read_message_id END,last_read_at=SYSDATETIME() WHERE conversation_id=? AND user_email=?",input.lastReadMessageId(),input.lastReadMessageId(),id,auth.getName());
    }
    public record Selection(Integer storeId,Integer productId,String orderCode) {}
    public record Send(String clientMessageId,String content) {}

    @Transactional(readOnly=true)
    public List<Map<String,Object>> options(AiShoppingContext context,String email) {
        return sql.queryForList("SELECT store_id AS storeId,name AS storeName,status,image_url AS storeAvatar,CONCAT(address_line,', ',ward,', ',district,', ',city) AS address FROM STORES ORDER BY CASE WHEN status='OPEN' THEN 0 ELSE 1 END,name,store_id");
    }
    @Transactional
    public Map<String,Object> handoff(AiChatSessionState state,Selection selection,Authentication auth) {
        return start(state,selection,auth,"AI_HANDOFF");
    }
    @Transactional
    public Map<String,Object> direct(Integer storeId, Authentication auth) {
        return start(new AiChatSessionState(),new Selection(storeId,null,null),auth,"DIRECT");
    }
    private Map<String,Object> start(AiChatSessionState state,Selection selection,Authentication auth,String source) {
        String email=auth.getName();
        if(!access.role(auth,"USER")) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
        sql.queryForList("SELECT email FROM USERS WITH(UPDLOCK,HOLDLOCK) WHERE email=?",email);
        Long orderId=state.shoppingContext.getCurrentOrderId();
        Integer productId=selection.productId()!=null?selection.productId():state.shoppingContext.getCurrentProductId();
        if(selection.orderCode()!=null && !selection.orderCode().isBlank()) {
            var ids=sql.queryForList("SELECT id FROM ORDERS WHERE order_code=? AND user_email=?",Long.class,selection.orderCode(),email);
            if(ids.isEmpty()) throw new AccessDeniedException("ORDER_NOT_FOUND");
            orderId=ids.getFirst();
        }
        Integer storeId=selection.storeId();
        // Explicit consent selects the destination; AI context must never override it.
        if(storeId!=null && orderId!=null && sql.queryForObject("SELECT COUNT(*) FROM ORDER_ITEMS WHERE order_id=? AND store_id=?",Integer.class,orderId,storeId)==0) orderId=null;
        if(orderId!=null) {
            var lines=sql.queryForList("""
                SELECT DISTINCT oi.store_id,oi.product_id FROM ORDER_ITEMS oi JOIN ORDERS o ON o.id=oi.order_id
                WHERE o.id=? AND o.user_email=? AND (? IS NULL OR oi.product_id=?)
                """,orderId,email,selection.productId(),selection.productId());
            if(lines.isEmpty()) throw new AccessDeniedException("ORDER_NOT_FOUND");
            var stores=lines.stream().map(row -> ((Number)row.get("store_id")).intValue()).distinct().toList();
            if(stores.size()==1) storeId=stores.getFirst();
            else if(selection.storeId()!=null && stores.contains(selection.storeId())) storeId=selection.storeId();
            else throw new ResponseStatusException(HttpStatus.CONFLICT,"Vui lòng chọn cửa hàng/sản phẩm trong đơn hàng");
            if(productId!=null) {
                final int selectedStore=storeId;
                final int selectedProduct=productId;
                if(lines.stream().noneMatch(row -> ((Number)row.get("store_id")).intValue()==selectedStore && ((Number)row.get("product_id")).intValue()==selectedProduct))
                    productId=null;
            }
        } else {
            storeId=selection.storeId()!=null?selection.storeId():state.shoppingContext.getCurrentStoreId();
        }
        if(storeId==null) throw new ResponseStatusException(HttpStatus.CONFLICT,"Vui lòng chọn cửa hàng");
        if(sql.queryForObject("SELECT COUNT(*) FROM STORES WHERE store_id=?",Integer.class,storeId)==0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cửa hàng không tồn tại");
        if(productId!=null && sql.queryForObject("SELECT COUNT(*) FROM PRODUCTS WHERE id=?",Integer.class,productId)==0) productId=null;
        // Range lock plus filtered unique index: simultaneous consent requests reuse one OPEN conversation.
        var existing=sql.queryForList("""
            SELECT TOP(1) id FROM SUPPORT_CONVERSATIONS WITH (UPDLOCK,HOLDLOCK)
            WHERE user_email=? AND store_id=? ORDER BY CASE WHEN status='OPEN' THEN 0 ELSE 1 END,COALESCE(last_message_at,created_at) DESC,id DESC
            """,Long.class,email,storeId);
        long id;
        String reason=state.handoffReason!=null && AiHandoffPolicyService.REASONS.contains(state.handoffReason)?state.handoffReason:"OTHER";
        String summary=summary(reason);
        if(existing.isEmpty()) {
            id=sql.queryForObject("""
                INSERT INTO SUPPORT_CONVERSATIONS(user_email,store_id,order_id,product_id,source,status,handoff_reason,handoff_summary)
                OUTPUT INSERTED.id VALUES (?,?,?,?,?,'OPEN',?,?)
                """,Long.class,email,storeId,orderId,productId,source,reason,summary);
            sql.update("INSERT INTO SUPPORT_MESSAGES(conversation_id,sender_type,content) VALUES (?,'SYSTEM',?)",id,"DIRECT".equals(source)?"Bắt đầu cuộc trò chuyện với cửa hàng":"Đã chuyển cuộc trò chuyện đến cửa hàng. "+summary);
        } else {
            id=existing.getFirst();
            sql.update("UPDATE SUPPORT_CONVERSATIONS SET status='OPEN',closed_at=NULL,handoff_reason=?,handoff_summary=?,updated_at=SYSDATETIME() WHERE id=?",reason,summary,id);
        }
        final int targetStore=storeId;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override public void afterCommit() {
                for(String recipient:staffRecipients(targetStore))
                    broker.convertAndSendToUser(recipient,"/queue/support-inbox",Map.of("conversationId",id));
            }
        });
        return conversation(id,auth);
    }
    static String summary(String reason) {
        return switch(reason) {
            case "PRODUCT_DEFECT" -> "Khách báo sản phẩm nhận được bị lỗi và cần cửa hàng hỗ trợ";
            case "WRONG_ITEM" -> "Khách báo nhận sai sản phẩm và cần cửa hàng kiểm tra";
            case "MISSING_ITEM" -> "Khách báo đơn hàng thiếu sản phẩm và cần cửa hàng kiểm tra";
            case "REFUND_REQUEST" -> "Khách yêu cầu tư vấn hoàn tiền; cần nhân viên xem xét";
            case "COMPLAINT" -> "Khách cần nhân viên tiếp nhận khiếu nại";
            case "ORDER_PROBLEM" -> "Khách cần hỗ trợ vấn đề đơn hàng";
            case "AI_UNRESOLVED" -> "AI chưa làm rõ được nhu cầu; khách cần hỗ trợ trực tiếp";
            default -> "Khách đồng ý trò chuyện trực tiếp với cửa hàng";
        };
    }
    @Transactional(readOnly=true)
    public Map<String,Object> conversation(long id,Authentication auth) {
        var c=access.require(id,auth);
        var result=new LinkedHashMap<String,Object>();
        result.put("id",id); result.put("storeId",c.get("store_id")); result.put("storeName",c.get("storeName"));
        result.put("storeAvatar",avatar(c)); result.put("status",c.get("status"));
        result.put("handoffSummary",c.get("handoff_summary")); result.put("internal",access.internal(c,auth));
        result.put("orderCode",c.get("order_id")==null?null:sql.queryForObject("SELECT order_code FROM ORDERS WHERE id=?",String.class,c.get("order_id")));
        return result;
    }
    @Transactional(readOnly=true)
    public List<Map<String,Object>> messages(long id,long beforeId,Authentication auth) {
        var c=access.require(id,auth); boolean internal=access.internal(c,auth);
        var rows=sql.queryForList("""
            SELECT TOP (50) m.*,COALESCE(NULLIF(u.full_name,''),u.username) AS actorName
            FROM SUPPORT_MESSAGES m LEFT JOIN USERS u ON u.email=m.sender_email
            WHERE m.conversation_id=? AND (?=0 OR m.id<?) ORDER BY m.id DESC
            """,id,beforeId,beforeId);
        Collections.reverse(rows);
        return rows.stream().map(row -> messageDto(row,c,internal)).toList();
    }
    @Transactional(readOnly=true)
    public List<Map<String,Object>> inbox(Authentication auth) {
        if(!(access.role(auth,"ADMIN") || access.role(auth,"MANAGER") || access.role(auth,"SUPPORT"))) throw new AccessDeniedException("CHAT_ACCESS_DENIED");
        return sql.queryForList("""
            SELECT TOP (100) c.id,s.name AS storeName,c.status,c.handoff_summary AS handoffSummary,c.last_message_at AS lastMessageAt
            FROM SUPPORT_CONVERSATIONS c JOIN STORES s ON s.store_id=c.store_id
            WHERE ?=1 OR (?=1 AND s.manager_email=?) OR (?=1 AND EXISTS
              (SELECT 1 FROM STORE_STAFF_ASSIGNMENTS a WHERE a.store_id=c.store_id AND a.user_email=? AND a.active=1))
            ORDER BY COALESCE(c.last_message_at,c.created_at) DESC,c.id DESC
            """,access.role(auth,"ADMIN"),access.role(auth,"MANAGER"),auth.getName(),access.role(auth,"SUPPORT"),auth.getName());
    }
    @Transactional(readOnly=true)
    public List<Map<String,Object>> mine(Authentication auth) {
        return sql.queryForList("""
            SELECT TOP (100) c.id,s.name AS storeName,s.image_url AS storeAvatar,c.status,c.handoff_summary AS handoffSummary,COALESCE(c.last_message_at,c.updated_at,c.created_at) AS lastMessageAt,
            (SELECT TOP(1) content FROM SUPPORT_MESSAGES m WHERE m.conversation_id=c.id ORDER BY m.id DESC) AS lastMessage,
            (SELECT COUNT(*) FROM SUPPORT_MESSAGES m WHERE m.conversation_id=c.id AND m.sender_type='STAFF' AND m.id>COALESCE((SELECT last_read_message_id FROM SUPPORT_CONVERSATION_READ_STATE r WHERE r.conversation_id=c.id AND r.user_email=?),0)) AS unreadCount
            FROM SUPPORT_CONVERSATIONS c JOIN STORES s ON s.store_id=c.store_id WHERE c.user_email=?
            ORDER BY COALESCE(c.last_message_at,c.created_at) DESC,c.id DESC
            """,auth.getName(),auth.getName());
    }
    @Transactional
    public void send(long id,Send input,Authentication auth) {
        var c=access.require(id,auth);
        String content=input.content()==null?"":input.content().trim();
        if(content.isBlank() || content.length()>2000 || Pattern.compile("<[^>]*>|&(?:lt|gt|#0*60|#x0*3c);",Pattern.CASE_INSENSITIVE).matcher(content).find())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Tin nhắn phải là văn bản từ 1 đến 2000 ký tự");
        try { UUID.fromString(input.clientMessageId()); }
        catch(Exception ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mã tin nhắn không hợp lệ"); }
        // Serialize per conversation and retain the actual authenticated actor.
        var status=sql.queryForObject("SELECT status FROM SUPPORT_CONVERSATIONS WITH (UPDLOCK,HOLDLOCK) WHERE id=?",String.class,id);
        if(!"OPEN".equals(status)) throw new ResponseStatusException(HttpStatus.CONFLICT,"Cuộc trò chuyện đã đóng");
        var duplicate=sql.queryForList("SELECT id FROM SUPPORT_MESSAGES WHERE conversation_id=? AND sender_email=? AND client_message_id=?",
            Long.class,id,auth.getName(),input.clientMessageId());
        boolean internal=access.internal(c,auth);
        long messageId;
        if(duplicate.isEmpty()) {
            messageId=sql.queryForObject("""
                INSERT INTO SUPPORT_MESSAGES(conversation_id,sender_type,sender_email,content,client_message_id)
                OUTPUT INSERTED.id VALUES (?,?,?,?,?)
                """,Long.class,id,internal?"STAFF":"USER",auth.getName(),content,input.clientMessageId());
            sql.update("UPDATE SUPPORT_CONVERSATIONS SET updated_at=SYSDATETIME(),last_message_at=SYSDATETIME() WHERE id=?",id);
        } else messageId=duplicate.getFirst();
        var row=sql.queryForMap("""
            SELECT m.*,COALESCE(NULLIF(u.full_name,''),u.username) AS actorName FROM SUPPORT_MESSAGES m
            LEFT JOIN USERS u ON u.email=m.sender_email WHERE m.id=?
            """,messageId);
        String owner=c.get("user_email").toString();
        var customerDto=messageDto(row,c,false);
        var internalDto=messageDto(row,c,true);
        var recipients=staffRecipients(((Number)c.get("store_id")).intValue());
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override public void afterCommit() {
                broker.convertAndSendToUser(owner,"/queue/support/"+id,customerDto);
                broker.convertAndSendToUser(owner,"/queue/support-inbox",Map.of("conversationId",id));
                for(String recipient:recipients) {
                    if(!recipient.equals(owner)) broker.convertAndSendToUser(recipient,"/queue/support/"+id,internalDto);
                    broker.convertAndSendToUser(recipient,"/queue/support-inbox",Map.of("conversationId",id));
                }
            }
        });
    }
    private List<String> staffRecipients(int storeId) {
        return sql.queryForList("""
            SELECT DISTINCT u.email FROM USERS u JOIN USER_ROLES ur ON ur.user_email=u.email JOIN ROLES r ON r.id=ur.role_id
            WHERE u.is_enabled=1 AND (r.name='ROLE_ADMIN' OR (r.name='ROLE_MANAGER' AND EXISTS
              (SELECT 1 FROM STORES s WHERE s.store_id=? AND s.manager_email=u.email))
              OR (r.name='ROLE_SUPPORT' AND EXISTS (SELECT 1 FROM STORE_STAFF_ASSIGNMENTS a
                WHERE a.store_id=? AND a.user_email=u.email AND a.active=1)))
            """,String.class,storeId,storeId);
    }
    private Map<String,Object> messageDto(Map<String,Object> row,Map<String,Object> c,boolean internal) {
        var dto=new LinkedHashMap<String,Object>();
        dto.put("id",row.get("id")); dto.put("senderType",row.get("sender_type"));
        dto.put("content",row.get("content")); dto.put("createdAt",row.get("created_at"));
        dto.put("clientMessageId",row.get("client_message_id"));
        boolean staff="STAFF".equals(row.get("sender_type"));
        dto.put("displayName",staff?c.get("storeName"):"SYSTEM".equals(row.get("sender_type"))?"T-Winkle":"Khách hàng");
        dto.put("avatar",staff?avatar(c):"/images/T-Winkle.png");
        if(internal && staff) dto.put("staffName",row.get("actorName"));
        return dto;
    }
    private String avatar(Map<String,Object> c) {
        var image=c.get("storeAvatar");
        return image==null || image.toString().isBlank()?"/images/T-Winkle.png":image.toString();
    }
}


