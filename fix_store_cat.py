import os

base_dir = r'D:\Cyan\Project\T-Winkle'
cat_html = os.path.join(base_dir, 'src', 'main', 'resources', 'templates', 'storefront', 'store', 'categories.html')

with open(cat_html, 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(
    r'onclick="event\.stopPropagation\(\); CartHandler\.addToCart\(.*?\)"><i class="bi bi-cart fs-5"></i></button>',
    r'th:onclick="\'event.stopPropagation(); showProductDetail(\' +  + \');\'"><i class="bi bi-cart fs-5"></i></button>',
    content
)

with open(cat_html, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated store/categories.html")
