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
public class StoreInventoryId implements Serializable {

    @Column(name = "store_id")
    private Integer storeId;

    @Column(name = "variant_id")
    private Long variantId;
}
