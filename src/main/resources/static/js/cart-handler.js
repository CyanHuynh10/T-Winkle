/* The existing detail modal selects actual PRODUCT_VARIANTS / STORE_INVENTORY. */
window.initializeProductSelection = function(modal, preferredStoreId) {
    const variants = [...modal.querySelectorAll('#modalVariantMatrix [data-variant-id]')].map(el => ({
        id: el.dataset.variantId, size: el.dataset.size || '', color: el.dataset.color || '',
        effectivePrice: Number(el.dataset.effectivePrice || 0), image: el.dataset.image
    }));
    const rows = [...modal.querySelectorAll('#modalStores [data-variant-id]')];
    const carriedIds = new Set(rows.filter(row => !preferredStoreId || row.querySelector('button').dataset.storeId === String(preferredStoreId)).map(row => row.dataset.variantId));
    const eligibleVariants = variants.filter(variant => carriedIds.has(variant.id));
    const quantity = modal.querySelector('#modalQuantity');
    const cart = modal.querySelector('#modalAddToCartBtn');
    let size = null, color = null, selectedVariant = null, selectedStore = null;
    function choices(containerId, field) {
        const container = modal.querySelector(containerId);
        container.replaceChildren();
        for (const value of [...new Set(variants.map(v => v[field]))]) {
            const button = document.createElement('button');
            button.type = 'button'; button.textContent = value || 'Mặc định'; button.dataset.value = value;
            button.className = 'btn btn-outline-dark px-3 py-1 fw-medium text-sm ' + field + '-btn';
            button.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (field === 'size') size = value; else color = value;
                selectedStore = null; refresh();
            });
            container.appendChild(button);
        }
    }
    function refresh() {
        const matches = variants.filter(v => v.size === size && v.color === color);
        selectedVariant = matches.length === 1 ? matches[0] : null;
        for (const field of ['size', 'color']) {
            modal.querySelectorAll('#modal' + (field === 'size' ? 'Sizes' : 'Colors') + ' button').forEach(button => {
                const value = button.dataset.value;
                const active = value === (field === 'size' ? size : color);
                button.classList.toggle('btn-dark', active); button.classList.toggle('text-white', active);
                button.classList.toggle('btn-outline-dark', !active);
                button.disabled = !eligibleVariants.some(v => v[field] === value &&
                    (field === 'size' ? color === null || v.color === color : size === null || v.size === size));
            });
        }
        const availableRows = [];
        rows.forEach(row => {
            const visible = selectedVariant && row.dataset.variantId === selectedVariant.id &&
                (!preferredStoreId || row.querySelector('button').dataset.storeId === String(preferredStoreId));
            row.hidden = !visible;
            row.style.setProperty('display', visible ? 'flex' : 'none', 'important');
            if (visible) availableRows.push(row);
            const button = row.querySelector('button');
            const active = visible && button.dataset.storeId === selectedStore;
            button.classList.toggle('active', !!active);
            button.setAttribute('aria-pressed', String(!!active));
        });
        const hint = modal.querySelector('#modalStoreHint');
        hint.textContent = !selectedVariant ? 'Vui lòng chọn size và màu để xem tồn kho' :
            availableRows.length ? 'Chọn cửa hàng để thêm vào giỏ' : 'Cửa hàng không kinh doanh biến thể này';
        modal.querySelector('#modalVariantHint').textContent = '* Đang chọn: ' +
            (color === null ? '...' : color || 'Mặc định') + ' / ' + (size === null ? '...' : size || 'Mặc định');
        const price = modal.querySelector('#modalProductPrice');
        price.textContent = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
            selectedVariant ? Number(availableRows.find(row => row.querySelector('button').dataset.storeId === selectedStore)?.dataset.effectivePrice ?? selectedVariant.effectivePrice) : Number(price.dataset.basePrice || 0));
        const image = modal.querySelector('#modalProductImage');
        if (image) {
            if (!image.dataset.primaryImage) image.dataset.primaryImage = image.getAttribute('src');
            image.src = selectedVariant && selectedVariant.image ? selectedVariant.image : image.dataset.primaryImage;
        }
        const chosenRow = availableRows.find(row => !row.querySelector('button').disabled && row.querySelector('button').dataset.storeId === selectedStore);
        const stock = chosenRow ? Number(chosenRow.dataset.quantity) : 0;
        const stockHint = modal.querySelector('#modalStockHint');
        stockHint.textContent = chosenRow ? '* Còn lại: ' + stock + ' sản phẩm' : '';
        stockHint.hidden = !chosenRow;
        const qty = Number(quantity.value);
        quantity.max = stock || '';
        quantity.disabled = !chosenRow;
        modal.querySelector('#modalQuantityMinus').disabled = !chosenRow || !Number.isSafeInteger(qty) || qty <= 1;
        modal.querySelector('#modalQuantityPlus').disabled = !chosenRow || !Number.isSafeInteger(qty) || qty >= stock;
        cart.disabled = !selectedVariant || !chosenRow || !Number.isSafeInteger(qty) || qty < 1 || qty > stock;
        const selectionHint = !selectedVariant ? 'Chọn size và màu sản phẩm' : !chosenRow ? 'Nhấn trạng thái tồn kho để chọn cửa hàng' : cart.disabled ? 'Nhập số lượng hợp lệ trong tồn kho' : 'Đã chọn ' + size + ' / ' + color + '. Nhấn giỏ hàng để thêm sản phẩm';
        modal.querySelector('#modalCartHint').textContent = selectionHint;
        cart.title = selectionHint;
        quantity.setCustomValidity(chosenRow && (!Number.isSafeInteger(qty) || qty < 1 || qty > stock) ? 'Số lượng phải từ 1 đến tồn kho hiện tại' : '');
        cart.dataset.variantId = selectedVariant ? selectedVariant.id : '';
        cart.dataset.storeId = chosenRow ? selectedStore : '';
    }
    choices('#modalSizes', 'size'); choices('#modalColors', 'color');
    rows.forEach(row => row.querySelector('button').addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation(); selectedStore = e.currentTarget.dataset.storeId;
        quantity.value = '1'; quantity.dataset.committed = '1';refresh();
    }));
    quantity.dataset.committed = '1';
    window.TwQuantity.bind(quantity.closest('.quantity-control'), {
        input:'#modalQuantity', step:'[data-quantity-step]',
        commit:(_,value) => {quantity.value = String(value);quantity.dataset.committed = value;refresh();},
        draft:refresh,
        invalid:() => {window.showToast('Số lượng phải từ 1 đến tồn kho hiện tại', 'error');refresh();}
    });refresh();
};
document.addEventListener('click', function(e) {
    const button = e.target.closest('#modalAddToCartBtn');
    if (!button || button.disabled) return;
    e.preventDefault(); e.stopPropagation();
    if (!document.querySelector('.auth-username')) { window.location.href = '/login'; return; }
    const modal = button.closest('#productDetailModal');
    postToCartAdd(modal.dataset.productId, button.dataset.variantId, button.dataset.storeId, modal.querySelector('#modalQuantity').value);
}, true);
async function postToCartAdd(productId, variantId, storeId, quantity) {
    if (!productId || !variantId || !storeId || !Number.isSafeInteger(Number(quantity)) || Number(quantity) < 1) {
        window.showToast('Vui lòng chọn size, màu, cửa hàng và số lượng hợp lệ', 'error'); return;
    }
    const fields = {productId, variantId, storeId, quantity, _csrf: document.querySelector('meta[name="_csrf"]').content};
    const button = document.getElementById('modalAddToCartBtn');button.disabled = true;
    try {
        const response = await fetch('/cart/api/add', {method:'POST',headers:{Accept:'application/json'},body:new URLSearchParams(fields)});
        if (response.redirected) {location.href='/login';return;}
        const body = await response.json();
        if(body.state) window.updateCartBadge(body.state);
        if(!response.ok) throw Error(body.error || 'Không thể thêm sản phẩm vào giỏ hàng');
        window.dispatchEvent(new CustomEvent('cart:changed', {detail:body.state}));
        window.showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
    } catch(error) {window.showToast(error.message,'error');}
    finally {document.getElementById('modalQuantity')?.dispatchEvent(new Event('input', {bubbles:true}));}
}
