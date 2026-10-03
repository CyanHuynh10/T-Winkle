import re

path = 'src/main/resources/templates/storefront/user/profile.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded inputs
content = re.sub(r'<input type="text" class="form-control profile-input shadow-none" id="fullName" value=".*?" required>', '<input type="text" name="fullName" class="form-control profile-input shadow-none" id="fullName" th:value="${user.fullName}" required>', content)
content = re.sub(r'<input type="tel" class="form-control profile-input shadow-none" id="phone" value=".*?" pattern="\[0-9\]\{10,11\}">', '<input type="tel" name="phone" class="form-control profile-input shadow-none" id="phone" th:value="${user.phone}" pattern="[0-9]{10,11}">', content)
content = re.sub(r'<input type="text" class="form-control profile-input shadow-none" id="username" th:value=".*?" required>', '<input type="text" name="username" class="form-control profile-input shadow-none" id="username" th:value="${user.username}" required>', content)

# Also the email field
content = re.sub(r'<input type="email" class="form-control profile-input bg-light shadow-none" id="email" value=".*?" readonly disabled>', '<input type="email" class="form-control profile-input bg-light shadow-none" id="email" th:value="${user.email}" readonly disabled>', content)

# Ensure form action and method
content = re.sub(r'<form id="profileForm" novalidate>', '<form id="profileForm" th:action="@{/profile/update}" method="POST" novalidate>', content)
content = re.sub(r'<div class="d-flex justify-content-end gap-3 mt-5 border-top border-light pt-4">\s*<button type="button".*?Lưu thay đổi\s*</button>', '<div class="d-flex justify-content-end gap-3 mt-5 border-top border-light pt-4">\n    <button type="button" class="tw-btn btn-profile-cancel rounded-pill px-4 py-2 fw-medium" onclick="window.location.reload();">Hủy</button>\n    <button type="submit" class="tw-btn btn-profile-save rounded-pill px-5 py-2 fw-bold text-white shadow-sm hover-scale">\n        Lưu thay đổi\n    </button>', content, flags=re.DOTALL)


# Remove profile-handler.js script
content = re.sub(r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\', \(\) => \{.*?\} \s*</script>', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated profile.html")
