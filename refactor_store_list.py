import re

path = 'src/main/resources/templates/storefront/store/list.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the storeGridList block
grid_html = """<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 animate-fade-up position-relative" style="animation-delay: 0.2s;" id="storeGridList">
    <div class="col" th:each="store : ${stores}">
        <div tabindex="0" role="button" th:aria-label="'Xem chi tiết ' + ${store.name}" style="cursor: pointer;" class="glass-card h-100 p-3 pb-4 d-flex flex-column rounded-4 border shadow-sm bg-white position-relative store-card" th:onclick="'window.location.href=\\'/stores/' + ${store.slug} + '\\''">
            <div class="store-img-wrapper bg-light rounded-3 mb-3 overflow-hidden position-relative" style="aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center;">
                <img th:src="${store.imageUrl}" class="img-fluid w-100 h-100" style="object-fit: cover;" th:if="${store.imageUrl != null}"/>
                <i th:unless="${store.imageUrl != null}" class="bi bi-shop text-muted opacity-25" style="font-size: 4rem;"></i>
                
                <span th:if="${store.status == 'OPEN'}" class="position-absolute top-0 start-0 m-2 badge bg-success bg-opacity-10 text-success px-2 py-1 border border-success border-opacity-10 shadow-sm" style="backdrop-filter: blur(4px);">
                    <i class="bi bi-door-open me-1"></i> Đang mở
                </span>
                <span th:if="${store.status == 'CLOSED'}" class="position-absolute top-0 start-0 m-2 badge bg-danger bg-opacity-10 text-danger px-2 py-1 border border-danger border-opacity-10 shadow-sm" style="backdrop-filter: blur(4px);">
                    <i class="bi bi-door-closed me-1"></i> Đã đóng
                </span>
            </div>
            
            <div class="d-flex flex-column flex-grow-1">
                <h3 class="h5 fw-bold text-dark mb-2 store-name transition-colors" th:text="${store.name}">Store Name</h3>
                <p class="text-muted-custom text-sm mb-3 d-flex align-items-start gap-2">
                    <i class="bi bi-geo-alt-fill text-cyan mt-1"></i>
                    <span th:text="${store.addressLine} + ', ' + ${store.ward} + ', ' + ${store.district} + ', ' + ${store.city}">Address</span>
                </p>
                
                <div class="mt-auto d-flex flex-wrap gap-3 text-sm">
                    <div class="d-flex align-items-center gap-1 text-muted-custom" th:title="'Đánh giá: ' + ${#numbers.formatDecimal(store.ratingAverage, 1, 1)}">
                        <i class="bi bi-star-fill text-warning"></i>
                        <span class="fw-bold text-dark" th:text="${#numbers.formatDecimal(store.ratingAverage, 1, 1)}">5.0</span>
                        <span th:text="'(' + ${store.reviewCount} + ')'"></span>
                    </div>
                    <div class="d-flex align-items-center gap-2 text-muted-custom">
                        <i class="bi bi-telephone-fill text-cyan"></i>
                        <span th:text="${store.phone}">Phone</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>"""

content = re.sub(r'<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 animate-fade-up position-relative"[^>]*id="storeGridList".*?<!-- Empty State -->', grid_html + '\n<!-- Empty State -->', content, flags=re.DOTALL)

# Delete modal and JS logic for modal
# Just delete everything from `<div class="modal fade" id="storeDetailModal"` to the end of the script before `</body>`
content = re.sub(r'<div class="modal fade" id="storeDetailModal".*?<!-- Background Elements -->', '<!-- Background Elements -->', content, flags=re.DOTALL)

# Replace JS logic that dynamically renders dummy cards
content = re.sub(r'<script>\s*// Simple frontend UI search interaction.*?</div>\s*</div>\s*<!-- Background Elements -->', '</div>\n</div>\n<!-- Background Elements -->', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated list.html for stores")
