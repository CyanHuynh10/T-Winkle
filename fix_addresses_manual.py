import re

with open(r'D:\Cyan\Project\T-Winkle\src\main\resources\templates\storefront\user\addresses.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix address form
content = re.sub(
    r'<form id="addressForm"[^>]*>.*?<input type="hidden" id="addrId">',
    r'<form id="addressForm" novalidate th:action="@{/addresses/save}" method="POST">\n                            <input type="hidden" id="addrId" name="id">',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<input type="text" class="form-control profile-input shadow-none" id="addrName" required>',
    r'<input type="text" class="form-control profile-input shadow-none" id="addrName" name="fullName" required>',
    content
)
content = re.sub(
    r'<input type="tel" class="form-control profile-input shadow-none" id="addrPhone" required pattern="\[0-9\]\{10,11\}">',
    r'<input type="tel" class="form-control profile-input shadow-none" id="addrPhone" name="phone" required pattern="[0-9]{10,11}">',
    content
)
content = re.sub(
    r'<input type="text" class="form-control profile-input shadow-none" id="addrProvince" required>',
    r'<input type="text" class="form-control profile-input shadow-none" id="addrProvince" name="city" required>',
    content
)
content = re.sub(
    r'<input type="text" class="form-control profile-input shadow-none" id="addrDistrict" required>',
    r'<input type="text" class="form-control profile-input shadow-none" id="addrDistrict" name="district" required>',
    content
)
content = re.sub(
    r'<input type="text" class="form-control profile-input shadow-none" id="addrWard" required>',
    r'<input type="text" class="form-control profile-input shadow-none" id="addrWard" name="ward" required>',
    content
)
content = re.sub(
    r'<input type="text" class="form-control profile-input shadow-none" id="addrDetail" placeholder="Số nhà, tên đường\.\.\." required>',
    r'<input type="text" class="form-control profile-input shadow-none" id="addrDetail" name="addressLine" placeholder="Số nhà, tên đường..." required>',
    content
)
content = re.sub(
    r'<input type="text" class="form-control profile-input shadow-none" id="addrNote" placeholder="Ví dụ: Giao giờ hành chính">',
    r'<input type="text" class="form-control profile-input shadow-none" id="addrNote" name="note" placeholder="Ví dụ: Giao giờ hành chính">',
    content
)
content = re.sub(
    r'<input class="form-check-input" type="checkbox" id="addrDefault">',
    r'<input class="form-check-input" type="checkbox" id="addrDefault" name="isDefault" value="true">',
    content
)

# Replace delete modal content
delete_modal_pattern = r'(<div class="mb-3 text-danger">.*?<p class="text-muted-custom mb-4 text-sm">Bạn có chắc chắn muốn xóa địa chỉ này\? Hành động này không thể hoàn tác\.</p>).*?(<div class="d-flex gap-2 w-100">.*?<button type="button" class="tw-btn btn-profile-cancel rounded-pill py-2 w-50 fw-bold" data-bs-dismiss="modal">Hủy</button>.*?<button type="button" class="tw-btn bg-danger text-white border-0 rounded-pill py-2 w-50 fw-bold shadow-sm" onclick="confirmDelete\(\)">Xóa</button>.*?</div>)'

new_delete_modal = r'''\1
                    <form id="deleteForm" method="POST">
                        <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}" />
                        <div class="d-flex gap-2 w-100">
                            <button type="button" class="tw-btn btn-profile-cancel rounded-pill py-2 w-50 fw-bold" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="tw-btn bg-danger text-white border-0 rounded-pill py-2 w-50 fw-bold shadow-sm">Xóa</button>
                        </div>
                    </form>'''

content = re.sub(delete_modal_pattern, new_delete_modal, content, flags=re.DOTALL)


# Add saveAddress JS function
js_pattern = r'(function openAddressModal\(id, name, phone, city, district, ward, addressLine, note, isDefault\) \{)'

save_js = r'''function saveAddress() {
                document.getElementById('addressForm').submit();
            }
            \1'''

content = re.sub(js_pattern, save_js, content)


with open(r'D:\Cyan\Project\T-Winkle\src\main\resources\templates\storefront\user\addresses.html', 'w', encoding='utf-8') as f:
    f.write(content)
