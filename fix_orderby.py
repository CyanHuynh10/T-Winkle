import os

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

# Update Repositories
replace_in_file('src/main/java/cyan/project/twinkle/repository/OrderRepository.java', 'findByUserEmailOrderByCreatedAtDesc', 'findByUserEmailOrderByIdDesc')
replace_in_file('src/main/java/cyan/project/twinkle/repository/OtpVerificationRepository.java', 'findByUserAndTypeAndIsUsedFalseOrderByCreatedAtDesc', 'findByUserAndTypeAndIsUsedFalseOrderByIdDesc')
replace_in_file('src/main/java/cyan/project/twinkle/repository/PasswordResetTokenRepository.java', 'findByUserAndIsUsedFalseOrderByCreatedAtDesc', 'findByUserAndIsUsedFalseOrderByIdDesc')
replace_in_file('src/main/java/cyan/project/twinkle/repository/ReviewRepository.java', 'findByOrderItemProductIdOrderByCreatedAtDesc', 'findByOrderItemProductIdOrderByIdDesc')
replace_in_file('src/main/java/cyan/project/twinkle/repository/WishlistItemRepository.java', 'findByUserEmailOrderByCreatedAtDesc', 'findByUserEmailOrderByIdDesc')

# Update Services
replace_in_file('src/main/java/cyan/project/twinkle/service/OrderService.java', 'findByUserEmailOrderByCreatedAtDesc', 'findByUserEmailOrderByIdDesc')
replace_in_file('src/main/java/cyan/project/twinkle/service/AuthService.java', 'findByUserAndTypeAndIsUsedFalseOrderByCreatedAtDesc', 'findByUserAndTypeAndIsUsedFalseOrderByIdDesc')
replace_in_file('src/main/java/cyan/project/twinkle/service/AuthService.java', 'findByUserAndIsUsedFalseOrderByCreatedAtDesc', 'findByUserAndIsUsedFalseOrderByIdDesc')
replace_in_file('src/main/java/cyan/project/twinkle/service/ReviewService.java', 'findByOrderItemProductIdOrderByCreatedAtDesc', 'findByOrderItemProductIdOrderByIdDesc')
replace_in_file('src/main/java/cyan/project/twinkle/service/StorefrontUserService.java', 'findByUserEmailOrderByCreatedAtDesc', 'findByUserEmailOrderByIdDesc')

print("Replaced OrderByCreatedAtDesc with OrderByIdDesc")
