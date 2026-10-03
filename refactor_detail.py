import re

path = 'src/main/resources/templates/storefront/order/detail.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Order ID in header
content = re.sub(r'<h1 class="h3 fw-bold text-dark mb-0">\s*Đơn hàng <span class="text-cyan">#<span id="headerOrderId">.*?</span></span>\s*</h1>', '<h1 class="h3 fw-bold text-dark mb-0">Đơn hàng <span class="text-cyan">#<span th:text="${order.orderCode}"></span></span></h1>', content, flags=re.DOTALL)
content = re.sub(r'<span class="text-muted-custom" id="headerOrderDate">.*?</span>', '<span class="text-muted-custom" th:text="${#temporals.format(order.createdAt, \'dd/MM/yyyy HH:mm\')}">Date</span>', content)

# Status header
content = re.sub(r'<div class="d-flex flex-column align-items-end" id="headerOrderStatus">.*?</div>', '<div class="d-flex flex-column align-items-end" id="headerOrderStatus"><span th:classappend="${order.status == \'Chờ xác nhận\' ? \'bg-warning text-dark border-warning\' : (order.status == \'Hoàn thành\' ? \'bg-success text-success border-success\' : (order.status == \'Đã hủy\' ? \'bg-danger text-danger border-danger\' : \'bg-primary text-primary border-primary\'))} + \' bg-opacity-10 px-3 py-2 border border-opacity-25 rounded-pill fw-bold badge fs-6\'" th:text="${order.status}">Status</span></div>', content, flags=re.DOTALL)


# Address details
address_html = """
<div class="checkout-card mb-4">
    <h5 class="fw-bold text-dark mb-3"><i class="bi bi-geo-alt text-cyan me-2"></i>Địa chỉ nhận hàng</h5>
    <div class="d-flex flex-column">
        <span class="fw-bold text-dark mb-1" th:text="${order.recipientName} + ' | ' + ${order.recipientPhone}">Name | Phone</span>
        <span class="text-muted text-sm" th:text="${order.shippingAddressLine} + ', ' + ${order.shippingWard} + ', ' + ${order.shippingDistrict} + ', ' + ${order.shippingCity}">Address</span>
        <span class="text-muted text-sm mt-1" th:if="${order.shippingNote != null and !order.shippingNote.isEmpty()}" th:text="'Ghi chú: ' + ${order.shippingNote}">Note</span>
    </div>
</div>
"""
content = re.sub(r'<div class="checkout-card mb-4">\s*<h5 class="fw-bold text-dark mb-3"><i class="bi bi-geo-alt text-cyan me-2"></i>Địa chỉ nhận hàng</h5>.*?</div>', address_html, content, flags=re.DOTALL)

# Items
items_html = """
<div class="checkout-card mb-4">
    <h5 class="fw-bold text-dark mb-4"><i class="bi bi-box-seam text-cyan me-2"></i>Sản phẩm đơn hàng</h5>
    <div id="detailItemsContainer">
        <div th:each="item : ${order.orderItems}" class="d-flex gap-3 mb-3 border-bottom border-light pb-3">
            <div class="checkout-item-img rounded-3 overflow-hidden border bg-white flex-shrink-0" style="width: 70px; height: 70px;">
                <img th:src="${item.imageUrl}" class="w-100 h-100" style="object-fit: cover;" th:if="${item.imageUrl != null}"/>
                <i th:unless="${item.imageUrl != null}" class="bi bi-image text-muted opacity-25" style="font-size: 2rem;"></i>
            </div>
            <div class="d-flex flex-column flex-grow-1 min-w-0">
                <h3 class="h6 fw-bold text-dark mb-1 text-truncate" th:text="${item.productName}">Product Name</h3>
                <span class="text-muted text-sm mb-1" th:text="${item.variantName} + ' | ' + ${item.store.name}">Variant | Store</span>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="fw-bold text-dark" th:text="${#numbers.formatDecimal(item.unitPrice, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
                    <span class="text-muted-custom fw-medium" th:text="'x' + ${item.quantity}">x1</span>
                </div>
                <!-- Review Button if completed -->
                <a th:if="${order.status == 'Hoàn thành'}" class="btn btn-outline-cyan btn-sm rounded-pill mt-2 fw-medium" style="width: max-content;" th:href="@{'/products/' + ${item.product.id}}">Đánh giá</a>
            </div>
        </div>
    </div>
</div>
"""
content = re.sub(r'<div class="checkout-card mb-4">\s*<h5 class="fw-bold text-dark mb-4"><i class="bi bi-box-seam text-cyan me-2"></i>Sản phẩm đơn hàng</h5>.*?</div>\s*</div>', items_html, content, flags=re.DOTALL)

# Summary
summary_html = """
<div class="checkout-card position-sticky" style="top: 2rem;">
    <h5 class="fw-bold text-dark mb-4 pb-3 border-bottom border-light">Tổng kết đơn hàng</h5>
    
    <div class="d-flex justify-content-between mb-3">
        <span class="text-muted-custom">Tạm tính</span>
        <span class="fw-semibold text-dark" th:text="${#numbers.formatDecimal(order.subtotal, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
    </div>
    <div class="d-flex justify-content-between mb-3">
        <span class="text-muted-custom">Khuyến mãi (Sản phẩm)</span>
        <span class="fw-semibold text-danger" th:text="'- ' + ${#numbers.formatDecimal(order.productDiscount, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
    </div>
    <div class="d-flex justify-content-between mb-3">
        <span class="text-muted-custom">Phí vận chuyển</span>
        <span class="fw-semibold text-dark" th:text="${#numbers.formatDecimal(order.shippingFee, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
    </div>
    <div class="d-flex justify-content-between mb-4" th:if="${order.couponDiscount > 0}">
        <span class="text-muted-custom">Mã giảm giá</span>
        <span class="fw-semibold text-danger" th:text="'- ' + ${#numbers.formatDecimal(order.couponDiscount, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
    </div>
    
    <div class="border-top border-light pt-3 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-dark fs-5">Tổng thanh toán</span>
            <span class="fw-bold text-cyan fs-4" th:text="${#numbers.formatDecimal(order.total, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
        </div>
        <small class="text-muted text-xs d-block text-end">(Đã bao gồm VAT nếu có)</small>
    </div>
    
    <div class="p-3 bg-light rounded-3 mb-4">
        <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-credit-card text-muted-custom"></i>
            <span class="fw-medium text-dark text-sm">Phương thức thanh toán</span>
        </div>
        <div class="fw-bold text-dark" th:text="${order.paymentMethod == 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}">COD</div>
    </div>
    
    <!-- Action buttons -->
    <a th:href="@{'/orders/' + ${order.id} + '/tracking'}" class="tw-btn btn-checkout-primary w-100 rounded-pill py-3 text-decoration-none fw-bold fs-6 d-flex justify-content-center align-items-center gap-2 mb-3">
        Theo dõi đơn hàng
    </a>

    <button th:if="${order.status == 'Chờ xác nhận' or order.status == 'Đang xử lý'}" class="btn btn-outline-danger w-100 rounded-pill py-2 fw-medium shadow-none mb-3" data-bs-toggle="modal" data-bs-target="#cancelOrderModal">
        Hủy đơn hàng
    </button>
</div>
"""
content = re.sub(r'<div class="checkout-card position-sticky" style="top: 2rem;">\s*<h5 class="fw-bold text-dark mb-4 pb-3 border-bottom border-light">Tổng kết đơn hàng</h5>.*?</div>\s*</div>', summary_html, content, flags=re.DOTALL)

# Delete modal and script
content = re.sub(r'<div class="modal fade" id="productDetailModal".*?<!-- Tracking Modal -->', '<!-- Tracking Modal -->', content, flags=re.DOTALL)
content = re.sub(r'<script>\s*const currentOrderId =.*?function renderOrderDetail\(\).*?</script>', '', content, flags=re.DOTALL)
content = re.sub(r'<script src="/js/order-handler\.js"></script>', '', content, flags=re.DOTALL)

# Also fix the cancel form!
cancel_form = """
<div class="modal-body p-4 p-md-5">
    <div class="mb-4 text-center">
        <i class="bi bi-x-circle text-danger" style="font-size: 3rem;"></i>
        <h4 class="fw-bold text-dark mt-3">Yêu cầu hủy đơn hàng</h4>
        <p class="text-muted-custom text-sm">Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này.</p>
    </div>
    <form th:action="@{'/orders/' + ${order.id} + '/cancel'}" method="POST">
        <div class="d-flex flex-column gap-2 mb-4" id="cancelReasonsContainer">
            <div class="form-check custom-radio">
                <input class="form-check-input" type="radio" name="reason" id="reason1" value="Thay đổi ý định mua" checked>
                <label class="form-check-label text-dark" for="reason1">Thay đổi ý định mua</label>
            </div>
            <div class="form-check custom-radio">
                <input class="form-check-input" type="radio" name="reason" id="reason2" value="Tìm thấy giá rẻ hơn ở nơi khác">
                <label class="form-check-label text-dark" for="reason2">Tìm thấy giá rẻ hơn ở nơi khác</label>
            </div>
            <div class="form-check custom-radio">
                <input class="form-check-input" type="radio" name="reason" id="reason3" value="Đổi địa chỉ giao hàng">
                <label class="form-check-label text-dark" for="reason3">Đổi địa chỉ giao hàng</label>
            </div>
            <div class="form-check custom-radio">
                <input class="form-check-input" type="radio" name="reason" id="reason7" value="Khác" onchange="document.getElementById('customReasonInput').style.display = this.checked ? 'block' : 'none';">
                <label class="form-check-label text-dark" for="reason7">Khác</label>
            </div>
            <textarea id="customReasonInput" name="otherReason" class="form-control rounded-4 shadow-none mt-2" rows="3" placeholder="Nhập lý do của bạn..." style="display: none; resize: none;"></textarea>
        </div>
        <div class="d-flex gap-3">
            <button type="button" class="btn btn-light rounded-pill py-2 w-50 fw-bold shadow-none" data-bs-dismiss="modal">Không, giữ lại</button>
            <button type="submit" class="btn btn-danger rounded-pill py-2 w-50 fw-bold shadow-none">Xác nhận hủy</button>
        </div>
    </form>
</div>
"""
content = re.sub(r'<div class="modal-body p-4 p-md-5">.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</body>', cancel_form + '\n</div>\n</div>\n</div>\n</div>\n</body>', content, flags=re.DOTALL)


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated detail.html")
