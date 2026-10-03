import re

path = 'src/main/resources/templates/storefront/user/wishlist.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Grid Replacement
grid_replacement = """
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="wishlistGrid" th:if="${!wishlistPage.empty}">
                    <div class="col animate-fade-up" th:each="product : ${wishlistPage.content}">
                        <div class="glass-card product-card h-100 p-3 pb-4 d-flex flex-column rounded-4 border shadow-sm position-relative bg-white">
                            <form th:action="@{/wishlist/toggle}" method="POST" class="position-absolute top-0 end-0 m-4 z-3">
                                <input type="hidden" name="productId" th:value="${product.productId}" />
                                <button type="submit" class="btn btn-sm btn-light rounded-circle shadow-sm text-danger" aria-label="Xóa khỏi yêu thích">
                                    <i class="bi bi-heart-fill"></i>
                                </button>
                            </form>
                            <div class="product-img-wrapper bg-white rounded-3 mb-3 d-flex align-items-center justify-content-center overflow-hidden position-relative" style="aspect-ratio: 1; border: 1px solid var(--color-border); cursor: pointer;" th:onclick="'showProductDetail(' + ${product.productId} + ')'">
                                <img th:src="${product.primaryImagePath}" class="img-fluid w-100 h-100" style="object-fit: cover;" th:if="${product.primaryImagePath != null}"/>
                                <i th:unless="${product.primaryImagePath != null}" class="bi bi-image text-muted opacity-25" style="font-size: 4rem;"></i>
                            </div>
                            <div class="d-flex flex-column flex-grow-1">
                                <span class="badge text-cyan bg-cyan bg-opacity-10 align-self-start fw-semibold text-xs mb-2 px-2 py-1" th:text="${product.categoryName}">Category</span>
                                <h3 class="h5 fw-bold text-dark mb-1 text-truncate" th:text="${product.name}">Product</h3>
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
                                    <button class="btn btn-primary rounded-circle shadow-sm position-absolute bottom-0 end-0 m-3 m-md-4 z-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;" th:onclick="'showProductDetail(' + ${product.productId} + ')'"><i class="bi bi-cart fs-5"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
"""
content = re.sub(r'<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="wishlistGrid">.*?</div>\s*<!-- Pagination -->', grid_replacement + '\n<!-- Pagination -->', content, flags=re.DOTALL)

empty_replacement = """
                <!-- Empty State -->
                <div id="wishlistEmptyState" class="text-center py-5 animate-fade-up" th:if="${wishlistPage.empty}">
                    <div class="mb-4 d-flex justify-content-center">
                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-inner" style="width: 140px; height: 140px; position: relative;">
                            <i class="bi bi-heart text-muted-custom" style="font-size: 4rem;"></i>
                        </div>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-3">Chưa có sản phẩm yêu thích</h3>
                    <p class="text-muted-custom mb-4 max-w-md mx-auto">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. Hãy lưu lại những món đồ bạn quan tâm nhé!</p>
                    <a th:href="@{/categories}" class="tw-btn tw-btn-primary rounded-pill px-5 py-3 text-decoration-none d-inline-flex align-items-center gap-2 shadow-sm hover-lift fw-bold">
                        Khám phá sản phẩm
                    </a>
                </div>
"""
content = re.sub(r'<!-- Empty State -->.*?<div id="wishlistPaginationWrapper"', empty_replacement + '\n<div id="wishlistPaginationWrapper"', content, flags=re.DOTALL)

pagination = """
                <div id="wishlistPaginationWrapper" class="d-flex justify-content-center mt-5" th:if="${wishlistPage.totalPages > 1}">
                    <nav aria-label="Phân trang danh sách yêu thích">
                        <ul class="pagination pagination-glass gap-2 mb-0 d-flex flex-wrap justify-content-center">
                            <li class="page-item" th:classappend="${wishlistPage.first ? 'disabled' : ''}">
                                <a class="page-link rounded-circle d-flex align-items-center justify-content-center shadow-sm" th:href="@{/wishlist(page=${wishlistPage.number - 1})}" style="width: 40px; height: 40px;"><i class="bi bi-chevron-left"></i></a>
                            </li>
                            <li class="page-item" th:each="i : ${#numbers.sequence(0, wishlistPage.totalPages - 1)}" th:classappend="${i == wishlistPage.number ? 'active' : ''}">
                                <a class="page-link rounded-circle d-flex align-items-center justify-content-center shadow-sm" th:classappend="${i == wishlistPage.number ? 'bg-primary text-white border-primary' : 'bg-white text-dark'}" th:href="@{/wishlist(page=${i})}" style="width: 40px; height: 40px;" th:text="${i + 1}">1</a>
                            </li>
                            <li class="page-item" th:classappend="${wishlistPage.last ? 'disabled' : ''}">
                                <a class="page-link rounded-circle d-flex align-items-center justify-content-center shadow-sm" th:href="@{/wishlist(page=${wishlistPage.number + 1})}" style="width: 40px; height: 40px;"><i class="bi bi-chevron-right"></i></a>
                            </li>
                        </ul>
                    </nav>
                </div>
"""
content = re.sub(r'<div id="wishlistPaginationWrapper" class="d-flex justify-content-center mt-5">.*?</div>\s*</div>\s*</section>', pagination + '\n</div>\n</section>', content, flags=re.DOTALL)

# Modal block
# We remove it from wishlist.html because `main.js`'s `showProductDetail` injects it anyway, or we can just delete it here!
content = re.sub(r'<div class="modal fade" id="productDetailModal".*?<!-- Bootstrap JS -->', '<!-- Bootstrap JS -->', content, flags=re.DOTALL)

# Delete JS
content = re.sub(r'<script>\s*let currentPage = 1;.*?\}\s*\}\);\s*</script>', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated wishlist.html")
