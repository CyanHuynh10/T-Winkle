import re

def modify():
    with open('D:/Cyan/Project/T-Winkle/src/main/resources/templates/storefront/order/history.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Empty State
    content = content.replace('id="orderEmptyState" class="order-card align-items-center justify-content-center text-center py-5 mx-auto" style="display: none;',
                              'id="orderEmptyState" class="order-card align-items-center justify-content-center text-center py-5 mx-auto" th:if="${orderPage.empty}" style="')
                              
    # Grid
    content = content.replace('id="orderGrid" class="row g-4"', 'id="orderGrid" class="row g-4" th:unless="${orderPage.empty}"')
    
    # Loop
    content = content.replace('th:each="order : "', 'th:each="order : ${orderPage.content}"')
    
    # Order Code
    content = content.replace('<div class="fw-bold text-dark fs-5" th:text="">TW-123456</div>', '<div class="fw-bold text-dark fs-5" th:text="${order.orderCode}">TW-123456</div>')
    
    # Date
    content = content.replace('<div class="text-muted text-sm mt-1" th:text="">Date</div>', '<div class="text-muted text-sm mt-1" th:text="${#temporals.format(order.createdAt, \'dd/MM/yyyy HH:mm\')}">Date</div>')
    
    # Status
    status_classappend = '''th:classappend="${order.status == 'Đã hủy'} ? 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25' : 
                                      (${order.status == 'Đã giao'} ? 'bg-success bg-opacity-10 text-success border-success border-opacity-25' : 
                                      'bg-info bg-opacity-10 text-info border-info border-opacity-25')"'''
    
    content = re.sub(r'th:classappend=" \? \'bg-danger[^"]+"', status_classappend, content)
    
    status_icon_classappend = '''th:classappend="${order.status == 'Đã hủy'} ? 'bi-x-circle' : (${order.status == 'Đã giao'} ? 'bi-box-seam' : 'bi-info-circle')"'''
    content = re.sub(r'th:classappend=" \? \'bi-x-circle\'[^"]+"', status_icon_classappend, content)
    
    content = content.replace('<span th:text="">Status</span>', '<span th:text="${order.status}">Status</span>')
    
    # Product count
    content = content.replace('<span class="fw-semibold text-dark" th:text="">0</span>', '<span class="fw-semibold text-dark" th:text="${#lists.size(order.orderItems)}">0</span>')
    
    # Total
    content = content.replace('<span class="fw-bold text-cyan fs-5" th:text=" + \'₫\'">0₫</span>', '<span class="fw-bold text-cyan fs-5" th:text="${#numbers.formatDecimal(order.total, 0, \'COMMA\', 0, \'POINT\')} + \'đ\'">0₫</span>')
    
    # Link
    content = content.replace('th:href="@{\'/orders/\' + }"', 'th:href="@{\'/orders/\' + ${order.id}}"')
    
    # Pagination
    pagination_html = '''
                <div id="orderPaginationContainer" class="d-flex justify-content-center align-items-center gap-2 mt-5" th:if="${orderPage.totalPages > 1}">
                    <a th:href="@{/orders(page=${orderPage.number - 1})}" th:classappend="${orderPage.first} ? 'disabled' : ''" class="btn btn-outline-cyan rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="bi bi-chevron-left"></i></a>
                    <span class="text-muted-custom fw-medium">Trang <span th:text="${orderPage.number + 1}"></span> / <span th:text="${orderPage.totalPages}"></span></span>
                    <a th:href="@{/orders(page=${orderPage.number + 1})}" th:classappend="${orderPage.last} ? 'disabled' : ''" class="btn btn-outline-cyan rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="bi bi-chevron-right"></i></a>
                </div>
    '''
    content = re.sub(r'<div id="orderPaginationContainer"[\s\S]*?</div>', pagination_html.strip(), content)

    with open('D:/Cyan/Project/T-Winkle/src/main/resources/templates/storefront/order/history.html', 'w', encoding='utf-8') as f:
        f.write(content)

modify()
