package cyan.project.twinkle.repository;

import cyan.project.twinkle.dto.ProductDetailDTO;
import cyan.project.twinkle.entity.StoreInventory;
import cyan.project.twinkle.entity.StoreInventoryId;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreInventoryRepository extends JpaRepository<StoreInventory, StoreInventoryId> {
    @Query("SELECT ci.id, si.quantity FROM CartItem ci JOIN StoreInventory si ON si.store = ci.store AND si.variant = ci.variant WHERE ci.id IN :ids")
    List<Object[]> findCartStock(@Param("ids") List<Long> ids);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT si FROM StoreInventory si WHERE si.id = :id")
    Optional<StoreInventory> findByIdForUpdate(@Param("id") StoreInventoryId id);

    @Query("SELECT new cyan.project.twinkle.dto.ProductDetailDTO$StoreInventoryDTO(" +
           "st.id, st.name, st.addressLine, v.id, si.quantity, st.status) " +
           "FROM StoreInventory si JOIN si.store st JOIN si.variant v " +
           "WHERE v.product.id = :productId AND v.status = 'ACTIVE' ORDER BY st.id, v.id")
    List<ProductDetailDTO.StoreInventoryDTO> findAvailableInventoryByProductId(@Param("productId") Integer productId);
}
