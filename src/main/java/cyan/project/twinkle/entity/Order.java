package cyan.project.twinkle.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ORDERS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code", nullable = false, unique = true)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email", referencedColumnName = "email", nullable = false)
    private User user;

    @Column(name = "recipient_name", nullable = false)
    private String recipientName;

    @Column(name = "recipient_phone", nullable = false)
    private String recipientPhone;

    @Column(name = "shipping_address_line", nullable = false)
    private String shippingAddressLine;

    @Column(name = "shipping_ward", nullable = false)
    private String shippingWard;

    @Column(name = "shipping_district", nullable = false)
    private String shippingDistrict;

    @Column(name = "shipping_city", nullable = false)
    private String shippingCity;

    @Column(name = "shipping_note")
    private String shippingNote;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Builder.Default
    @Column(name = "fulfillment_mode", nullable = false, length = 20)
    private String fulfillmentMode = "DELIVERY";

    @Column(nullable = false, length = 50)
    private String status; 

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(name = "product_discount", nullable = false)
    private BigDecimal productDiscount;

    @Column(name = "shipping_fee", nullable = false)
    private BigDecimal shippingFee;

    @Column(name = "coupon_discount", nullable = false)
    private BigDecimal couponDiscount;

    @Column(nullable = false)
    private BigDecimal total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "delivery_mail_sent_at")
    private LocalDateTime deliveryMailSentAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
    @Transient private String paymentStatus;
    @Transient private String refundStatus;
    @Transient private boolean cancellationPending;
    public String getDisplayStatus() {
        return "BANKING".equals(paymentMethod) && "Chờ xác nhận đơn hàng".equals(status) && !"PAID".equals(paymentStatus) ? "Chờ xác nhận thanh toán" : status;
    }
    public String getStatusStyle() {
        return "Chờ xác nhận thanh toán".equals(getDisplayStatus()) ? "payment-waiting" : cyan.project.twinkle.service.OrderStatus.of(status).style();
    }
    public String getFulfillmentLabel() {return "PICKUP".equals(fulfillmentMode)?"Nhận tại cửa hàng":"Giao tận nơi";}
    public java.util.List<Store> getPickupStores() {return orderItems.stream().map(OrderItem::getStore).distinct().toList();}
}
