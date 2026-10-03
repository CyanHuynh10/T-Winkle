import os

base_dir = r'D:\Cyan\Project\T-Winkle'
history_html = os.path.join(base_dir, 'src', 'main', 'resources', 'templates', 'storefront', 'order', 'history.html')

with open(history_html, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove style="display: none;" from empty state
content = re.sub(r'<div id="emptyOrderState" class="text-center py-5" style="display: none;">',
                 r'<div id="emptyOrderState" class="text-center py-5" th:if="">', content)

grid_start = '<div id="orderGrid" class="row g-4" style="display: none;">\n                    <!-- JS will render order cards here -->\n                </div>'
new_grid = '''<div id="orderGrid" class="row g-4">
                    <div class="col-12 col-md-6 col-lg-4" th:each="order : ">
                        <div class="order-card">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <div class="fw-bold text-dark fs-5" th:text="">TW-123456</div>
                                    <div class="text-muted text-sm mt-1" th:text="">Date</div>
                                </div>
                            </div>
                            <div class="mb-4">
                                <span class="badge px-2 py-1 border rounded-pill"
                                      th:classappend=" ? 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25' : 
                                      ( ? 'bg-success bg-opacity-10 text-success border-success border-opacity-25' : 
                                      'bg-info bg-opacity-10 text-info border-info border-opacity-25')">
                                    <i class="bi me-1" th:classappend=" ? 'bi-x-circle' : ( ? 'bi-box-seam' : 'bi-info-circle')"></i>
                                    <span th:text="">Status</span>
                                </span>
                            </div>
                            <div class="mt-auto pt-3 border-top border-light">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="text-muted-custom">Tổng sản phẩm</span>
                                    <span class="fw-semibold text-dark" th:text="">0</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <span class="text-muted-custom">Tổng tiền</span>
                                    <span class="fw-bold text-cyan fs-5" th:text=" + '₫'">0₫</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <a th:href="@{'/orders/' + }" class="btn btn-light text-dark rounded-pill flex-grow-1 fw-medium border shadow-sm">Xem chi tiết</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>'''

content = content.replace(grid_start, new_grid)

# Remove the JS script tag for renderOrderHistory
content = re.sub(r'<script>\s*let currentOrderPage = 1;.*?</script>', '', content, flags=re.DOTALL)

with open(history_html, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated order/history.html")
