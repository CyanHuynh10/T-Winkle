import re

path = 'src/main/resources/templates/storefront/user/addresses.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the address grid
address_list = """
                        <div id="addressList" class="d-flex flex-column gap-3" th:if="${not #lists.isEmpty(addresses)}">
                            <div th:each="addr : ${addresses}" class="info-mini-surface p-3 p-md-4" th:classappend="${addr.isDefault} ? 'is-default' : ''">
                                <div class="d-flex justify-content-between align-items-start mb-2 gap-2 flex-column flex-md-row">
                                    <div>
                                        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                            <span class="fw-bold text-dark fs-6" th:text="${addr.fullName}">Name</span>
                                            <span class="text-muted-custom mx-1 d-none d-md-inline">|</span>
                                            <span class="text-muted-custom" th:text="${addr.phone}">Phone</span>
                                            <span th:if="${addr.isDefault}" class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 ms-2 px-2 py-1"><i class="bi bi-check-circle me-1"></i>Mặc định</span>
                                        </div>
                                        <div class="text-muted-custom text-sm">
                                            <div th:text="${addr.addressLine}">Address Line</div>
                                            <div th:text="${addr.ward} + ', ' + ${addr.district} + ', ' + ${addr.city}">City</div>
                                            <div th:if="${addr.note != null and !addr.note.isEmpty()}" class="mt-1 fst-italic" th:text="'Ghi chú: ' + ${addr.note}">Note</div>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-row flex-md-column align-items-end gap-2 mt-3 mt-md-0 w-100 w-md-auto justify-content-end">
                                        <div class="d-flex gap-2">
                                            <button class="btn btn-outline-cyan btn-sm rounded-pill px-3 shadow-none fw-medium" th:onclick="'openAddressModal(' + ${addr.id} + ', \\'' + ${addr.fullName} + '\\', \\'' + ${addr.phone} + '\\', \\'' + ${addr.city} + '\\', \\'' + ${addr.district} + '\\', \\'' + ${addr.ward} + '\\', \\'' + ${addr.addressLine} + '\\', \\'' + (${addr.note} != null ? ${addr.note} : '') + '\\', ' + ${addr.isDefault} + ')'">Cập nhật</button>
                                            <button th:if="${!addr.isDefault}" class="btn btn-outline-danger btn-sm rounded-pill px-3 shadow-none fw-medium" th:onclick="'confirmDelete(' + ${addr.id} + ')'">Xóa</button>
                                        </div>
                                        <form th:if="${!addr.isDefault}" th:action="@{'/addresses/default/' + ${addr.id}}" method="POST" class="m-0">
                                            <button type="submit" class="btn btn-sm btn-link text-decoration-none text-muted-custom p-0 shadow-none border-0 hover-cyan text-sm w-100 text-end">Thiết lập mặc định</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
"""
content = re.sub(r'<div id="addressList" class="d-flex flex-column gap-3">.*?</div>\s*<!-- Empty State -->', address_list + '\n<!-- Empty State -->', content, flags=re.DOTALL)

# Replace empty state
empty_state = """
                        <div id="emptyState" class="text-center py-5" th:if="${#lists.isEmpty(addresses)}">
                            <div class="mb-3">
                                <div class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                                    <i class="bi bi-geo text-muted-custom" style="font-size: 2.5rem;"></i>
                                </div>
                            </div>
                            <h5 class="fw-bold text-dark">Bạn chưa có địa chỉ nào</h5>
                            <p class="text-muted-custom text-sm max-w-sm mx-auto">Thêm địa chỉ giao hàng để thanh toán nhanh chóng và dễ dàng hơn.</p>
                        </div>
"""
content = re.sub(r'<div id="emptyState" class="text-center py-5" style="display: none;">.*?</div>\s*</div>\s*</div>\s*</main>', empty_state + '\n</div>\n</div>\n</main>', content, flags=re.DOTALL)

# Ensure Address modal is a proper form
address_form = """
        <div class="modal fade" id="addressModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(28px);">
                    <div class="modal-header border-bottom border-light px-4 pt-4">
                        <h5 class="modal-title fw-bold" id="addressModalLabel">Thêm địa chỉ mới</h5>
                        <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Đóng"></button>
                    </div>
                    <form id="addressForm" novalidate th:action="@{/addresses/save}" method="POST">
                        <div class="modal-body px-4 py-4">
                            <input type="hidden" id="addrId" name="id">
                            
                            <div class="row g-3">
                                <div class="col-12 col-md-6">
                                    <label class="form-label text-sm fw-medium text-dark">Họ và tên</label>
                                    <input type="text" class="form-control profile-input shadow-none" id="addrName" name="fullName" required>
                                </div>
                                <div class="col-12 col-md-6">
                                    <label class="form-label text-sm fw-medium text-dark">Số điện thoại</label>
                                    <input type="tel" class="form-control profile-input shadow-none" id="addrPhone" name="phone" required pattern="[0-9]{10,11}">
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label text-sm fw-medium text-dark">Tỉnh/Thành phố</label>
                                    <input type="text" class="form-control profile-input shadow-none" id="addrProvince" name="city" required>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label text-sm fw-medium text-dark">Quận/Huyện</label>
                                    <input type="text" class="form-control profile-input shadow-none" id="addrDistrict" name="district" required>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label text-sm fw-medium text-dark">Phường/Xã</label>
                                    <input type="text" class="form-control profile-input shadow-none" id="addrWard" name="ward" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label text-sm fw-medium text-dark">Địa chỉ cụ thể</label>
                                    <input type="text" class="form-control profile-input shadow-none" id="addrDetail" name="addressLine" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label text-sm fw-medium text-dark">Ghi chú (Tùy chọn)</label>
                                    <input type="text" class="form-control profile-input shadow-none" id="addrNote" name="note">
                                </div>
                                <div class="col-12 mt-3">
                                    <div class="form-check custom-checkbox">
                                        <input class="form-check-input" type="checkbox" id="addrDefault" name="isDefault">
                                        <label class="form-check-label text-sm text-dark" for="addrDefault">
                                            Đặt làm địa chỉ mặc định
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer border-top border-light px-4 pb-4">
                            <button type="button" class="tw-btn btn-profile-cancel rounded-pill px-4 py-2 fw-medium" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="tw-btn btn-profile-save rounded-pill px-5 py-2 fw-bold text-white shadow-sm">Lưu địa chỉ</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
"""
content = re.sub(r'<div class="modal fade" id="addressModal" tabindex="-1" aria-hidden="true">.*?</div>\s*</div>\s*</div>\s*<!-- Delete Confirmation Modal -->', address_form + '\n<!-- Delete Confirmation Modal -->', content, flags=re.DOTALL)

# Fix Delete Form
delete_form = """
        <div class="modal fade" id="deleteAddressModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content glass-modal rounded-4 border-0 text-center p-4">
                    <div class="mb-3 text-danger">
                        <i class="bi bi-trash" style="font-size: 3rem;"></i>
                    </div>
                    <h5 class="fw-bold text-dark mb-2">Xóa địa chỉ?</h5>
                    <p class="text-muted-custom mb-4 text-sm">Hành động này không thể hoàn tác.</p>
                    <form id="deleteForm" method="POST" class="d-flex gap-2 w-100">
                        <button type="button" class="tw-btn btn-profile-cancel rounded-pill py-2 w-50 fw-bold" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="tw-btn bg-danger text-white border-0 rounded-pill py-2 w-50 fw-bold shadow-sm">Xóa</button>
                    </form>
                </div>
            </div>
        </div>
"""
content = re.sub(r'<div class="modal fade" id="deleteAddressModal" tabindex="-1" aria-hidden="true">.*?</div>\s*</div>\s*</div>\s*<script>', delete_form + '\n<script>', content, flags=re.DOTALL)

# Delete mock JS logic
content = re.sub(r'<script>\s*let mockAddresses.*?// Handle form submission.*?function setAsDefault\(id\).*?</script>', """<script>
            let bsAddressModal;
            let bsDeleteModal;
            document.addEventListener('DOMContentLoaded', () => {
                const addModal = document.getElementById('addressModal');
                const delModal = document.getElementById('deleteAddressModal');
                if(addModal) bsAddressModal = new bootstrap.Modal(addModal);
                if(delModal) bsDeleteModal = new bootstrap.Modal(delModal);
            });
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
        </script>""", content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated addresses.html")
