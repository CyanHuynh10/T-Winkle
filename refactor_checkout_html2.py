import re

path = 'src/main/resources/templates/storefront/checkout/checkout.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

summary_replacement = """                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted-custom">Tạm tính</span>
                                <span class="fw-semibold text-dark" id="summarySubtotal" th:text="${#numbers.formatDecimal(subtotal, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted-custom">Phí vận chuyển</span>
                                <span class="fw-semibold text-dark" id="summaryShipping" th:text="${#numbers.formatDecimal(shippingFee, 0, 'COMMA', 0, 'POINT')} + '₫'">30.000₫</span>
                            </div>
                            
                            <div class="border-top border-light pt-3 mb-4">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="fw-bold text-dark fs-5">Tổng thanh toán</span>
                                    <span class="fw-bold text-cyan fs-4" id="summaryTotal" th:text="${#numbers.formatDecimal(total, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</span>
                                </div>
                                <small class="text-muted text-xs d-block text-end">(Đã bao gồm VAT nếu có)</small>
                            </div>
"""

content = re.sub(r'<div class="d-flex justify-content-between mb-3">\s*<span class="text-muted-custom">Tạm tính</span>.*?<small class="text-muted text-xs d-block text-end">\(Đã bao gồm VAT nếu có\)</small>\s*</div>', summary_replacement, content, flags=re.DOTALL)

# And wrap the checkout elements inside a form that posts to /checkout/process
form_replacement = """                    <form th:action="@{/checkout/process}" method="POST" id="checkoutForm" class="col-lg-4">
                        <div class="checkout-card position-sticky" style="top: 2rem;">
                            <!-- Add form hidden inputs -->
                            <input type="hidden" name="addressId" th:if="${not #lists.isEmpty(addresses)}" th:value="${not #lists.isEmpty(addresses.?[isDefault]) ? addresses.?[isDefault][0].id : addresses[0].id}">
                            <input type="hidden" name="paymentMethod" value="COD" id="hiddenPaymentMethod">
                            <input type="hidden" name="couponCode" value="" id="hiddenCouponCode">
"""
content = re.sub(r'<div class="col-lg-4">\s*<div class="checkout-card position-sticky" style="top: 2rem;">', form_replacement, content, flags=re.DOTALL)

button_replacement = """                            <button type="submit" id="placeOrderBtn" class="tw-btn btn-checkout-primary w-100 rounded-pill py-3 text-decoration-none fw-bold fs-6 d-flex justify-content-center align-items-center gap-2 mb-3">
                                Đặt hàng
                            </button>"""
content = re.sub(r'<button id="placeOrderBtn".*?Đặt hàng\s*</button>', button_replacement, content, flags=re.DOTALL)

# End the form tag
content = content.replace('</a>\s*</div>\s*</div>', '</a>\s*</div>\s*</form>', 1)
content = re.sub(r'</a>\s*</div>\s*</div>', '</a>\n                        </div>\n                    </form>', content, flags=re.DOTALL)


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated checkout.html with form")
