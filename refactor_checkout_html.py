import re

path = 'src/main/resources/templates/storefront/checkout/checkout.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace address section
address_section = """
<div class="checkout-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="fw-bold text-dark mb-0"><i class="bi bi-geo-alt text-cyan me-2"></i>Địa chỉ nhận hàng</h5>
        <button type="button" class="btn btn-sm btn-outline-cyan rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#addressModal">Thay đổi</button>
    </div>
    <div id="checkoutAddressContainer">
        <!-- Render the selected address -->
        <div th:if="${not #lists.isEmpty(addresses)}">
            <div th:each="addr : ${addresses}" th:if="${addr.isDefault}" class="d-flex flex-column">
                <span class="fw-bold text-dark mb-1" th:text="${addr.fullName} + ' | ' + ${addr.phone}">Name | Phone</span>
                <span class="text-muted text-sm" th:text="${addr.addressLine} + ', ' + ${addr.ward} + ', ' + ${addr.district} + ', ' + ${addr.city}">Address Line</span>
                <span th:if="${addr.note != null}" class="text-muted text-sm mt-1" th:text="'Ghi chú: ' + ${addr.note}">Note</span>
            </div>
            <div th:unless="${#lists.isEmpty(addresses) or #lists.size(addresses.?[isDefault]) > 0}" th:with="addr=${addresses[0]}" class="d-flex flex-column">
                <span class="fw-bold text-dark mb-1" th:text="${addr.fullName} + ' | ' + ${addr.phone}">Name | Phone</span>
                <span class="text-muted text-sm" th:text="${addr.addressLine} + ', ' + ${addr.ward} + ', ' + ${addr.district} + ', ' + ${addr.city}">Address Line</span>
            </div>
        </div>
        <div th:if="${#lists.isEmpty(addresses)}">
            <span class="text-danger">Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ trong Profile!</span>
        </div>
    </div>
</div>
"""
content = re.sub(r'<div class="checkout-card">\s*<div class="d-flex justify-content-between align-items-center mb-4">\s*<h5 class="fw-bold text-dark mb-0"><i class="bi bi-geo-alt text-cyan me-2"></i>Địa chỉ nhận hàng</h5>.*?</div>\s*</div>', address_section, content, flags=re.DOTALL)

# Replace items section
items_section = """
<div class="checkout-card">
    <h5 class="fw-bold text-dark mb-4"><i class="bi bi-box-seam text-cyan me-2"></i>Sản phẩm đơn hàng</h5>
    <div id="checkoutItemsContainer">
        <div th:each="item : ${selectedItems}" class="d-flex gap-3 mb-3 border-bottom border-light pb-3">
            <div class="checkout-item-img rounded-3 overflow-hidden border bg-white flex-shrink-0" style="width: 70px; height: 70px;">
                <img th:src="${item.product.primaryImagePath}" class="w-100 h-100" style="object-fit: cover;"/>
            </div>
            <div class="d-flex flex-column flex-grow-1 min-w-0">
                <h3 class="h6 fw-bold text-dark mb-1 text-truncate" th:text="${item.product.name}">Product Name</h3>
                <span class="text-muted text-sm mb-1" th:text="${item.variant.size} + ' - ' + ${item.variant.color} + ' | ' + ${item.store.name}">Variant | Store</span>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="fw-bold text-dark" th:text="${#numbers.formatDecimal(item.unitPrice, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
                    <span class="text-muted-custom fw-medium" th:text="'x' + ${item.quantity}">x1</span>
                </div>
            </div>
        </div>
    </div>
</div>
"""
content = re.sub(r'<div class="checkout-card">\s*<h5 class="fw-bold text-dark mb-4"><i class="bi bi-box-seam text-cyan me-2"></i>Sản phẩm đơn hàng</h5>.*?</div>\s*</div>', items_section, content, flags=re.DOTALL)

# Modify the summary section to calculate total
# Thymeleaf doesn't have an easy way to reduce across a list. We can calculate it in Controller, or do a hack.
# I will just write Thymeleaf for now if possible, but actually we can just compute it in JS based on DOM elements OR we can do it in the Controller.
# Wait, computing it in the Controller is much safer!
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated checkout.html")
