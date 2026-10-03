import re

path = 'src/main/resources/templates/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Newest Drops
# We want to replace the contents of the FIRST <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
# with a single th:each product card.

# Find the block for newest drops.
newest_drops_match = re.search(r'(<section class="newest-drops.*?>.*?<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">)(.*?)(</div>\s*</div>\s*</section>)', content, re.DOTALL)

if newest_drops_match:
    prefix = newest_drops_match.group(1)
    cards_html = newest_drops_match.group(2)
    suffix = newest_drops_match.group(3)
    
    # Extract the first product card to use as template
    card_match = re.search(r'(<!-- Product Card 1 -->\s*<div class="col">)(.*?)(</div>\s*<!-- Product Card 2 -->)', cards_html, re.DOTALL)
    if card_match:
        card_start = card_match.group(1)
        card_content = card_match.group(2)
        
        # Now add th:each to the col div
        card_start = card_start.replace('<div class="col">', '<div class="col" th:each="product : ${newestProducts}">')
        
        # Replace the hardcoded data with thymeleaf tags
        # Image
        card_content = re.sub(r'<i class="bi bi-image text-muted opacity-25"[^>]*></i>', '<img th:src="${product.primaryImagePath}" class="img-fluid w-100 h-100" style="object-fit: cover;" th:alt="${product.name}" th:if="${product.primaryImagePath != null}"/><i th:unless="${product.primaryImagePath != null}" class="bi bi-image text-muted opacity-25" style="font-size: 4rem;"></i>', card_content)
        
        # Badges
        # Remove hardcoded badge, let's keep one generic badge if needed, but the backend DTO doesn't have a badge flag other than promotion. We'll leave it out or conditionally render it later.
        card_content = re.sub(r'<span class="badge bg-danger position-absolute top-0 start-0 m-2 z-1">M.iI</span>', '', card_content)
        
        # Category
        card_content = re.sub(r'<span class="badge text-cyan bg-cyan bg-opacity-10 align-self-start fw-semibold text-xs mb-2 px-2 py-1">SNEAKER</span>', '<span class="badge text-cyan bg-cyan bg-opacity-10 align-self-start fw-semibold text-xs mb-2 px-2 py-1" th:text="${product.categoryName}">SNEAKER</span>', card_content)
        
        # Title
        card_content = re.sub(r'<h3 class="h5 fw-bold text-dark mb-1 text-truncate" title="Urban Runner 2026">Urban Runner 2026</h3>', '<h3 class="h5 fw-bold text-dark mb-1 text-truncate" th:title="${product.name}" th:text="${product.name}">Product Name</h3>', card_content)
        
        # Rating
        card_content = re.sub(r'<span class="text-dark fw-bold ms-1">5\.0</span>', '<span class="text-dark fw-bold ms-1" th:text="${product.ratingAverage != null ? #numbers.formatDecimal(product.ratingAverage, 1, 1) : \'0.0\'}">5.0</span>', card_content)
        
        # Sold count
        card_content = re.sub(r'<span class="text-muted-custom">Đã bán 124</span>', '<span class="text-muted-custom" th:text="\'Đã bán \' + (${product.soldCount != null ? product.soldCount : 0})">Đã bán 0</span>', card_content)
        
        # Price
        card_content = re.sub(r'<div class="fw-bold fs-4 text-cyan">2\.450\.000₫</div>', '<div class="fw-bold fs-4 text-cyan" th:text="${#numbers.formatDecimal(product.effectivePrice, 0, \'COMMA\', 0, \'POINT\')} + \'₫\'">0₫</div>', card_content)
        
        # Wishlist button
        card_content = re.sub(r'<button class="btn btn-sm btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-4 z-3 wishlist-btn text-muted-custom" aria-label="Thêm vào yêu thích" >', '<button class="btn btn-sm btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-4 z-3 wishlist-btn text-muted-custom" aria-label="Thêm vào yêu thích" th:data-product-id="${product.productId}" th:classappend="${product.inWishlist} ? \'active text-danger\' : \'\'">', card_content)
        card_content = card_content.replace('ThAm vAo yAu thAch', 'Thêm vào yêu thích')
        
        # Add to cart button
        card_content = re.sub(r'CartHandler\.addToCart\(\);', 'CartHandler.addToCart(${product.productId});', card_content)
        
        # Detail modal binding
        card_content = re.sub(r'data-bs-target="#productDetailModal"', 'th:data-product-id="${product.productId}" onclick="showProductDetail(this.getAttribute(\'data-product-id\'))"', card_content)
        
        # Reassemble Newest Drops
        new_newest_drops = prefix + '\n' + card_start + card_content + '\n</div>\n' + suffix
        content = content[:newest_drops_match.start()] + new_newest_drops + content[newest_drops_match.end():]

# Block other sections temporarily by wrapping in th:if="${false}" until backend supports it
content = re.sub(r'(<section class="popular-products py-5 position-relative z-1">)', r'\1\n<th:block th:if="${false}">', content)
content = re.sub(r'(</section>\s*<section class="super-sale)', r'</th:block>\n\1', content)
content = re.sub(r'(<section class="super-sale py-5 position-relative z-1">)', r'\1\n<th:block th:if="${false}">', content)
content = re.sub(r'(</section>\s*<!-- Call to Action)', r'</th:block>\n\1', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html")
