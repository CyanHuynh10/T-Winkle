package cyan.project.twinkle.manager;

import cyan.project.twinkle.repository.*;
import cyan.project.twinkle.entity.OrderStatusHistory;
import cyan.project.twinkle.event.OrderDeliveredEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.ApplicationEventPublisher;
import java.util.List;

@Service @RequiredArgsConstructor
public class StoreFulfillmentService {
    private final ManagerStoreContextService context;
    private final OrderRepository orders;
    private final OrderCancellationRepository cancellations;
    private final OrderStatusHistoryRepository histories;
    private final ApplicationEventPublisher events;
    private final JdbcTemplate sql;
    private final cyan.project.twinkle.service.OrderPaymentRules paymentRules;
    private final cyan.project.twinkle.admin.AdminContextService admin;
    public static String aggregate(List<String> statuses) {
        return cyan.project.twinkle.service.OrderStatus.aggregate(statuses);
    }
    @Transactional
    public void transition(long id,String target) {
        int store=context.requireCurrentStore().getId();String actor=context.actor();
        transitionStore(id,store,target,actor);
    }
    @Transactional public void transitionAdmin(long id,int store,String target){transitionStore(id,store,target,admin.actor());}
    private void transitionStore(long id,int store,String target,String actor){
        var order=orders.findForUpdate(id).orElseThrow(()->new ManagerException("NOT_FOUND","Đơn hàng không tồn tại",404));
        if(order.getOrderItems().stream().noneMatch(i->i.getStore().getId().equals(store)))throw new org.springframework.security.access.AccessDeniedException("NOT_AUTHORIZED");
        if(cancellations.existsByOrderIdAndStatus(id,"PENDING"))throw new ManagerException("CONFLICT","Cần xử lý yêu cầu hủy trước khi giao hàng",409);
        if(List.of("Đã giao","Đã hủy").contains(order.getStatus()))throw new ManagerException("INVALID_STATUS_TRANSITION","Đơn hàng đã kết thúc",409);
        sql.update("INSERT ORDER_STORE_FULFILLMENTS(order_id,store_id,status) SELECT DISTINCT i.order_id,i.store_id,? FROM ORDER_ITEMS i WHERE i.order_id=? AND NOT EXISTS(SELECT 1 FROM ORDER_STORE_FULFILLMENTS f WHERE f.order_id=i.order_id AND f.store_id=i.store_id)",order.getStatus(),id);
        String old=sql.queryForObject("SELECT status FROM ORDER_STORE_FULFILLMENTS WHERE order_id=? AND store_id=?",String.class,id,store);
        String expected=cyan.project.twinkle.service.OrderStatus.next(old,order.getFulfillmentMode());
        if(expected==null || !expected.equals(target))throw new ManagerException("INVALID_STATUS_TRANSITION","Chuyển trạng thái không hợp lệ",409);
        paymentRules.confirmAllowed(order,target);
        sql.update("UPDATE ORDER_STORE_FULFILLMENTS SET status=?,updated_by=?,updated_at=SYSDATETIME(),confirmed_at=CASE WHEN ?=N'Đã xác nhận' THEN SYSDATETIME() ELSE confirmed_at END,delivered_at=CASE WHEN ?=N'Đã giao' THEN SYSDATETIME() ELSE delivered_at END WHERE order_id=? AND store_id=?",target,actor,target,target,id,store);
        String global=aggregate(sql.queryForList("SELECT status FROM ORDER_STORE_FULFILLMENTS WHERE order_id=?",String.class,id));
        if(!global.equals(order.getStatus())) {
            order.setStatus(global);
            orders.saveAndFlush(order);
            var history=histories.save(OrderStatusHistory.builder().order(order).status(global).note("Cập nhật bởi "+actor).build());
            if(global.equals("Đã giao")){paymentRules.delivered(order);events.publishEvent(new OrderDeliveredEvent(id,history.getId()));}
        }
    }
}

