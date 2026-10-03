import os

base_dir = r'D:\Cyan\Project\T-Winkle'
wishlist_html = os.path.join(base_dir, 'src', 'main', 'resources', 'templates', 'storefront', 'user', 'wishlist.html')

with open(wishlist_html, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the empty grid with Thymeleaf rendered grid
grid_start = '<div id="wishlistGrid" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">'
grid_end = '</div>\n\n                    <div id="wishlistPaginationWrapper"'

new_grid = '''<div id="wishlistGrid" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
                        <div class="col animate-fade-up" th:each="item : ">
                            <div class="glass-card product-card h-100 p-3 pb-4 d-flex flex-column rounded-4 border shadow-sm position-relative bg-white" th:data-product-id="">
                                <form th:action="@{/wishlist/toggle}" method="POST" class="m-0 p-0">
                                    <input type="hidden" name="productId" th:value="" />
                                    <button type="submit" class="btn btn-sm btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-4 z-3 text-danger hover-scale" aria-label="Xóa khỏi yêu thích">
                                        <i class="bi bi-heart-fill"></i>
                                    </button>
                                </form>
                                <div class="product-img-wrapper bg-white rounded-3 mb-3 d-flex align-items-center justify-content-center overflow-hidden position-relative" style="aspect-ratio: 1; border: 1px solid var(--color-border); cursor: pointer;" th:onclick="'showProductDetail(' +  + ');'">
                                    <img th:src="" class="img-fluid w-100 h-100" style="object-fit: cover;" th:if=""/>
                                    <i th:unless="" class="bi bi-image text-muted opacity-25" style="font-size: 4rem;"></i>
                                </div>
                                <div class="d-flex flex-column flex-grow-1">
                                    <span class="badge text-cyan bg-cyan bg-opacity-10 align-self-start fw-semibold text-xs mb-2 px-2 py-1" th:text="">Category</span>
                                    <h3 class="h5 fw-bold text-dark mb-1 text-truncate" th:text="">Product Name</h3>
                                    <div class="d-flex align-items-center gap-2 mb-3 text-sm">
                                        <div style="color: #FACC15;">
                                            <i class="bi bi-star-fill"></i>
                                            <span class="text-dark fw-bold ms-1">5.0</span>
                                        </div>
                                    </div>
                                    <div class="mt-auto d-flex align-items-end pe-5">
                                        <div>
                                            <div class="fw-bold fs-4 text-cyan" th:text=" + '₫'">0₫</div>
                                        </div>
                                        <button class="btn btn-primary rounded-circle shadow-sm position-absolute bottom-0 end-0 m-3 m-md-4 z-3 d-flex align-items-center justify-content-center hover-scale" style="width: 44px; height: 44px;" aria-label="Xem chi tiết" th:onclick="'event.stopPropagation(); showProductDetail(' +  + ');'">
                                            <i class="bi bi-cart fs-5"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="wishlistPaginationWrapper"'''

import re
content = re.sub(r'<div id="wishlistGrid"[^>]*>.*?</div>\s*<div id="wishlistPaginationWrapper"', new_grid, content, flags=re.DOTALL)

# Delete the JS script block at the end
content = re.sub(r'<script>\s*let currentPage = 1;.*?</script>', '', content, flags=re.DOTALL)

with open(wishlist_html, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated wishlist.html")
