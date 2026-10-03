import re

path = 'src/main/resources/templates/storefront/user/addresses.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<script>\s*let mockAddresses.*?</script>', """<script>
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
print("Removed JS from addresses.html")
