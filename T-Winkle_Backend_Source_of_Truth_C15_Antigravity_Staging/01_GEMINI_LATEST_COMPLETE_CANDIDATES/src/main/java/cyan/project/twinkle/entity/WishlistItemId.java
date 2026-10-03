package cyan.project.twinkle.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class WishlistItemId implements Serializable {
    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "product_id")
    private Long productId;
}
