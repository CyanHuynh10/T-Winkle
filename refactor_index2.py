import re

path = 'src/main/resources/templates/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def process_section(content, section_regex, collection_name):
    # Find the section block
    section_match = re.search(section_regex, content, re.DOTALL)
    if not section_match:
        return content
    
    prefix = section_match.group(1)
    cards_html = section_match.group(2)
    suffix = section_match.group(3)
    
    # Extract the first product card to use as template
    card_match = re.search(r'(<!-- Product Card 1 -->\s*<div class="col">)(.*?)(</div>\s*<!-- Product Card 2 -->)', cards_html, re.DOTALL)
    if card_match:
        card_start = card_match.group(1)
        card_content = card_match.group(2)
        
        # Now add th:each to the col div
        card_start = card_start.replace('<div class="col">', f'<div class="col" th:each="product, iterStat : ${{{collection_name}}}" th:if="${{iterStat.index < 3}}">')
        
        # Replace the hardcoded data with thymeleaf tags
        # Image
        card_content = re.sub(r'<i class="bi bi-image text-muted opacity-25"[^>]*></i>', '<img th:src="${product.primaryImagePath}" class="img-fluid w-100 h-100" style="object-fit: cover;" th:alt="${product.name}" th:if="${product.primaryImagePath != null}"/><i th:unless="${product.primaryImagePath != null}" class="bi bi-image text-muted opacity-25" style="font-size: 4rem;"></i>', card_content)
        
        # Badges
        # Remove hardcoded badge
        card_content = re.sub(r'<span class="badge bg-[^"]+"[^>]*>[^<]*</span>', '', card_content)
        
        # Category
        card_content = re.sub(r'<span class="badge text-cyan bg-cyan bg-opacity-10 align-self-start fw-semibold text-xs mb-2 px-2 py-1">[^<]*</span>', '<span class="badge text-cyan bg-cyan bg-opacity-10 align-self-start fw-semibold text-xs mb-2 px-2 py-1" th:text="${product.categoryName}">CATEGORY</span>', card_content)
        
        # Title
        card_content = re.sub(r'<h3 class="h5 fw-bold text-dark mb-1 text-truncate" title="[^"]+">[^<]+</h3>', '<h3 class="h5 fw-bold text-dark mb-1 text-truncate" th:title="${product.name}" th:text="${product.name}">Product Name</h3>', card_content)
        
        # Rating
        card_content = re.sub(r'<span class="text-dark fw-bold ms-1">[\d\.]+</span>', '<span class="text-dark fw-bold ms-1" th:text="${product.ratingAverage != null ? #numbers.formatDecimal(product.ratingAverage, 1, 1) : \'0.0\'}">5.0</span>', card_content)
        
        # Sold count
        card_content = re.sub(r'<span class="text-muted-custom">Đã bán \d+</span>', '<span class="text-muted-custom" th:text="\'Đã bán \' + (${product.soldCount != null ? product.soldCount : 0})">Đã bán 0</span>', card_content)
        
        # Price (handle normal price and sale price with line-through)
        if 'text-decoration-line-through' in card_content:
            # It has a discount format
            card_content = re.sub(r'<div class="text-muted-custom text-decoration-line-through text-sm mb-1">[\d\.]+₫</div>', '<div class="text-muted-custom text-decoration-line-through text-sm mb-1" th:if="${product.effectivePrice < product.originalPrice}" th:text="${#numbers.formatDecimal(product.originalPrice, 0, \'COMMA\', 0, \'POINT\')} + \'₫\'">0₫</div>', card_content)
            card_content = re.sub(r'<div class="fw-bold fs-4 text-danger">[\d\.]+₫</div>', '<div class="fw-bold fs-4 text-danger" th:text="${#numbers.formatDecimal(product.effectivePrice, 0, \'COMMA\', 0, \'POINT\')} + \'₫\'">0₫</div>', card_content)
        else:
            # Normal format
            card_content = re.sub(r'<div class="fw-bold fs-4 text-cyan">[\d\.]+₫</div>', '<div class="fw-bold fs-4 text-cyan" th:text="${#numbers.formatDecimal(product.effectivePrice, 0, \'COMMA\', 0, \'POINT\')} + \'₫\'">0₫</div>', card_content)
        
        # Wishlist button
        card_content = re.sub(r'<button class="btn btn-sm btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-4 z-3 wishlist-btn text-muted-custom" aria-label="Thêm vào yêu thích" >', '<button class="btn btn-sm btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-4 z-3 wishlist-btn text-muted-custom" aria-label="Thêm vào yêu thích" th:data-product-id="${product.productId}" th:classappend="${product.inWishlist} ? \'active text-danger\' : \'\'">', card_content)
        card_content = card_content.replace('ThAm vAo yAu thAch', 'Thêm vào yêu thích')
        
        # Add to cart button
        card_content = re.sub(r'CartHandler\.addToCart\(\);', 'CartHandler.addToCart(${product.productId});', card_content)
        
        # Detail modal binding
        card_content = re.sub(r'data-bs-target="#productDetailModal"', 'th:data-product-id="${product.productId}" onclick="showProductDetail(this.getAttribute(\'data-product-id\'))"', card_content)
        
        # Reassemble
        new_drops = prefix + '\n' + card_start + card_content + '\n</div>\n' + suffix
        content = content[:section_match.start()] + new_drops + content[section_match.end():]
        
    return content

# I will un-hide popular and sale that I hid earlier!
content = content.replace('<th:block th:if="${false}">\n', '')
content = content.replace('</th:block>\n</section>', '</section>')

# Process popular
content = process_section(content, r'(<section class="popular-products.*?>.*?<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">)(.*?)(</div>\s*</div>\s*</section>)', 'popularProducts')
# Process sale
content = process_section(content, r'(<section class="super-sale.*?>.*?<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">)(.*?)(</div>\s*</div>\s*</section>)', 'saleProducts')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html Popular and Sale")
