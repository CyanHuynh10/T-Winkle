import re

path_layout = 'src/main/resources/templates/fragments/layout.html'
with open(path_layout, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'<script th:src="@\{/js/cart-handler\.js\}"></script>', '', content)
content = re.sub(r'<script th:src="@\{/js/wishlist-handler\.js\}"></script>', '', content)
content = re.sub(r'<script th:src="@\{/js/order-handler\.js\}"></script>', '', content)
with open(path_layout, 'w', encoding='utf-8') as f:
    f.write(content)

path_navbar = 'src/main/resources/templates/fragments/navbar.html'
with open(path_navbar, 'r', encoding='utf-8') as f:
    content = f.read()

# Update wishlist badge
content = re.sub(r'<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light wishlist-count-badge" style="display: none;">\s*0\s*</span>', 
                 '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light wishlist-count-badge" th:text="${wishlistCount}" th:style="${wishlistCount > 0 ? \'\' : \'display: none;\'}">0</span>', content, flags=re.DOTALL)

# Update cart badge
content = re.sub(r'<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-cyan border border-light text-white cart-count-badge" style="display: none;">\s*0\s*</span>', 
                 '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-cyan border border-light text-white cart-count-badge" th:text="${cartCount}" th:style="${cartCount > 0 ? \'\' : \'display: none;\'}">0</span>', content, flags=re.DOTALL)

# Remove the JS event handler for addToCart globally since we now post the form directly
with open(path_navbar, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated layout.html and navbar.html")
