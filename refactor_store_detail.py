import re

path = 'src/main/resources/templates/storefront/store/detail.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Image
content = re.sub(r'<i class="bi bi-shop text-muted opacity-25" style="font-size: 6rem;"></i>', '<img th:src="${store.imageUrl}" class="img-fluid w-100 h-100" style="object-fit: cover;" th:if="${store.imageUrl != null}"/><i th:unless="${store.imageUrl != null}" class="bi bi-shop text-muted opacity-25" style="font-size: 6rem;"></i>', content)

# Replace Name
content = re.sub(r'<h1 class="h3 fw-bold text-dark mb-2">[^<]+</h1>', '<h1 class="h3 fw-bold text-dark mb-2" th:text="${store.name}">Store Name</h1>', content)

# Replace Status
content = re.sub(r'<span class="badge bg-success bg-opacity-10 text-success px-2 py-1 fs-6 border border-success border-opacity-10"><i class="bi bi-door-open me-1"></i> Đang mở</span>', '<span th:if="${store.status == \'OPEN\'}" class="badge bg-success bg-opacity-10 text-success px-2 py-1 fs-6 border border-success border-opacity-10"><i class="bi bi-door-open me-1"></i> Đang mở</span><span th:if="${store.status == \'CLOSED\'}" class="badge bg-danger bg-opacity-10 text-danger px-2 py-1 fs-6 border border-danger border-opacity-10"><i class="bi bi-door-closed me-1"></i> Đã đóng</span>', content)

# Replace Address
content = re.sub(r'<div class="d-flex align-items-start gap-2 mb-3 text-muted-custom">.*?</div>', '<div class="d-flex align-items-start gap-2 mb-3 text-muted-custom"><i class="bi bi-geo-alt-fill text-cyan mt-1"></i><span th:text="${store.addressLine} + \', \' + ${store.ward} + \', \' + ${store.district} + \', \' + ${store.city}">Address</span></div>', content, flags=re.DOTALL)

# Replace Phone
content = re.sub(r'<div class="d-flex align-items-center gap-2 mb-4 text-muted-custom">.*?</div>', '<div class="d-flex align-items-center gap-2 mb-4 text-muted-custom"><i class="bi bi-telephone-fill text-cyan"></i><span class="fw-medium text-dark" th:text="${store.phone}">Phone</span></div>', content, flags=re.DOTALL)

# Replace Button URL
content = re.sub(r'<a href="#" class="tw-btn control-btn bg-white border shadow-sm rounded-pill px-4 py-2 text-decoration-none d-flex align-items-center gap-2 text-dark fw-bold hover-cyan">', '<a th:href="@{\'/stores/\' + ${store.slug} + \'/catagories\'}" class="tw-btn control-btn bg-white border shadow-sm rounded-pill px-4 py-2 text-decoration-none d-flex align-items-center gap-2 text-dark fw-bold hover-cyan">', content)

# Rating
content = re.sub(r'<span class="fs-4 fw-bold text-dark">4\.9</span>', '<span class="fs-4 fw-bold text-dark" th:text="${#numbers.formatDecimal(store.ratingAverage, 1, 1)}">5.0</span>', content)
content = re.sub(r'<div class="text-sm text-muted-custom">2\.4k đánh giá</div>', '<div class="text-sm text-muted-custom" th:text="${store.reviewCount} + \' đánh giá\'">0 đánh giá</div>', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated detail.html for stores")
