/**
 * T-Winkle Checkout Handler
 * UI-only interactions for the checkout page.
 * All data is rendered by Thymeleaf. Form submits to /checkout/process.
 */

function selectPayment(method) {
    const hiddenPayment = document.getElementById('hiddenPaymentMethod');
    if (hiddenPayment) hiddenPayment.value = method;
    
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
}

function selectCheckoutAddress(id) {
    const hiddenAddress = document.querySelector('input[name="addressId"]');
    if (hiddenAddress) hiddenAddress.value = id;
    
    // Update visual selection in modal
    document.querySelectorAll('#addressModalBody > div').forEach(div => {
        div.classList.remove('border-primary', 'bg-light');
        div.classList.add('border-light');
    });
    event.currentTarget.classList.remove('border-light');
    event.currentTarget.classList.add('border-primary', 'bg-light');
    
    // Update the main address display
    const nameEl = event.currentTarget.querySelector('.fw-bold');
    const phoneEl = event.currentTarget.querySelector('.fw-semibold');
    const addrEl = event.currentTarget.querySelector('.text-muted-custom');
    
    const container = document.getElementById('checkoutAddressContainer');
    if (container && nameEl && phoneEl && addrEl) {
        container.innerHTML = `
            <div class="d-flex flex-column">
                <span class="fw-bold text-dark mb-1">${nameEl.textContent} | ${phoneEl.textContent}</span>
                <span class="text-muted text-sm">${addrEl.textContent}</span>
            </div>
        `;
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addressModal'));
    if (modal) modal.hide();
}

function applyCoupon() {
    const input = document.getElementById('couponInput');
    const code = input.value.trim();
    const hiddenCoupon = document.getElementById('hiddenCouponCode');
    if (hiddenCoupon) hiddenCoupon.value = code;
    
    const msg = document.getElementById('couponMessage');
    if (!code) {
        msg.className = 'mt-2 text-sm ms-2 text-danger';
        msg.textContent = 'Vui lòng nhập mã giảm giá';
        return;
    }
    msg.className = 'mt-2 text-sm ms-2 text-info';
    msg.textContent = 'Mã giảm giá sẽ được áp dụng khi đặt hàng';
}
