import re

path = 'src/main/resources/templates/storefront/store/categories.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the Grid HTML
grid_replacement = """<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 animate-fade-up position-relative" style="animation-delay: 0.2s; z-index: 10;" id="productGridList">
    <div class="col" th:each="product : ${products.content}">
        <div class="glass-card product-card h-100 p-3 pb-4 d-flex flex-column rounded-4 border shadow-sm position-relative bg-white">
            <button class="btn btn-sm btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-4 z-3 wishlist-btn text-muted-custom" aria-label="Thêm vào yêu thích" th:data-product-id="${product.productId}" th:classappend="${product.inWishlist} ? 'active text-danger' : ''">
                <i class="bi bi-heart"></i>
            </button>
            <div class="product-img-wrapper bg-white rounded-3 mb-3 d-flex align-items-center justify-content-center overflow-hidden position-relative" style="aspect-ratio: 1; border: 1px solid var(--color-border); cursor: pointer;" th:data-product-id="${product.productId}" onclick="showProductDetail(this.getAttribute('data-product-id'))">
                <img th:src="${product.primaryImagePath}" class="img-fluid w-100 h-100" style="object-fit: cover;" th:alt="${product.name}" th:if="${product.primaryImagePath != null}"/>
                <i th:unless="${product.primaryImagePath != null}" class="bi bi-image text-muted opacity-25" style="font-size: 4rem;"></i>
            </div>
            <div class="d-flex flex-column flex-grow-1">
                <span class="badge text-cyan bg-cyan bg-opacity-10 align-self-start fw-semibold text-xs mb-2 px-2 py-1" th:text="${product.categoryName}">SNEAKER</span>
                <h3 class="h5 fw-bold text-dark mb-1 text-truncate" th:title="${product.name}" th:text="${product.name}">Product Name</h3>
                <div class="d-flex align-items-center gap-2 mb-3 text-sm">
                    <div style="color: #FACC15;">
                        <i class="bi bi-star-fill"></i>
                        <span class="text-dark fw-bold ms-1" th:text="${product.ratingAverage != null ? #numbers.formatDecimal(product.ratingAverage, 1, 1) : '0.0'}">5.0</span>
                    </div>
                    <span class="text-muted-custom">|</span>
                    <span class="text-muted-custom" th:text="'Đã bán ' + (${product.soldCount != null ? product.soldCount : 0})">Đã bán 0</span>
                </div>
                <div class="mt-auto d-flex align-items-end pe-5">
                    <div>
                        <div class="text-muted-custom text-decoration-line-through text-sm mb-1" th:if="${product.effectivePrice < product.originalPrice}" th:text="${#numbers.formatDecimal(product.originalPrice, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</div>
                        <div th:classappend="${product.effectivePrice < product.originalPrice} ? 'fw-bold fs-4 text-danger' : 'fw-bold fs-4 text-cyan'" th:text="${#numbers.formatDecimal(product.effectivePrice, 0, 'COMMA', 0, 'POINT')} + '₫'">0₫</div>
                    </div>
                    <button class="btn btn-primary rounded-circle shadow-sm position-absolute bottom-0 end-0 m-3 m-md-4 z-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;" aria-label="Thêm vào giỏ hàng" th:data-product-id="${product.productId}" onclick="event.stopPropagation(); CartHandler.addToCart(this.getAttribute('data-product-id'));"><i class="bi bi-cart fs-5"></i></button>
                </div>
            </div>
        </div>
    </div>
</div>"""

content = re.sub(r'<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 animate-fade-up position-relative"[^>]*id="productGridList".*?</div>\s*<!-- Pagination -->', grid_replacement + '\n<!-- Pagination -->', content, flags=re.DOTALL)

# Remove the JS generating products. 
js_remove_regex = r'// 1\. GENERATE PRODUCT CARDS.*?renderProducts\(\);'
content = re.sub(js_remove_regex, '', content, flags=re.DOTALL)

# Add thymeleaf to pagination
pagination_html = """<div class="d-flex justify-content-center mt-5 animate-fade-up" style="animation-delay: 0.3s;" th:if="${products.totalPages > 1}">
    <nav aria-label="Phân trang sản phẩm">
        <ul class="pagination pagination-glass gap-2 mb-0 d-flex flex-wrap justify-content-center">
            <li class="page-item" th:classappend="${products.first ? 'disabled' : ''}">
                <a class="page-link rounded-circle d-flex align-items-center justify-content-center shadow-sm" th:href="@{${#httpServletRequest.requestURI}(page=${products.number - 1})}" aria-label="Trang trước" style="width: 40px; height: 40px;"><i class="bi bi-chevron-left"></i></a>
            </li>
            
            <li class="page-item" th:each="i : ${#numbers.sequence(0, products.totalPages - 1)}" th:classappend="${i == products.number ? 'active' : ''}">
                <a th:if="${i == products.number}" class="page-link rounded-circle d-flex align-items-center justify-content-center shadow-sm bg-primary text-white border-primary" href="#" style="width: 40px; height: 40px;" th:text="${i + 1}">1</a>
                <a th:unless="${i == products.number}" class="page-link rounded-circle d-flex align-items-center justify-content-center shadow-sm bg-white text-dark" th:href="@{${#httpServletRequest.requestURI}(page=${i})}" style="width: 40px; height: 40px;" th:text="${i + 1}">2</a>
            </li>
            
            <li class="page-item" th:classappend="${products.last ? 'disabled' : ''}">
                <a class="page-link rounded-circle d-flex align-items-center justify-content-center shadow-sm" th:href="@{${#httpServletRequest.requestURI}(page=${products.number + 1})}" aria-label="Trang sau" style="width: 40px; height: 40px;"><i class="bi bi-chevron-right"></i></a>
            </li>
        </ul>
    </nav>
</div>"""

content = re.sub(r'<div class="d-flex justify-content-center mt-5 animate-fade-up".*?</div>\s*</div>\s*</section>', pagination_html + '\n</div>\n</section>', content, flags=re.DOTALL)

# Delete modal from categories.html
content = re.sub(r'<div class="modal fade" id="productDetailModal".*?<!-- Filter Offcanvas -->', '<!-- Filter Offcanvas -->', content, flags=re.DOTALL)

# Fix JS sort
js_replacement = """
                // Event listeners for sort dropdown
                const sortDropdownItems = document.querySelectorAll('.sort-dropdown-item');
                if(sortDropdownItems.length > 0) {
                    sortDropdownItems.forEach(item => {
                        item.addEventListener('click', function(e) {
                            e.preventDefault();
                            let currentSort = item.getAttribute('data-sort');
                            const urlParams = new URLSearchParams(window.location.search);
                            urlParams.set('sort', currentSort);
                            window.location.href = window.location.pathname + '?' + urlParams.toString();
                        });
                    });
                }
"""

content = re.sub(r'// Event listeners for sort dropdown.*?toggleClearButton\(\);\s*searchInput\.focus\(\);\s*performSearch\(\); \s*}\);\s*\}\);', js_replacement + '\n});', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated categories.html")
