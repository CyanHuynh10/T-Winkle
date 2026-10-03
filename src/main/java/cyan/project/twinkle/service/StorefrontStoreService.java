package cyan.project.twinkle.service;

import cyan.project.twinkle.entity.Store;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StorefrontStoreService {
    private final StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<Store> getAllStores() {
        return storeRepository.findByStatusOrderByNameAsc("OPEN");
    }

    @Transactional(readOnly = true)
    public Store getStoreBySlug(String slug) {
        return storeRepository.findBySlugAndStatus(slug, "OPEN")
                .orElseThrow(() -> new BusinessRuleException("Cửa hàng không tồn tại hoặc đang đóng cửa."));
    }
}
