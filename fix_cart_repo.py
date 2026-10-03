import os

def replace_in_file(path, old, new):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {path}")
    else:
        print(f"Not found in {path}")

replace_in_file('src/main/java/cyan/project/twinkle/repository/CartRepository.java', 'findFirstByUserEmailAndStatusOrderByCreatedAtDesc', 'findByUserEmailAndStatus')
replace_in_file('src/main/java/cyan/project/twinkle/service/CartService.java', 'findFirstByUserEmailAndStatusOrderByCreatedAtDesc', 'findByUserEmailAndStatus')
replace_in_file('src/main/java/cyan/project/twinkle/service/CheckoutService.java', 'findFirstByUserEmailAndStatusOrderByCreatedAtDesc', 'findByUserEmailAndStatus')
