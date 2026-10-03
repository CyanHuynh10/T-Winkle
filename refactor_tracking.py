import re

path = 'src/main/resources/templates/storefront/order/tracking.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace header
content = re.sub(r'<h1 class="h3 fw-bold text-dark mb-0">\s*Theo dõi đơn hàng <span class="text-cyan">#<span id="headerOrderId">.*?</span></span>\s*</h1>', '<h1 class="h3 fw-bold text-dark mb-0">Theo dõi đơn hàng <span class="text-cyan">#<span th:text="${order.orderCode}"></span></span></h1>', content, flags=re.DOTALL)
content = re.sub(r'<span class="text-muted-custom" id="headerOrderDate">.*?</span>', '<span class="text-muted-custom" th:text="${#temporals.format(order.createdAt, \'dd/MM/yyyy HH:mm\')}">Date</span>', content)

# Tracking line
tracking_html = """
<div class="checkout-card mb-4">
    <div class="tracking-container py-3">
        <!-- Loop trackingHistory -->
        <div th:each="history, stat : ${trackingHistory}" class="tracking-item d-flex gap-4 mb-4" th:classappend="${stat.first ? 'active' : ''}">
            <div class="tracking-icon flex-shrink-0 d-flex flex-column align-items-center">
                <div class="icon-circle rounded-circle d-flex align-items-center justify-content-center shadow-sm" th:classappend="${stat.first ? 'bg-cyan text-white' : 'bg-light text-muted-custom'}" style="width: 48px; height: 48px;">
                    <i th:classappend="${history.status == 'Chờ xác nhận' ? 'bi-clock-history' : (history.status == 'Đang xử lý' ? 'bi-box-seam' : (history.status == 'Đang giao' ? 'bi-truck' : (history.status == 'Đã hủy' ? 'bi-x-circle' : 'bi-check-circle')))} + ' fs-4'"></i>
                </div>
                <!-- Connector line if not last -->
                <div th:if="${!stat.last}" class="tracking-line flex-grow-1 my-2" th:classappend="${stat.first ? 'bg-cyan' : 'bg-light'}" style="width: 2px; min-height: 40px; border-radius: 2px;"></div>
            </div>
            <div class="tracking-content pb-3">
                <h5 class="fw-bold mb-1" th:classappend="${stat.first ? 'text-cyan' : 'text-dark'}" th:text="${history.status}">Status</h5>
                <p class="text-sm text-muted-custom mb-1" th:text="${history.note}">Note</p>
                <span class="text-xs text-muted-custom fw-medium" th:text="${#temporals.format(history.createdAt, 'dd/MM/yyyy HH:mm')}">Date</span>
            </div>
        </div>
    </div>
</div>
"""
content = re.sub(r'<div class="checkout-card mb-4">\s*<div class="tracking-container py-3" id="trackingContainer">.*?</div>\s*</div>', tracking_html, content, flags=re.DOTALL)

# Delete JS
content = re.sub(r'<script>\s*const currentOrderId =.*?function renderTrackingDetail\(\).*?</script>', '', content, flags=re.DOTALL)
content = re.sub(r'<script src="/js/order-handler\.js"></script>', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated tracking.html")
