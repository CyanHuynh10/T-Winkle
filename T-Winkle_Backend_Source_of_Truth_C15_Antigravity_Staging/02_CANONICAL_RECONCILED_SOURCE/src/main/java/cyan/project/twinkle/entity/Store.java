package cyan.project.twinkle.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "STORES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_id")
    private Integer id;

    @Column(name = "slug", nullable = false, unique = true, length = 80)
    private String slug;

    @Column(name = "name", nullable = false, length = 180)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "address_line", nullable = false, length = 200)
    private String addressLine;

    @Column(name = "ward", length = 100)
    private String ward;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "rating_average", nullable = false)
    private Double ratingAverage;

    @Column(name = "review_count", nullable = false)
    private Integer reviewCount;

    @Column(name = "manager_email", length = 100)
    private String managerEmail;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "OPEN";
        if (ratingAverage == null) ratingAverage = 0.0;
        if (reviewCount == null) reviewCount = 0;
    }
}
