document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('cartGroupsContainer');
    if (!root) return;
    let queue = Promise.resolve();
    const money = value => new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(value);
    function render(state) {
        window.updateCartBadge(state);
        const ids = new Set(state.items.map(i => String(i.id)));
        root.querySelectorAll('[data-cart-item-id]').forEach(row => {if (!ids.has(row.dataset.cartItemId)) row.remove();});
        root.querySelectorAll('.cart-main-card').forEach(group => {if (!group.querySelector('[data-cart-item-id]')) group.remove();});
        for (const item of state.items) {
            const row = root.querySelector(`[data-cart-item-id="${item.id}"]`); if (!row) continue;
            const check = row.querySelector('[data-cart-select]'); check.checked = item.selected && item.available; check.disabled = !item.available;
            const input = row.querySelector('[data-cart-quantity]'); input.value = item.quantity; input.dataset.committed = item.quantity; input.max = item.stock; input.disabled = !item.available;
            row.querySelector('[data-cart-stock]').textContent = '* Còn lại: ' + item.stock + ' sản phẩm';
            row.querySelector('[data-cart-step="-1"]').disabled = !item.available || item.quantity <= 1;
            row.querySelector('[data-cart-step="1"]').disabled = !item.available || item.quantity >= item.stock;
            const reason = row.querySelector('.cart-unavailable-reason'); reason.textContent = item.reason || ''; reason.classList.toggle('d-none', item.available);
            row.querySelector('button[type=submit]').disabled = false;
            row.dataset.unavailable = String(!item.available);
            const price = row.querySelector('[data-cart-price]'); if (price) price.textContent = money(item.unitPrice);
        }
        const checkout = document.getElementById('checkoutBtn');
        checkout.classList.toggle('disabled', !state.checkoutEligible); checkout.setAttribute('aria-disabled', String(!state.checkoutEligible));
        document.getElementById('cartContent').classList.toggle('d-none', !state.items.length);
        document.getElementById('cartEmptyState').classList.toggle('d-none', !!state.items.length);
    }
    async function readState() {
        const response = await fetch('/cart/api/state', {headers:{Accept:'application/json'}});
        if (response.redirected || !response.ok) throw Error('Phiên đăng nhập đã hết hạn. Vui lòng tải lại và đăng nhập');
        return response.json();
    }
    function mutate(row, operation, fields) {
        queue = queue.catch(() => {}).then(async () => {
            row.querySelectorAll('button,input[type=checkbox],input[type=number]').forEach(el => el.disabled = true);
            try {
                const response = await fetch('/cart/api/' + operation, {method:'POST',headers:{Accept:'application/json'},body:new URLSearchParams({cartItemId:row.dataset.cartItemId,...fields,_csrf:document.querySelector('meta[name=_csrf]').content})});
                if (response.redirected) throw Error('Phiên đăng nhập đã hết hạn. Vui lòng tải lại và đăng nhập');
                const body = await response.json();
                if (body.state) render(body.state);
                if (!response.ok) throw Error(body.error || 'Không thể cập nhật giỏ hàng');
            } catch (error) {
                window.showToast(error.message, 'error');
                try {render(await readState());} catch {}
            }
        });
        return queue;
    }
    function quantity(row, value) {
        const input = row.querySelector('[data-cart-quantity]'), number = window.TwQuantity.parse(value, input.max);
        if (number === null) {
            window.showToast('Số lượng phải từ 1 đến tồn kho hiện tại', 'error'); readState().then(render).catch(() => {}); return;
        }
        mutate(row, 'update', {quantity:number});
    }
    root.addEventListener('change', e => {
        const row = e.target.closest('[data-cart-item-id]'); if (!row) return;
        if (e.target.matches('[data-cart-select]')) mutate(row, 'select', {isSelected:e.target.checked});
    });
    window.TwQuantity.bind(root, {input:'[data-cart-quantity]', step:'[data-cart-step]', scope:'[data-cart-item-id]',
        commit:(row, value) => quantity(row, value),
        invalid:() => {window.showToast('Số lượng phải từ 1 đến tồn kho hiện tại', 'error');readState().then(render).catch(() => {});}
    });
    window.addEventListener('cart:changed', async () => {
        const response = await fetch('/cart');
        if (!response.ok || response.redirected) return;
        const documentCopy = new DOMParser().parseFromString(await response.text(),'text/html');
        root.replaceChildren(...documentCopy.querySelector('#cartGroupsContainer').childNodes);
        render(await readState());
    });
    root.addEventListener('submit', e => {
        const form = e.target.closest('[data-cart-operation]'); if (!form) return;
        e.preventDefault();
        if (form.dataset.cartOperation === 'remove') mutate(form.closest('[data-cart-item-id]'), 'remove', {});
        else if (form.dataset.cartOperation === 'update') quantity(form.closest('[data-cart-item-id]'), form.querySelector('[name=quantity]').value);
    });
    document.getElementById('checkoutBtn').addEventListener('click', e => {if(e.currentTarget.getAttribute('aria-disabled') === 'true') e.preventDefault();});
    // Reads stay read-only. Stale legacy selections are cleared only by protected mutation requests.
    readState().then(async state => {
        render(state);
        for (const item of state.items.filter(i => i.selected && !i.available)) {
            await mutate(root.querySelector(`[data-cart-item-id="${item.id}"]`), 'select', {isSelected:false});
        }
    }).catch(error => window.showToast(error.message, 'error'));
});
