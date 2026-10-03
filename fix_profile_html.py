import os

base_dir = r'D:\Cyan\Project\T-Winkle'
profile_html = os.path.join(base_dir, 'src', 'main', 'resources', 'templates', 'storefront', 'user', 'profile.html')

with open(profile_html, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Update form
content = content.replace('<form id="profileForm" novalidate onsubmit="return false;">', '<form id="profileForm" novalidate th:action="@{/profile/update}" method="POST">')

# Add success/error message
success_alert = '''<div th:if="" class="alert alert-success alert-dismissible fade show" role="alert">
                            Cập nhật thông tin thành công!
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                        <form'''
content = content.replace('<form', success_alert, 1) # replace first form only

# Modify JS
js_replace = r'''saveBtn.addEventListener\('click', \(e\) => \{
                    e.preventDefault\(\);.*?setTimeout\(\(\) => \{.*?\}, 800\);\s*\}\);'''
new_js = '''saveBtn.addEventListener('click', (e) => {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                        form.classList.add('was-validated');
                        return;
                    }
                    const originalText = saveBtn.textContent;
                    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Đang lưu...';
                    saveBtn.disabled = true;
                    form.submit();
                });'''

content = re.sub(js_replace, new_js, content, flags=re.DOTALL)

with open(profile_html, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated profile.html")
