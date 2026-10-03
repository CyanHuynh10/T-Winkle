import re

path = 'src/main/resources/templates/storefront/category/list.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add th:fragment
content = content.replace('id="productDetailModal"', 'id="productDetailModal" th:fragment="product-detail-modal"')

# Replace Modal contents
# Since replacing huge chunks with regex is hard, I will do some targeted string replacements inside the modal.

# Add a check th:if="${productDTO != null}" to the inner content so it only renders when data is present (to avoid errors when just rendering the list page)
# Wait, if productDTO is null, we shouldn't throw errors! We can use safe navigation operator ?.

# Title
content = re.sub(r'<h2 class="h2 fw-bold text-dark mb-0 flex-grow-1" id="productDetailModalLabel">[^<]+</h2>', '<h2 class="h2 fw-bold text-dark mb-0 flex-grow-1" id="productDetailModalLabel" th:text="${productDTO?.name}">Product Name</h2>', content)

# Brand/Category Badges
content = re.sub(r'<span class="badge text-cyan bg-cyan bg-opacity-10 fw-semibold fs-6 px-2 py-1">[^<]+</span>', '<span class="badge text-cyan bg-cyan bg-opacity-10 fw-semibold fs-6 px-2 py-1" th:text="${productDTO?.categoryName}">Category</span>', content)
content = re.sub(r'<span class="badge text-muted-custom bg-light fw-semibold fs-6 px-2 py-1 ms-2">[^<]+</span>', '<span class="badge text-muted-custom bg-light fw-semibold fs-6 px-2 py-1 ms-2" th:text="${productDTO?.brandName}">Brand</span>', content)

# Rating & Sold
content = re.sub(r'<span class="text-dark fw-bold ms-1">5\.0</span>', '<span class="text-dark fw-bold ms-1" th:text="${productDTO?.ratingAverage != null ? #numbers.formatDecimal(productDTO?.ratingAverage, 1, 1) : \'0.0\'}">5.0</span>', content)
content = re.sub(r'<span class="text-muted-custom">Đã bán \d+</span>', '<span class="text-muted-custom" th:text="\'Đã bán \' + (${productDTO?.soldCount != null ? productDTO?.soldCount : 0})">Đã bán 0</span>', content)

# Price
content = re.sub(r'<div class="fw-bold text-danger mb-1" style="font-size: 2\.5rem; line-height: 1;">[\d\.]+₫</div>', '<div class="fw-bold text-danger mb-1" style="font-size: 2.5rem; line-height: 1;" th:text="${productDTO?.effectivePrice != null ? #numbers.formatDecimal(productDTO?.effectivePrice, 0, \'COMMA\', 0, \'POINT\') + \'₫\' : \'0₫\'}">0₫</div>', content)
content = re.sub(r'<div class="text-muted-custom text-decoration-line-through fs-5">[\d\.]+₫</div>', '<div class="text-muted-custom text-decoration-line-through fs-5" th:if="${productDTO?.originalPrice > productDTO?.effectivePrice}" th:text="${productDTO?.originalPrice != null ? #numbers.formatDecimal(productDTO?.originalPrice, 0, \'COMMA\', 0, \'POINT\') + \'₫\' : \'0₫\'}">0₫</div>', content)

# Image
content = re.sub(r'<i class="bi bi-image text-muted opacity-25" style="font-size: 4rem;"></i>', '<img th:src="${productDTO?.primaryImagePath}" class="img-fluid w-100 h-100" style="object-fit: cover;" th:if="${productDTO?.primaryImagePath != null}"/><i th:unless="${productDTO?.primaryImagePath != null}" class="bi bi-image text-muted opacity-25" style="font-size: 4rem;"></i>', content)

# Add to Cart Button (Inject Product ID)
# We will change the onclick to pass the ID!
content = re.sub(r'<button id="modalAddToCartBtn"[^>]+onclick="event\.stopPropagation\(\);"[^>]*>', '<button id="modalAddToCartBtn" class="btn btn-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center text-white hover-scale" style="width: 56px; height: 56px;" aria-label="Thêm vào giỏ hàng" th:data-product-id="${productDTO?.productId}" onclick="event.stopPropagation(); CartHandler.addToCart(this.getAttribute(\'data-product-id\'));">', content)
content = content.replace('ThAm vAo gi? hAng', 'Thêm vào giỏ hàng')
content = content.replace('ThAm vAo yAu thAch', 'Thêm vào yêu thích')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated list.html modal")
