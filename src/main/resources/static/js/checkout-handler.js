/**
 * T-Winkle Checkout Handler (Phase 14 Prototype)
 * Handles UI interactions, cart data loading, and summary calculations for the Checkout process.
 * Does NOT persist orders (waiting for Phase 16).
 */

document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});

const CHECKOUT_STATE = {
    items: [],
    selectedAddressId: 1,
    paymentMethod: 'COD',
    couponDiscount: 0,
    shippingFee: 30000,
    subtotal: 0,
    productDiscount: 0,
    total: 0
};

const MOCK_ADDRESSES = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        detail: '123 Lê Lợi',
        isDefault: true
    },
    {
        id: 2,
        name: 'Nguyễn Văn A',
        phone: '0987654321',
        province: 'Hà Nội',
        district: 'Quận Cầu Giấy',
        ward: 'Phường Dịch Vọng',
        detail: '456 Xuân Thủy',
        isDefault: false
    }
];

let addressModalInstance;

function initCheckout() {
    if (typeof bootstrap !== 'undefined') {
        const modalEl = document.getElementById('addressModal');
        if (modalEl) addressModalInstance = new bootstrap.Modal(modalEl);
    }
    
    loadCartData();
}

function loadCartData() {
    let cart = [];
    try {
        const stored = localStorage.getItem('twinkle_cart');
        if (stored) {
            cart = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse cart:", e);
    }

    // Contract: filter selected items. If item.selected is undefined, treat as true.
    CHECKOUT_STATE.items = cart.filter(item => item.selected !== false);

    const emptyState = document.getElementById('checkoutEmptyState');
    const contentState = document.getElementById('checkoutContent');

    if (CHECKOUT_STATE.items.length === 0) {
        emptyState.style.setProperty('display', 'flex', 'important');
        contentState.style.setProperty('display', 'none', 'important');
        return;
    }

    emptyState.style.setProperty('display', 'none', 'important');
    contentState.style.setProperty('display', 'flex', 'important');

    renderAddress();
    renderOrderItems();
    calculateAndRenderSummary();
}

function renderAddress() {
    const container = document.getElementById('checkoutAddressContainer');
    const addr = MOCK_ADDRESSES.find(a => a.id === CHECKOUT_STATE.selectedAddressId) || MOCK_ADDRESSES[0];

    const defaultBadge = addr.isDefault ? '<span class="badge bg-cyan text-white ms-2 px-2 py-1">Mặc định</span>' : '';

    container.innerHTML = `
        <div class="d-flex flex-column gap-1">
            <div class="d-flex align-items-center mb-1">
                <span class="fw-bold text-dark fs-6">${addr.name}</span>
                <span class="text-muted mx-2">|</span>
                <span class="fw-semibold text-dark">${addr.phone}</span>
                ${defaultBadge}
            </div>
            <div class="text-muted-custom">${addr.detail}</div>
            <div class="text-muted-custom">${addr.ward}, ${addr.district}, ${addr.province}</div>
        </div>
    `;

    validateOrderButton();
}

function openAddressModal() {
    const body = document.getElementById('addressModalBody');
    body.innerHTML = '';

    MOCK_ADDRESSES.forEach(addr => {
        const isSelected = addr.id === CHECKOUT_STATE.selectedAddressId;
        const borderClass = isSelected ? 'border-cyan bg-light-cyan' : 'border-light hover-bg-light';
        
        body.innerHTML += `
            <div class="p-3 mb-3 border rounded-4 cursor-pointer ${borderClass} transition-colors" onclick="selectAddress(${addr.id})">
                <div class="d-flex align-items-center mb-2">
                    <span class="fw-bold text-dark">${addr.name}</span>
                    <span class="text-muted mx-2">|</span>
                    <span class="fw-semibold text-dark">${addr.phone}</span>
                </div>
                <div class="text-muted-custom text-sm">${addr.detail}</div>
                <div class="text-muted-custom text-sm">${addr.ward}, ${addr.district}, ${addr.province}</div>
            </div>
        `;
    });

    if (addressModalInstance) addressModalInstance.show();
}

function selectAddress(id) {
    CHECKOUT_STATE.selectedAddressId = id;
    renderAddress();
    if (addressModalInstance) addressModalInstance.hide();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function renderOrderItems() {
    const container = document.getElementById('checkoutItemsContainer');
    
    // Group by store
    const groupsMap = {};
    CHECKOUT_STATE.items.forEach(item => {
        if (!groupsMap[item.storeId]) {
            groupsMap[item.storeId] = {
                storeName: item.storeName || 'Cửa hàng',
                items: []
            };
        }
        groupsMap[item.storeId].items.push(item);
    });

    let html = '';
    
    Object.values(groupsMap).forEach(group => {
        html += `
            <div class="mb-4 last-mb-0">
                <div class="store-group-header">
                    <i class="bi bi-shop text-cyan"></i>
                    ${group.storeName}
                </div>
                <div class="px-2">
        `;

        group.items.forEach((item, index) => {
            const isLast = index === group.items.length - 1;
            const borderBottom = isLast ? '' : 'border-bottom: 1px dashed rgba(226, 232, 240, 0.8);';
            const priceHtml = item.effectivePrice < item.originalPrice ?
                `<div class="d-flex align-items-center gap-2">
                    <span class="fw-bold text-danger">${formatCurrency(item.effectivePrice)}</span>
                    <span class="text-muted text-decoration-line-through text-sm">${formatCurrency(item.originalPrice)}</span>
                 </div>` :
                `<span class="fw-bold text-dark">${formatCurrency(item.effectivePrice)}</span>`;

            const variantHtml = item.variantName ? 
                `<span class="badge bg-light text-dark border px-2 py-1 mb-2" style="width: fit-content; align-self: flex-start;">${item.variantName}</span>` : '';

            const subtotal = item.effectivePrice * item.quantity;

            html += `
                <div class="d-flex gap-3 py-3" style="${borderBottom}">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200'}" alt="${item.productName}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(226, 232, 240, 0.5);">
                    <div class="flex-grow-1 min-w-0 d-flex flex-column">
                        <h6 class="fw-semibold text-dark mb-1 text-truncate" style="font-size: 0.95rem;">${item.productName}</h6>
                        ${variantHtml}
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            ${priceHtml}
                            <div class="text-muted-custom text-sm">SL: ${item.quantity}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div></div>`;
    });

    container.innerHTML = html;
}

function selectPayment(method) {
    CHECKOUT_STATE.paymentMethod = method;
    
    ['COD', 'VNPAY', 'MOMO'].forEach(m => {
        const el = document.getElementById('pay-' + m.toLowerCase());
        if (el) {
            if (m === method) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    });

    validateOrderButton();
}

function applyCoupon() {
    const input = document.getElementById('couponInput');
    const msg = document.getElementById('couponMessage');
    const code = input.value.trim().toUpperCase();

    if (!code) {
        msg.className = 'mt-2 text-sm ms-2 text-danger';
        msg.textContent = 'Vui lòng nhập mã giảm giá';
        return;
    }

    // Prototype mock logic
    if (code === 'GIAM50K') {
        CHECKOUT_STATE.couponDiscount = 50000;
        msg.className = 'mt-2 text-sm ms-2 text-success';
        msg.textContent = 'Áp dụng mã giảm 50.000đ thành công!';
        document.getElementById('appliedCouponContainer').innerHTML = `
            <div class="d-inline-flex align-items-center bg-light-cyan border border-cyan rounded-pill px-3 py-1 gap-2">
                <span class="fw-bold text-cyan text-sm">${code}</span>
                <i class="bi bi-x-circle-fill text-muted cursor-pointer" onclick="removeCoupon()"></i>
            </div>
        `;
        input.value = '';
    } else {
        msg.className = 'mt-2 text-sm ms-2 text-danger';
        msg.textContent = 'Mã giảm giá không hợp lệ hoặc đã hết hạn (Prototype mock: dùng GIAM50K)';
        CHECKOUT_STATE.couponDiscount = 0;
        document.getElementById('appliedCouponContainer').innerHTML = '';
    }

    calculateAndRenderSummary();
}

function removeCoupon() {
    CHECKOUT_STATE.couponDiscount = 0;
    document.getElementById('couponMessage').textContent = '';
    document.getElementById('appliedCouponContainer').innerHTML = '';
    calculateAndRenderSummary();
}

function calculateAndRenderSummary() {
    let subtotal = 0;
    let productDiscount = 0;

    CHECKOUT_STATE.items.forEach(item => {
        const original = item.originalPrice || item.effectivePrice;
        const effective = item.effectivePrice;
        const qty = item.quantity;
        
        subtotal += (original * qty);
        if (original > effective) {
            productDiscount += ((original - effective) * qty);
        }
    });

    CHECKOUT_STATE.subtotal = subtotal;
    CHECKOUT_STATE.productDiscount = productDiscount;

    let subtotalAfterPromo = subtotal - productDiscount;
    let actualCouponDiscount = CHECKOUT_STATE.couponDiscount;

    // Clamp discount
    if (actualCouponDiscount > subtotalAfterPromo) {
        actualCouponDiscount = subtotalAfterPromo;
    }

    const total = subtotalAfterPromo - actualCouponDiscount + CHECKOUT_STATE.shippingFee;
    CHECKOUT_STATE.total = Math.max(total, 0);

    document.getElementById('summarySubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summaryDiscount').textContent = '-' + formatCurrency(productDiscount);
    document.getElementById('summaryShipping').textContent = formatCurrency(CHECKOUT_STATE.shippingFee);
    
    const couponRow = document.getElementById('summaryCouponRow');
    if (actualCouponDiscount > 0) {
        couponRow.classList.remove('d-none');
        document.getElementById('summaryCoupon').textContent = '-' + formatCurrency(actualCouponDiscount);
    } else {
        couponRow.classList.add('d-none');
    }

    document.getElementById('summaryTotal').textContent = formatCurrency(CHECKOUT_STATE.total);

    validateOrderButton();
}

function validateOrderButton() {
    const btn = document.getElementById('placeOrderBtn');
    if (!btn) return;

    if (CHECKOUT_STATE.items.length === 0 || !CHECKOUT_STATE.selectedAddressId || !CHECKOUT_STATE.paymentMethod) {
        btn.setAttribute('disabled', 'true');
    } else {
        btn.removeAttribute('disabled');
    }
}

function placeOrder() {
    if (CHECKOUT_STATE.items.length === 0 || !CHECKOUT_STATE.selectedAddressId || !CHECKOUT_STATE.paymentMethod) {
        return;
    }

    const addr = MOCK_ADDRESSES.find(a => a.id === CHECKOUT_STATE.selectedAddressId) || MOCK_ADDRESSES[0];
    
    // Copy item data properly to ensure snapshot immutability
    const itemsSnapshot = CHECKOUT_STATE.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        image: item.image,
        storeId: item.storeId,
        storeName: item.storeName,
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        originalPrice: item.originalPrice || item.effectivePrice,
        effectivePrice: item.effectivePrice,
        lineSubtotal: item.effectivePrice * item.quantity
    }));

    const snapshot = {
        shippingAddress: {
            fullName: addr.name,
            phone: addr.phone,
            province: addr.province,
            district: addr.district,
            ward: addr.ward,
            detail: addr.detail
        },
        paymentMethod: CHECKOUT_STATE.paymentMethod,
        items: itemsSnapshot,
        subtotal: CHECKOUT_STATE.subtotal,
        productDiscount: CHECKOUT_STATE.productDiscount,
        shippingFee: CHECKOUT_STATE.shippingFee,
        couponDiscount: CHECKOUT_STATE.couponDiscount,
        total: CHECKOUT_STATE.total
    };

    if (typeof OrderHandler !== 'undefined') {
        OrderHandler.createOrder(snapshot);
        
        // Clear checkout-only state
        CHECKOUT_STATE.couponDiscount = 0;
        
        if (window.showToast) {
            window.showToast('Đặt hàng thành công!', 'success');
        }
        
        // Navigate to orders
        window.location.href = '/orders';
    } else {
        alert('OrderHandler is missing. Cannot place order.');
    }}
