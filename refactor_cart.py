import re

path = 'src/main/resources/templates/storefront/cart/cart.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace #cartContent
cart_content_replacement = """
                <!-- Cart Content -->
                <div id="cartContent" class="row gy-4 justify-content-center" th:if="${not #maps.isEmpty(groupedCart)}">
                    <div class="col-12" style="max-width: 800px; margin: 0 auto;">
                        <div id="cartGroupsContainer">
                            <!-- Loop through each store group -->
                            <div th:each="entry : ${groupedCart}" class="cart-main-card mb-4" style="padding: 1.25rem;">
                                <div class="store-group-header mb-3" style="background: rgba(248, 250, 252, 0.5); padding: 0.75rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 0.5rem; font-weight: 700; border: 1px solid rgba(226, 232, 240, 0.6);">
                                    <i class="bi bi-shop text-cyan fs-5"></i>
                                    <span class="text-dark fs-6" th:text="${entry.key.name}">Store Name</span>
                                </div>
                                <div class="store-items">
                                    <div th:each="item, stat : ${entry.value}" class="cart-item-row d-flex gap-3 align-items-center py-3" th:style="${not stat.last} ? 'border-bottom: 1px solid rgba(226, 232, 240, 0.6);' : ''">
                                        <!-- Select Checkbox -->
                                        <div class="form-check m-0 p-0 d-flex align-items-center">
                                            <form th:action="@{/cart/toggle-select}" method="POST" class="m-0 p-0" th:id="'toggleForm_' + ${item.id}">
                                                <input type="hidden" name="cartItemId" th:value="${item.id}" />
                                                <input type="hidden" name="isSelected" th:value="${!item.selected}" />
                                                <input class="form-check-input cursor-pointer shadow-none m-0" type="checkbox" style="width: 1.25rem; height: 1.25rem; border-color: #CBD5E1;" th:checked="${item.selected}" th:onchange="'document.getElementById(\'toggleForm_' + ${item.id} + '\').submit();'">
                                            </form>
                                        </div>
                                        
                                        <!-- Image -->
                                        <div class="cart-item-img rounded-3 overflow-hidden border bg-white flex-shrink-0" style="width: 80px; height: 80px; cursor: pointer;" th:onclick="'window.location.href=\\'/categories/p?keyword=' + ${item.product.name} + '\\''">
                                            <img th:src="${item.product.primaryImagePath}" class="w-100 h-100" style="object-fit: cover;" th:if="${item.product.primaryImagePath != null}"/>
                                            <i th:unless="${item.product.primaryImagePath != null}" class="bi bi-image text-muted opacity-25" style="font-size: 2rem;"></i>
                                        </div>
                                        
                                        <!-- Info -->
                                        <div class="d-flex flex-column flex-grow-1 min-w-0">
                                            <h3 class="h6 fw-bold text-dark mb-1 text-truncate" th:text="${item.product.name}" style="cursor: pointer;" th:onclick="'window.location.href=\\'/categories/p?keyword=' + ${item.product.name} + '\\''">Product</h3>
                                            <span class="badge bg-light text-dark border px-2 py-1 mb-1" style="width: fit-content; align-self: flex-start;" th:text="${item.variant.size} + ' - ' + ${item.variant.color}">Variant</span>
                                            
                                            <div class="d-flex align-items-center justify-content-between mt-2 flex-wrap gap-2">
                                                <div class="d-flex flex-column">
                                                    <span class="fw-bold text-dark" th:text="${#numbers.formatDecimal(item.unitPrice, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
                                                </div>
                                                
                                                <div class="d-flex align-items-center gap-3">
                                                    <!-- Quantity Update -->
                                                    <form th:action="@{/cart/update}" method="POST" class="d-flex align-items-center rounded-pill border bg-white overflow-hidden p-1 shadow-sm" style="height: 36px; width: 100px;">
                                                        <input type="hidden" name="cartItemId" th:value="${item.id}" />
                                                        <button type="button" class="btn btn-sm btn-link text-dark text-decoration-none px-2 py-0 border-0 fs-5 d-flex align-items-center justify-content-center" style="height: 100%;" th:onclick="'if(this.nextElementSibling.value > 1) { this.nextElementSibling.value--; this.form.submit(); }'">-</button>
                                                        <input type="number" name="quantity" class="form-control form-control-sm text-center border-0 p-0 fw-bold bg-white text-dark shadow-none" th:value="${item.quantity}" style="width: 30px; font-size: 0.9rem;" readonly>
                                                        <button type="button" class="btn btn-sm btn-link text-dark text-decoration-none px-2 py-0 border-0 fs-5 d-flex align-items-center justify-content-center" style="height: 100%;" th:onclick="'this.previousElementSibling.value++; this.form.submit();'">+</button>
                                                    </form>
                                                    
                                                    <!-- Remove Button -->
                                                    <form th:action="@{/cart/remove}" method="POST" class="m-0 p-0">
                                                        <input type="hidden" name="cartItemId" th:value="${item.id}" />
                                                        <button type="submit" class="btn btn-sm btn-light text-danger rounded-circle shadow-sm d-flex align-items-center justify-content-center hover-scale" style="width: 36px; height: 36px;">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between mt-4">
                            <a th:href="@{/categories}" class="btn btn-link text-decoration-none text-muted hover-cyan px-0 fw-medium">
                                <i class="bi bi-arrow-left me-2"></i>Tiếp tục mua sắm
                            </a>
                        </div>
                    </div>

                    <!-- Payment Button -->
                    <!-- Calculate selected total sum inside thymeleaf? Since we can't easily loop here without setting variables, we just always show the checkout button if there are items, but disable if none selected -->
                    <div class="col-12 mt-4 text-center">
                        <a th:href="@{/checkout}" id="checkoutBtn" class="tw-btn btn-checkout-primary rounded-pill py-3 px-5 fw-bold fs-5 shadow text-decoration-none d-inline-block">
                            Thanh toán
                        </a>
                    </div>
                </div>
"""

content = re.sub(r'<!-- Cart Content -->.*?</div>\s*</div>\s*</main>', cart_content_replacement + '\n</div>\n</main>', content, flags=re.DOTALL)

# Empty State fallback if empty map
empty_state_replacement = """
                <!-- Empty State -->
                <div id="cartEmptyState" class="text-center py-5 animate-fade-up" th:if="${#maps.isEmpty(groupedCart)}">
                    <div class="mb-4 d-flex justify-content-center">
                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-inner" style="width: 140px; height: 140px; position: relative;">
                            <i class="bi bi-cart-x text-muted-custom" style="font-size: 4rem;"></i>
                        </div>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-3">Giỏ hàng trống</h3>
                    <p class="text-muted-custom mb-4 max-w-md mx-auto">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ. Hãy khám phá các bộ sưu tập mới nhất của chúng tôi!</p>
                    <a th:href="@{/categories}" class="tw-btn tw-btn-primary rounded-pill px-5 py-3 text-decoration-none d-inline-flex align-items-center gap-2 shadow-sm hover-lift fw-bold">
                        Khám phá sản phẩm
                    </a>
                </div>
"""
content = re.sub(r'<!-- Empty State -->.*?<!-- Cart Content -->', empty_state_replacement + '\n<!-- Cart Content -->', content, flags=re.DOTALL)

# Remove all cart.html JS that managed the fake cart
content = re.sub(r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\', \(\) => \{\s*const renderCartPage.*?function proceedToCheckout\(\).*?\}\);\s*</script>', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated cart.html")
