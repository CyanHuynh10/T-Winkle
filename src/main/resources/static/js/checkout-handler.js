function selectPayment(method) {
    if (!['COD','BANKING'].includes(method) || document.getElementById('pay-' + method.toLowerCase())?.getAttribute('aria-disabled') === 'true') return;
    document.getElementById('hiddenPaymentMethod').value = method;
    ['COD','BANKING'].forEach(value => {
        const card = document.getElementById('pay-' + value.toLowerCase());
        card.classList.toggle('active', method === value); card.setAttribute('aria-checked', String(method === value));
    });
}
function selectCheckoutAddress(element, id) {
    document.querySelector('[name=addressId]').value = id;
    document.querySelectorAll('#addressModalBody > div').forEach(row => {
        row.classList.toggle('border-primary', row === element); row.classList.toggle('bg-light', row === element);
    });
    const container = document.getElementById('checkoutAddressContainer');
    const copy = document.createElement('div'); copy.className = 'd-flex flex-column';
    const title = document.createElement('span'); title.className = 'fw-bold mb-1';
    title.textContent = element.querySelector('.fw-bold').textContent + ' | ' + element.querySelector('.fw-semibold').textContent;
    const address = document.createElement('span'); address.className = 'text-muted text-sm';
    address.textContent = element.querySelector('.text-muted-custom').textContent;
    copy.append(title,address); container.replaceChildren(copy);
    bootstrap.Modal.getInstance(document.getElementById('addressModal')).hide();
}
let quoteRequest;
async function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim();
    if (quoteRequest) quoteRequest.abort(); quoteRequest = new AbortController();
    const hidden = document.getElementById('hiddenCouponCode'); hidden.value = '';
    try {
        const response = await fetch('/checkout/quote?couponCode=' + encodeURIComponent(code), {signal:quoteRequest.signal});
        const quote = await response.json();
        if (!response.ok) throw new Error(quote.error || 'Không thể tính tổng đơn hàng.');
        hidden.value = code;
        const money = value => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(value);
        for(const [id,value] of Object.entries({summarySubtotal:quote.subtotal,summaryProductDiscount:quote.productDiscount,summaryShipping:quote.shippingFee,summaryCouponDiscount:quote.couponDiscount,summaryTotal:quote.total})) document.getElementById(id).textContent = money(value);
        const message = document.getElementById('couponMessage');message.className = 'mt-2 text-sm text-success';
        message.textContent = code ? 'Đã áp dụng mã giảm giá.' : 'Đã bỏ mã giảm giá.';
    } catch(error) {
        if(error.name === 'AbortError') return;
        if(code) {document.getElementById('couponInput').value = '';await applyCoupon();}
        window.showToast(error.message,'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.payment-option').forEach(card => card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();selectPayment(card.id.slice(4).toUpperCase());}
    }));
    document.getElementById('couponBrowser')?.addEventListener('show.bs.modal', async () => {
        const list = document.getElementById('couponBrowserList');list.replaceChildren();
        try {
            const response = await fetch('/checkout/coupons', {headers:{Accept:'application/json'}});
            if (!response.ok || response.redirected) throw Error('Không thể tải mã giảm giá.');
            const coupons = await response.json();
            if (!coupons.length) {list.textContent = 'Chưa có mã giảm giá.';return;}
            const money = value => new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(value);
            for (const coupon of coupons) {
                const card = document.createElement('article');card.className = 'coupon-option border rounded-3 p-3 mb-3' + (coupon.available?'':' coupon-unavailable');card.dataset.couponCode = coupon.code;card.setAttribute('role','listitem');
                const code = document.createElement('h6');code.className = 'fw-bold mb-2';code.textContent = coupon.code;
                const details = document.createElement('p');details.className = 'text-sm mb-2';
                details.textContent = coupon.discountType + ' · ' + (coupon.discountType === 'PERCENT' ? coupon.discountValue + '%' : money(coupon.discountValue));
                const minimum = document.createElement('p');minimum.className = 'text-sm mb-2';minimum.textContent = coupon.minOrderValue > 0 ? 'Đơn tối thiểu: ' + money(coupon.minOrderValue) : 'Không yêu cầu giá trị đơn tối thiểu';
                const validity = document.createElement('p');validity.className = 'text-sm text-muted mb-2';validity.textContent = 'Hiệu lực: ' + new Date(coupon.startsAt).toLocaleDateString('vi-VN') + ' – ' + new Date(coupon.endsAt).toLocaleDateString('vi-VN');
                const usage = document.createElement('p');usage.className = 'text-sm mb-2';usage.textContent = coupon.reason || (coupon.remainingUsage === null ? 'Không giới hạn lượt dùng' : 'Còn ' + coupon.remainingUsage + ' lượt');
                const actions = document.createElement('div');actions.className = 'd-flex gap-2';
                const apply = document.createElement('button');apply.type = 'button';apply.className = 'btn btn-sm coupon-apply rounded-pill';apply.textContent = 'Dùng mã';apply.disabled = !coupon.available;
                apply.addEventListener('click', async () => {document.getElementById('couponInput').value = coupon.code;await applyCoupon();bootstrap.Modal.getInstance(document.getElementById('couponBrowser')).hide();});
                const copy = document.createElement('button');copy.type = 'button';copy.className = 'btn btn-sm coupon-copy rounded-pill';copy.textContent = 'Sao chép';copy.disabled = !coupon.available;
                copy.addEventListener('click', async () => {try {await navigator.clipboard.writeText(coupon.code);window.showToast('Đã sao chép mã giảm giá.','success');}catch{window.showToast('Không thể sao chép mã.','error');}});
                actions.append(apply,copy);card.append(code,details,minimum,validity,usage,actions);list.append(card);
            }
        } catch(error) {list.textContent = error.message;window.showToast(error.message,'error');}
    });
});
