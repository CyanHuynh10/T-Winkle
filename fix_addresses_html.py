import os

base_dir = r'D:\Cyan\Project\T-Winkle'
addresses_html = os.path.join(base_dir, 'src', 'main', 'resources', 'templates', 'storefront', 'user', 'addresses.html')

with open(addresses_html, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove mock JS
content = re.sub(r'<script>\s*let mockAddresses.*?</script>', '''<script>
            let bsAddressModal;
            let bsDeleteModal;
            document.addEventListener('DOMContentLoaded', () => {
                const addModal = document.getElementById('addressModal');
                const delModal = document.getElementById('deleteModal');
                if(addModal) bsAddressModal = new bootstrap.Modal(addModal);
                if(delModal) bsDeleteModal = new bootstrap.Modal(delModal);
            });
            function saveAddress() {
                document.getElementById('addressForm').submit();
            }
            function openAddressModal(id, name, phone, city, district, ward, addressLine, note, isDefault) {
                document.getElementById('addressForm').classList.remove('was-validated');
                const modalLabel = document.getElementById('addressModalLabel');
                if (id) {
                    modalLabel.textContent = 'Chỉnh sửa địa chỉ';
                    document.getElementById('addrId').value = id;
                    document.getElementById('addrName').value = name || '';
                    document.getElementById('addrPhone').value = phone || '';
                    document.getElementById('addrProvince').value = city || '';
                    document.getElementById('addrDistrict').value = district || '';
                    document.getElementById('addrWard').value = ward || '';
                    document.getElementById('addrDetail').value = addressLine || '';
                    document.getElementById('addrNote').value = note || '';
                    document.getElementById('addrDefault').checked = isDefault;
                } else {
                    modalLabel.textContent = 'Thêm địa chỉ mới';
                    document.getElementById('addressForm').reset();
                    document.getElementById('addrId').value = '';
                }
                if(bsAddressModal) bsAddressModal.show();
            }
            function confirmDelete(id) {
                document.getElementById('deleteForm').action = '/addresses/delete/' + id;
                if(bsDeleteModal) bsDeleteModal.show();
            }
        </script>''', content, flags=re.DOTALL)

# Add Thymeleaf rendering for Address List
addr_list_start = '<div id="addressList" class="d-flex flex-column gap-3">\n                            <!-- Cards rendered by JS -->\n                        </div>'
new_addr_list = '''<div id="addressList" class="d-flex flex-column gap-3">
                            <div th:each="addr : " class="glass-card rounded-4 p-4 border position-relative" th:classappend=" ? 'border-primary border-opacity-50' : 'border-light'">
                                <span th:if="" class="badge bg-primary text-white position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill shadow-sm">Mặc định</span>
                                
                                <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                                    <div class="flex-grow-1 pe-md-5">
                                        <div class="d-flex align-items-center gap-3 mb-2">
                                            <h5 class="fw-bold text-dark mb-0 m-0" style="font-size: 1.1rem;" th:text="">Name</h5>
                                            <div class="text-muted-custom">|</div>
                                            <span class="fw-semibold" style="color: #475569;" th:text="">Phone</span>
                                        </div>
                                        
                                        <div class="text-muted-custom text-sm mb-1 mt-2">
                                            <i class="bi bi-geo-alt me-1 text-cyan"></i>
                                            <span th:text="">Address Line</span>
                                        </div>
                                        <div class="text-muted-custom text-sm ps-3 ms-1" th:text=" + ', ' +  + ', ' + ">Ward, District, City</div>
                                        
                                        <div th:if="" class="mt-2 text-sm">
                                            <span class="badge bg-light text-dark fw-medium border px-2 py-1"><i class="bi bi-journal-text me-1 text-muted"></i><span th:text="">Note</span></span>
                                        </div>
                                    </div>
                                    
                                    <div class="d-flex flex-row flex-md-column align-items-end gap-2 w-100 mt-2 mt-md-0" style="max-width: 180px;">
                                        <div class="d-flex gap-2 w-100">
                                            <button class="tw-btn btn-profile-primary rounded-pill py-1 flex-grow-1 text-sm fw-medium" th:onclick="openAddressModal([[]], [[]], [[]], [[]], [[]], [[]], [[]], [[]], [[]])">
                                                <i class="bi bi-pencil-square me-1"></i>Sửa
                                            </button>
                                            <button th:if="" class="tw-btn bg-danger bg-opacity-10 text-danger border-0 rounded-pill py-1 px-3 text-sm fw-medium" th:onclick="confirmDelete([[]])">
                                                <i class="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                        <form th:if="" th:action="@{/addresses/default/{id}(id=)}" method="POST" class="w-100">
                                            <button type="submit" class="tw-btn bg-white border rounded-pill py-1 w-100 text-sm fw-medium text-dark hover-cyan mt-1">Đặt mặc định</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>'''

content = content.replace(addr_list_start, new_addr_list)

with open(addresses_html, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated addresses.html")
