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
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "address_line")
    private String addressLine;

    private String ward;
    private String district;
    private String city;
    private String phone;

    @Column(name = "image_url")
    private String imageUrl;

    private String description;
    
    @Column(nullable = false)
    private String status;

    @Column(name = "rating_average")
    private Double ratingAverage;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "manager_email")
    private String managerEmail;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
