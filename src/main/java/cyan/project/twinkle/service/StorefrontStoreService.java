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
        return storeRepository.search(null);
    }

    @Transactional(readOnly = true)
    public List<Store> searchStores(String keyword) {
        return storeRepository.search(keyword == null || keyword.isBlank() ? null : "%" + keyword.trim() + "%");
    }

    @Transactional(readOnly = true)
    public long getTotalStoreCount() {
        return storeRepository.count();
    }

    @Transactional(readOnly = true)
    public Store getStoreBySlug(String slug) {
        return storeRepository.findBySlug(slug)
                .orElseThrow(() -> new BusinessRuleException("Cửa hàng không tồn tại"));
    }
}
