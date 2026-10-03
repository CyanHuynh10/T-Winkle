import re
from urllib.parse import urlparse

path = 'src/main/resources/templates/storefront/category/list.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the sort JS logic
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
                
                // Set current sort UI based on URL
                const urlParams = new URLSearchParams(window.location.search);
                const sortParam = urlParams.get('sort') || 'popular';
                const sortText = document.getElementById('currentSortText');
                const activeItem = document.querySelector(`.sort-dropdown-item[data-sort="${sortParam}"]`);
                if(activeItem && sortText) {
                    document.querySelectorAll('.sort-dropdown-item').forEach(i => i.classList.remove('selected-sort'));
                    document.querySelectorAll('.sort-dropdown-item i.bi-check').forEach(i => i.remove());
                    
                    activeItem.classList.add('selected-sort');
                    sortText.textContent = activeItem.querySelector('.sort-text').textContent;
                    
                    const checkIcon = document.createElement('i');
                    checkIcon.className = 'bi bi-check text-cyan ms-2';
                    activeItem.appendChild(checkIcon);
                }

                // 2. SEARCH LOGIC
                const searchInput = document.getElementById("searchInput");
                const clearBtn = document.getElementById("clearSearchBtn");
                const submitBtn = document.getElementById("searchSubmitBtn");
                
                function toggleClearButton() {
                    if (searchInput.value.length > 0) {
                        clearBtn.classList.remove("d-none");
                    } else {
                        clearBtn.classList.add("d-none");
                    }
                }

                function performSearch() {
                    const val = searchInput.value.trim();
                    const urlParams = new URLSearchParams(window.location.search);
                    if (val) {
                        urlParams.set('keyword', val);
                    } else {
                        urlParams.delete('keyword');
                    }
                    urlParams.delete('page'); // reset page
                    window.location.href = window.location.pathname + '?' + urlParams.toString();
                }

                searchInput.addEventListener("input", toggleClearButton);
                
                searchInput.addEventListener("keypress", function(e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        performSearch();
                    }
                });

                submitBtn.addEventListener("click", function(e) {
                    e.preventDefault();
                    performSearch();
                });

                clearBtn.addEventListener("click", function(e) {
                    e.preventDefault();
                    searchInput.value = "";
                    toggleClearButton();
                    searchInput.focus();
                    performSearch(); 
                });
                
                // Set current search UI based on URL
                const keywordParam = urlParams.get('keyword');
                if(keywordParam) {
                    searchInput.value = keywordParam;
                    toggleClearButton();
                }
"""

content = re.sub(r'// Event listeners for sort dropdown.*?toggleClearButton\(\);\s*searchInput\.focus\(\);\s*performSearch\(\); \s*}\);\s*\}\);', js_replacement + '\n});', content, flags=re.DOTALL)

# Handle empty state conditionally via thymeleaf
empty_state_html = """
<div id="stateEmpty" class="text-center py-5 animate-fade-up" th:if="${products.empty}">
    <div class="mb-4 d-flex justify-content-center">
        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 120px; height: 120px;">
            <i class="bi bi-search text-muted-custom" style="font-size: 3rem;"></i>
        </div>
    </div>
    <h3 class="h4 fw-bold text-dark mb-2">KhA'ng tA`m thy kt qu</h3>
    <p class="text-muted-custom">Vui lA'ng ch?n danh mc khAc A` khAm phA thAm.</p>
</div>
<div id="stateResults" th:unless="${products.empty}">
"""
content = re.sub(r'<div id="stateEmpty".*?id="stateResults".*?>', empty_state_html, content, flags=re.DOTALL)
content = content.replace("KhA'ng tA`m thy kt qu", "Không tìm thấy kết quả")
content = content.replace("Vui lA'ng ch?n danh mc khAc A` khAm phA thAm.", "Vui lòng chọn danh mục khác để khám phá thêm.")


# Handle keyword feedback
keyword_feedback = """<div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3" id="resultsFeedback" th:if="${param.keyword != null}">
    <div>
        <h2 class="h5 fw-bold text-dark mb-0">Kết quả cho: <span id="resultsKeyword" class="text-cyan" th:text="${param.keyword}"></span></h2>
        <span class="text-muted-custom text-sm" th:text="'Tìm thấy ' + ${products.totalElements} + ' sản phẩm'">Tìm thấy 0 sản phẩm</span>
    </div>"""
content = re.sub(r'<div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3"[^>]*id="resultsFeedback".*?</div>', keyword_feedback, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated list.html JS and Empty States")
