import os

search_terms = [
    "perUserLimit", "per_user_limit",
    "discountApplied", "discount_applied",
    "AWAITING_GATEWAY",
    "PENDING_STORE_CONFIRMATION",
    "getImages().get(0)",
    "CURRENT_TIMESTAMP",
    "OrderByCreatedAtDesc",
    "ratingAverage", "soldCount",
    "startDate", "endDate", "isActive",
    "Long productId", "Long storeId", "Long categoryId", "Long brandId", "Long couponId", "Long promotionId",
    "N'Đã giao'"
]

def search_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".java") or file.endswith(".xml") or file.endswith(".sql"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            for term in search_terms:
                                if term in line:
                                    print(f"{file_path}:{i+1}: {line.strip()}")
                except Exception as e:
                    pass

search_files('src/main/java')
search_files('src/test/java')
