/**
 * T-Winkle Cart Handler
 * Handles add-to-cart via form POST to /cart/add
 * Cart page operations (update, remove, toggle) are handled by Thymeleaf forms in cart.html
 */

// Variant selection in product detail modal
document.addEventListener('click', function(e) {
    // Size button selection
    if (e.target.closest('.size-btn')) {
        const btn = e.target.closest('.size-btn');
        if (btn.disabled) return;
        e.stopPropagation();
        const container = btn.closest('.d-flex.flex-wrap.gap-2');
        if (container) {
            container.querySelectorAll('.size-btn').forEach(b => {
                b.classList.remove('btn-dark', 'text-white');
                b.classList.add('btn-outline-dark');
            });
        }
        btn.classList.add('btn-dark', 'text-white');
        btn.classList.remove('btn-outline-dark');
        updateVariantHint();
    }
    
    // Color button selection
    if (e.target.closest('.color-btn')) {
        const btn = e.target.closest('.color-btn');
        if (btn.disabled) return;
        e.stopPropagation();
        const container = btn.closest('.d-flex.flex-wrap.gap-2');
        if (container) {
            container.querySelectorAll('.color-btn').forEach(b => {
                b.classList.remove('btn-dark', 'text-white');
                b.classList.add('btn-outline-dark');
            });
        }
        btn.classList.add('btn-dark', 'text-white');
        btn.classList.remove('btn-outline-dark');
        updateVariantHint();
    }
    
    // Add to Cart button in modal
    if (e.target.closest('#modalAddToCartBtn')) {
        e.stopPropagation();
        e.preventDefault();
        submitToCart();
    }
});

function updateVariantHint() {
    const modal = document.getElementById('productDetailModal');
    if (!modal) return;
    const sizeBtn = modal.querySelector('.size-btn.btn-dark');
    const colorBtn = modal.querySelector('.color-btn.btn-dark');
    const hint = modal.querySelector('.fst-italic');
    if (hint) {
        let text = '* Đang chọn: ';
        if (colorBtn) text += colorBtn.textContent.trim();
        else text += '...';
        text += ' / ';
        if (sizeBtn) text += sizeBtn.textContent.trim();
        else text += '...';
        hint.textContent = text;
    }
}

function submitToCart() {
    const modal = document.getElementById('productDetailModal');
    if (!modal) return;
    
    // Get selected variant
    const selectedVariantBtn = modal.querySelector('.size-btn.btn-dark[data-variant-id], .color-btn.btn-dark[data-variant-id]');
    const variantId = selectedVariantBtn ? selectedVariantBtn.getAttribute('data-variant-id') : null;
    
    // Get selected store
    const selectedStoreBtn = modal.querySelector('.store-select-btn.active, [data-store-id].btn-primary');
    const storeId = selectedStoreBtn ? selectedStoreBtn.getAttribute('data-store-id') : null;
    
    // Also check hidden inputs
    const hiddenVariant = document.getElementById('selectedVariantId');
    const hiddenStore = document.getElementById('selectedStoreId');
    const finalVariantId = variantId || (hiddenVariant ? hiddenVariant.value : null);
    const finalStoreId = storeId || (hiddenStore ? hiddenStore.value : null);
    
    if (!finalVariantId || !finalStoreId) {
        if (window.showToast) window.showToast('Vui lòng chọn Size/Màu và Cửa hàng', 'warning');
        else alert('Vui lòng chọn Size/Màu và Cửa hàng');
        return;
    }
    
    // Create form POST to /cart/add
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/cart/add';
    form.style.display = 'none';
    
    const inputVariant = document.createElement('input');
    inputVariant.type = 'hidden';
    inputVariant.name = 'variantId';
    inputVariant.value = finalVariantId;
    form.appendChild(inputVariant);
    
    const inputStore = document.createElement('input');
    inputStore.type = 'hidden';
    inputStore.name = 'storeId';
    inputStore.value = finalStoreId;
    form.appendChild(inputStore);
    
    const inputQty = document.createElement('input');
    inputQty.type = 'hidden';
    inputQty.name = 'quantity';
    inputQty.value = '1';
    form.appendChild(inputQty);
    
    // CSRF token
    const csrfMeta = document.querySelector('meta[name="_csrf"]');
    if (csrfMeta) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        csrfInput.value = csrfMeta.content;
        form.appendChild(csrfInput);
    } else {
        const existingCsrf = document.querySelector('input[name="_csrf"]');
        if (existingCsrf) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_csrf';
            csrfInput.value = existingCsrf.value;
            form.appendChild(csrfInput);
        }
    }
    
    document.body.appendChild(form);
    form.submit();
}
