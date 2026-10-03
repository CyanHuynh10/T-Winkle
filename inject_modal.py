import re

path = 'src/main/resources/templates/storefront/category/list.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

with open('product_modal_template.html', 'r', encoding='utf-8') as f:
    modal_content = f.read()

# Replace the old modal block with the new one
content = re.sub(r'<div class="modal fade" id="productDetailModal".*?<!-- Filter Offcanvas -->', modal_content + '\n\n<!-- Filter Offcanvas -->', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced modal in list.html")
