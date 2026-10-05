package cyan.project.twinkle.service;

import cyan.project.twinkle.dto.AddressForm;
import cyan.project.twinkle.dto.ProfileUpdateForm;
import cyan.project.twinkle.entity.Product;
import cyan.project.twinkle.entity.User;
import cyan.project.twinkle.entity.UserAddress;
import cyan.project.twinkle.entity.WishlistItem;
import cyan.project.twinkle.entity.WishlistItemId;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.ProductRepository;
import cyan.project.twinkle.repository.UserAddressRepository;
import cyan.project.twinkle.repository.UserRepository;
import cyan.project.twinkle.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StorefrontUserService {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final AvatarStorageService avatarStorageService;

    @Transactional
    public void updateProfile(String email, ProfileUpdateForm form, org.springframework.web.multipart.MultipartFile avatar) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (form.getUsername() != null && !form.getUsername().trim().isEmpty() && !form.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(form.getUsername().trim())) {
                throw new BusinessRuleException("Tên người dùng đã tồn tại. Vui lòng chọn tên khác.");
            }
            user.setUsername(form.getUsername().trim());
        }
        user.setFullName(form.getFullName().trim());
        user.setPhone(form.getPhone() == null ? null : form.getPhone().trim());
        if (avatar != null && !avatar.isEmpty()) user.setAvatarUrl(avatarStorageService.store(avatar));
        userRepository.saveAndFlush(user);
    }

    @Transactional(readOnly = true)
    public List<UserAddress> getUserAddresses(String email) {
        return userAddressRepository.findByUserEmail(email);
    }

    @Transactional
    public void saveAddress(String email, AddressForm form) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (Boolean.TRUE.equals(form.getIsDefault())) {
            userAddressRepository.findByUserEmailAndIsDefaultTrue(email).forEach(addr -> {
                addr.setIsDefault(false);
                userAddressRepository.save(addr);
            });
        }

        UserAddress address;
        if (form.getId() != null) {
            address = userAddressRepository.findByIdAndUserEmail(form.getId(), email)
                    .orElseThrow(() -> new BusinessRuleException("Địa chỉ không tồn tại."));
        } else {
            address = new UserAddress();
            address.setUser(user);
        }
        address.setFullName(form.getFullName());
        address.setPhone(form.getPhone());
        address.setCity(form.getCity());
        address.setDistrict(form.getDistrict());
        address.setWard(form.getWard());
        address.setAddressLine(form.getAddressLine());
        address.setNote(form.getNote());
        
        if (form.getIsDefault() != null && form.getIsDefault()) {
            address.setIsDefault(true);
        } else if (address.getIsDefault() == null) {
            address.setIsDefault(false);
        }
        
        userAddressRepository.save(address);
    }

    @Transactional
    public void setDefaultAddress(String email, Long addressId) {
        UserAddress targetAddress = userAddressRepository.findByIdAndUserEmail(addressId, email)
                .orElseThrow(() -> new BusinessRuleException("Địa chỉ không hợp lệ."));

        userAddressRepository.findByUserEmailAndIsDefaultTrue(email).forEach(addr -> {
            addr.setIsDefault(false);
            userAddressRepository.save(addr);
        });

        targetAddress.setIsDefault(true);
        userAddressRepository.save(targetAddress);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        UserAddress target = userAddressRepository.findByIdAndUserEmail(addressId, email)
                .orElseThrow(() -> new BusinessRuleException("Địa chỉ không hợp lệ."));
        
        boolean wasDefault = target.getIsDefault();
        userAddressRepository.delete(target);

        if (wasDefault) {
            List<UserAddress> remaining = userAddressRepository.findByUserEmail(email);
            if (!remaining.isEmpty()) {
                UserAddress newDefault = remaining.get(0);
                newDefault.setIsDefault(true);
                userAddressRepository.save(newDefault);
            }
        }
    }

    @Transactional(readOnly = true)
    public Page<WishlistItem> getWishlist(String email, int page) {
        return wishlistItemRepository.findByUserEmailOrderByIdDesc(email, PageRequest.of(page, 12));
    }

    @Transactional
    public boolean toggleWishlist(String email, Integer productId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BusinessRuleException("Sản phẩm không tồn tại."));

        WishlistItemId id = new WishlistItemId(email, productId);
        if (wishlistItemRepository.existsById(id)) {
            wishlistItemRepository.deleteById(id);
            return false;
        } else {
            WishlistItem item = WishlistItem.builder()
                    .id(id)
                    .user(user)
                    .product(product)
                    .build();
            wishlistItemRepository.save(item);
            return true;
        }
    }
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessRuleException("Người dùng không tồn tại."));
    }
}
