import os

base_dir = r'D:\Cyan\Project\T-Winkle'
list_html = os.path.join(base_dir, 'src', 'main', 'resources', 'templates', 'storefront', 'category', 'list.html')

with open(list_html, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded price div in modal
old_modal_price = '<div class="fw-bold text-cyan" style="font-size: 2.5rem; line-height: 1;">2.450.000đ</div>'
new_modal_price = '''<div class="fw-bold text-cyan" style="font-size: 2.5rem; line-height: 1;" th:text=" + '₫'">0₫</div>'''

content = content.replace(old_modal_price, new_modal_price)

# Replace product card prices in list.html
old_price_div = '<div class="fw-bold fs-4 text-cyan">2.450.000đ</div>'
new_price_div = '''<div th:classappend=" ? 'fw-bold fs-4 text-danger' : 'fw-bold fs-4 text-cyan'" th:text=" + '₫'">0₫</div>
                                        <div th:if="" class="text-decoration-line-through text-muted text-sm" th:text=" + '₫'">0₫</div>'''

content = content.replace(old_price_div, new_price_div)

# Replace Add to cart button
old_cart_btn = '''<button class="btn btn-primary rounded-circle shadow-sm position-absolute bottom-0 end-0 m-3 m-md-4 z-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;" aria-label="Thêm vào giỏ hàng" onclick="event.stopPropagation(); CartHandler.addToCart();"><i class="bi bi-cart fs-5"></i></button>'''
new_cart_btn = '''<button class="btn btn-primary rounded-circle shadow-sm position-absolute bottom-0 end-0 m-3 m-md-4 z-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;" aria-label="Xem chi tiết" th:onclick="'event.stopPropagation(); showProductDetail(' +  + ');'"><i class="bi bi-cart fs-5"></i></button>'''

content = content.replace(old_cart_btn, new_cart_btn)

with open(list_html, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated list.html")
