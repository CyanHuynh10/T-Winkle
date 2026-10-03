import re

path = 'src/main/resources/templates/storefront/order/history.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Order Grid block with thymeleaf iterators over orderPage.content
grid_replacement = """
                <div class="row g-4 mb-5" id="orderGrid" th:if="${!orderPage.empty}">
                    <div th:each="order : ${orderPage.content}" class="col-12 col-md-6 col-lg-4">
                        <div class="order-card">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <span class="text-xs text-muted-custom fw-medium mb-1 d-block" th:text="${#temporals.format(order.createdAt, 'dd/MM/yyyy HH:mm')}">Time</span>
                                    <h3 class="h6 fw-bold text-dark mb-0" th:text="'#' + ${order.orderCode}">#CODE</h3>
                                </div>
                                <span th:classappend="${order.status == 'Chờ xác nhận' ? 'bg-warning text-dark border-warning' : (order.status == 'Hoàn thành' ? 'bg-success text-success border-success' : (order.status == 'Đã hủy' ? 'bg-danger text-danger border-danger' : 'bg-primary text-primary border-primary'))} + ' bg-opacity-10 px-2 py-1 border border-opacity-25 rounded-pill badge'">
                                    <i th:classappend="${order.status == 'Chờ xác nhận' ? 'bi-clock-history' : (order.status == 'Hoàn thành' ? 'bi-check-circle' : (order.status == 'Đã hủy' ? 'bi-x-circle' : 'bi-truck'))} + ' me-1'"></i>
                                    <span th:text="${order.status}">Status</span>
                                </span>
                            </div>
                            
                            <div class="d-flex align-items-center gap-3 mb-3 bg-light p-2 rounded-3">
                                <div class="order-img-wrapper rounded-3 overflow-hidden border bg-white flex-shrink-0" style="width: 60px; height: 60px;" th:if="${not #lists.isEmpty(order.orderItems)}">
                                    <img th:src="${order.orderItems[0].imageUrl}" class="w-100 h-100" style="object-fit: cover;" th:if="${order.orderItems[0].imageUrl != null}"/>
                                    <i th:unless="${order.orderItems[0].imageUrl != null}" class="bi bi-image text-muted opacity-25" style="font-size: 1.5rem;"></i>
                                </div>
                                <div class="flex-grow-1 min-w-0" th:if="${not #lists.isEmpty(order.orderItems)}">
                                    <div class="text-sm fw-bold text-dark text-truncate mb-1" th:text="${order.orderItems[0].productName}">Product</div>
                                    <div class="text-xs text-muted-custom" th:text="${#lists.size(order.orderItems) > 1 ? ('và ' + (#lists.size(order.orderItems) - 1) + ' sản phẩm khác') : ''}"></div>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25 pt-3">
                                <div class="d-flex flex-column">
                                    <span class="text-xs text-muted-custom mb-1">Tổng tiền</span>
                                    <span class="fw-bold text-cyan" th:text="${#numbers.formatDecimal(order.total, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
                                </div>
                                <a th:href="@{'/orders/' + ${order.id}}" class="tw-btn btn-outline-cyan btn-sm rounded-pill px-3 py-1 fw-medium text-decoration-none">
                                    Chi tiết <i class="bi bi-chevron-right ms-1 text-xs"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
"""
content = re.sub(r'<div class="row g-4 mb-5" id="orderGrid">.*?</div>\s*<!-- Pagination -->', grid_replacement + '\n<!-- Pagination -->', content, flags=re.DOTALL)

empty_replacement = """
                <div id="orderEmptyState" class="text-center py-5" th:if="${orderPage.empty}">
                    <div class="mb-4 d-flex justify-content-center">
                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-inner" style="width: 140px; height: 140px;">
                            <i class="bi bi-box-seam text-muted-custom" style="font-size: 4rem;"></i>
                        </div>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-3">Chưa có đơn hàng nào</h3>
                    <p class="text-muted-custom mb-4 max-w-md mx-auto">Bạn chưa thực hiện giao dịch nào. Khám phá ngay các sản phẩm mới nhất của T-Winkle!</p>
                    <a th:href="@{/categories}" class="tw-btn tw-btn-primary rounded-pill px-5 py-3 text-decoration-none d-inline-flex align-items-center gap-2 shadow-sm fw-bold">
                        Bắt đầu mua sắm
                    </a>
                </div>
"""
content = re.sub(r'<div id="orderEmptyState" class="text-center py-5" style="display: none;">.*?</div>\s*<!-- Order Grid -->', empty_replacement + '\n<!-- Order Grid -->', content, flags=re.DOTALL)

# Add pagination properly
pagination = """
                <div id="orderPaginationContainer" class="d-flex justify-content-center align-items-center gap-2" th:if="${orderPage.totalPages > 1}">
                    <a th:if="${!orderPage.first}" th:href="@{/orders(page=${orderPage.number - 1})}" class="btn btn-outline-secondary btn-sm shadow-none"><i class="bi bi-chevron-left"></i></a>
                    <th:block th:each="i : ${#numbers.sequence(0, orderPage.totalPages - 1)}">
                        <span th:if="${i == orderPage.number}" class="btn btn-primary btn-sm shadow-none disabled" th:text="${i + 1}">1</span>
                        <a th:unless="${i == orderPage.number}" th:href="@{/orders(page=${i})}" class="btn btn-outline-secondary btn-sm shadow-none" th:text="${i + 1}">2</a>
                    </th:block>
                    <a th:if="${!orderPage.last}" th:href="@{/orders(page=${orderPage.number + 1})}" class="btn btn-outline-secondary btn-sm shadow-none"><i class="bi bi-chevron-right"></i></a>
                </div>
"""
content = re.sub(r'<div id="orderPaginationContainer" class="d-flex justify-content-center align-items-center gap-2">.*?</div>\s*</div>\s*</main>', pagination + '\n</div>\n</main>', content, flags=re.DOTALL)


# Remove the JS that generates the mock grid!
content = re.sub(r'<script>\s*let currentOrderPage = 1;.*?// Utilities for status colors.*?function submitCancellation\(\) \{.*?\}\s*</script>', '', content, flags=re.DOTALL)
# And the other <script> tag for JS
content = re.sub(r'<script src="/js/order-handler\.js"></script>', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated history.html")
