import re
import sys

def modify():
    with open('D:/Cyan/Project/T-Winkle/src/main/resources/templates/storefront/order/detail.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Remove the hidden input and modify heading
    content = re.sub(r'<!-- Hidden order ID from Thymeleaf -->[\s\S]*?<input type="hidden" id="pageOrderId"[^>]*>', '', content)
    
    # 2. Modify Not Found State
    content = content.replace('id="orderNotFoundState" class="detail-card', 'id="orderNotFoundState" th:if="${order == null}" class="detail-card')
    content = content.replace('style="display: none; min-height: 400px; max-width: 800px;"', 'style="min-height: 400px; max-width: 800px;"')

    # 3. Modify Detail Content Container
    content = content.replace('id="orderDetailContent" class="row gy-4" style="display: none;"', 'id="orderDetailContent" class="row gy-4" th:unless="${order == null}"')

    # 4. Status Card
    content = content.replace('<span id="dtlOrderId" class="text-cyan"></span>', '<span id="dtlOrderId" class="text-cyan" th:text="${order.id}"></span>')
    content = content.replace('<div class="text-muted text-sm" id="dtlDate"></div>', '<div class="text-muted text-sm" id="dtlDate" th:text="\'Đặt lúc: \' + ${#temporals.format(order.createdAt, \'dd/MM/yyyy HH:mm\')}"></div>')
    
    status_html = '''
                                    <span class="badge px-3 py-2 border border-opacity-25 rounded-pill fs-6"
                                          th:classappend="${order.status == 'Chờ xác nhận' ? 'bg-warning bg-opacity-10 text-warning border-warning' : (order.status == 'Đã giao' ? 'bg-success bg-opacity-10 text-success border-success' : (order.status == 'Đã hủy' ? 'bg-danger bg-opacity-10 text-danger border-danger' : 'bg-primary bg-opacity-10 text-primary border-primary'))}">
                                        <i class="bi me-2" th:classappend="${order.status == 'Chờ xác nhận' ? 'bi-clock-history' : (order.status == 'Đã giao' ? 'bi-check-circle' : (order.status == 'Đã hủy' ? 'bi-x-circle' : 'bi-truck'))}"></i>
                                        <span th:text="${order.status}"></span>
                                    </span>
    '''
    content = re.sub(r'<div class="mt-3 mt-md-0 text-md-end" id="dtlStatusContainer">[\s\S]*?</div>', f'<div class="mt-3 mt-md-0 text-md-end" id="dtlStatusContainer">{status_html}</div>', content)
    content = content.replace('id="dtlPendingCancel" style="display: none;"', 'id="dtlPendingCancel" style="display: none;"') # Keep it hidden

    # Address Card
    addr_html = '''
                                <div class="fw-bold mb-1"><span th:text="${order.recipientName}"></span> <span class="text-muted mx-2">|</span> <span th:text="${order.recipientPhone}"></span></div>
                                <div class="text-muted-custom" th:text="${order.shippingAddressLine}"></div>
                                <div class="text-muted-custom"><span th:text="${order.shippingWard}"></span>, <span th:text="${order.shippingDistrict}"></span>, <span th:text="${order.shippingCity}"></span></div>
    '''
    content = re.sub(r'<div id="dtlAddress" class="text-dark">[\s\S]*?</div>', f'<div id="dtlAddress" class="text-dark">{addr_html}</div>', content)

    # Products Card
    prod_html = '''
                                <div class="mb-4 last-mb-0" th:each="item : ${order.orderItems}">
                                    <div class="store-group-header">
                                        <i class="bi bi-shop text-cyan"></i>
                                        <span th:text="${item.store.name}"></span>
                                    </div>
                                    <div class="px-2">
                                        <div class="d-flex gap-3 py-3 border-bottom border-light" style="border-bottom-style: dashed !important;">
                                            <img th:src="${item.imageUrl}" alt="product image" style="width: 72px; height: 72px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(226, 232, 240, 0.5);">
                                            <div class="flex-grow-1 min-w-0 d-flex flex-column">
                                                <h6 class="fw-semibold text-dark mb-1 text-truncate" style="font-size: 0.95rem;" th:text="${item.productName}"></h6>
                                                <span class="badge bg-light text-dark border px-2 py-1 mb-2" style="width: fit-content;" th:text="${item.variant.color + ' / ' + item.variant.size}"></span>
                                                <div class="d-flex justify-content-between align-items-end mt-auto">
                                                    <div class="d-flex flex-column align-items-start">
                                                        <span class="fw-bold text-dark" th:text="${#numbers.formatDecimal(item.unitPrice, 0, 'COMMA', 0, 'POINT')} + 'đ'"></span>
                                                    </div>
                                                    <div class="text-muted-custom text-sm fw-medium pb-1" th:text="'SL: ' + ${item.quantity}"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    '''
    content = re.sub(r'<div id="dtlProducts">[\s\S]*?</div>', f'<div id="dtlProducts">{prod_html}</div>', content)

    # Payment
    payment_html = '''
                                <span class="fw-medium text-dark" id="dtlPayment">
                                    <i class="bi me-2 text-cyan" th:classappend="${order.paymentMethod == 'COD' ? 'bi-cash' : 'bi-credit-card'}"></i>
                                    <span th:text="${order.paymentMethod == 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}"></span>
                                </span>
    '''
    content = re.sub(r'<span class="fw-medium text-dark" id="dtlPayment"></span>', payment_html, content)

    # Summary
    content = content.replace('<span class="fw-semibold text-dark" id="dtlSubtotal"></span>', '<span class="fw-semibold text-dark" id="dtlSubtotal" th:text="${#numbers.formatDecimal(order.subtotal, 0, \'COMMA\', 0, \'POINT\')} + \'đ\'"></span>')
    content = content.replace('<span class="fw-semibold text-danger" id="dtlProdDiscount"></span>', '<span class="fw-semibold text-danger" id="dtlProdDiscount" th:text="\'- \' + ${#numbers.formatDecimal(order.productDiscount, 0, \'COMMA\', 0, \'POINT\')} + \'đ\'"></span>')
    content = content.replace('<span class="fw-semibold text-dark" id="dtlShipping"></span>', '<span class="fw-semibold text-dark" id="dtlShipping" th:text="${#numbers.formatDecimal(order.shippingFee, 0, \'COMMA\', 0, \'POINT\')} + \'đ\'"></span>')
    
    content = content.replace('class="d-flex justify-content-between mb-4 d-none" id="dtlCouponRow"', 'class="d-flex justify-content-between mb-4" id="dtlCouponRow" th:if="${order.couponDiscount > 0}"')
    content = content.replace('<span class="fw-semibold text-danger" id="dtlCoupon"></span>', '<span class="fw-semibold text-danger" id="dtlCoupon" th:text="\'- \' + ${#numbers.formatDecimal(order.couponDiscount, 0, \'COMMA\', 0, \'POINT\')} + \'đ\'"></span>')

    content = content.replace('<span class="fw-bold text-cyan fs-4" id="dtlTotal"></span>', '<span class="fw-bold text-cyan fs-4" id="dtlTotal" th:text="${#numbers.formatDecimal(order.total, 0, \'COMMA\', 0, \'POINT\')} + \'đ\'"></span>')

    content = content.replace('th:href="@{/orders/{id}/tracking(id=${orderId})}"', 'th:href="@{/orders/{id}/tracking(id=${order.id})}"')

    content = content.replace('<button id="dtlCancelBtn" class="btn btn-outline-danger w-100 rounded-pill py-2 fw-bold d-none" onclick="openCancelModalDetail()">',
                              '<button id="dtlCancelBtn" class="btn btn-outline-danger w-100 rounded-pill py-2 fw-bold" th:if="${order.status == \'Chờ xác nhận\'}" onclick="openCancelModalDetail()">')

    # Modal
    content = content.replace('<div class="modal-content border-0 shadow-lg rounded-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(28px);">',
                              '<form th:action="@{/orders/{id}/cancel(id=${order.id})}" method="POST" class="modal-content border-0 shadow-lg rounded-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(28px);">')
    
    content = content.replace('                    </div>\n                </div>\n            </div>\n        </div>', '                    </div>\n                </form>\n            </div>\n        </div>')

    content = content.replace('<span id="cancelOrderDetailIdText" class="text-cyan"></span>', '<span id="cancelOrderDetailIdText" class="text-cyan" th:text="${order.id}"></span>')

    content = content.replace('name="cancelReasonDetail"', 'name="reason"')

    content = content.replace('<textarea id="customReasonDetailInput" class="form-control rounded-3 shadow-none border-light bg-light" rows="3" placeholder="Vui lòng nhập lý do (Bắt buộc)..." style="display: none;"></textarea>',
                              '<input type="text" id="customReasonDetailInput" name="otherReason" class="form-control rounded-3 shadow-none border-light bg-light mt-3" placeholder="Vui lòng nhập lý do khác (Bắt buộc)..." style="display: none;">')

    content = content.replace('<button type="button" class="btn btn-danger rounded-pill px-4 shadow-sm" onclick="submitDetailCancellation()">Gửi yêu cầu hủy</button>',
                              '<button type="submit" class="btn btn-danger rounded-pill px-4 shadow-sm">Gửi yêu cầu hủy</button>')
                              
    content = re.sub(r'<script>\s*let cancelDetailModalInstance;[\s\S]*?</script>', r'''<script>
            function openCancelModalDetail() {
                document.getElementById('reason1d').checked = true;
                toggleCustomReasonDetail();
                const modalEl = document.getElementById('cancelOrderDetailModal');
                const cancelDetailModalInstance = new bootstrap.Modal(modalEl);
                cancelDetailModalInstance.show();
            }

            function toggleCustomReasonDetail() {
                const isOther = document.getElementById('reason7d').checked;
                const cInp = document.getElementById('customReasonDetailInput');
                cInp.style.display = isOther ? 'block' : 'none';
            }
        </script>''', content)

    with open('D:/Cyan/Project/T-Winkle/src/main/resources/templates/storefront/order/detail.html', 'w', encoding='utf-8') as f:
        f.write(content)

modify()
