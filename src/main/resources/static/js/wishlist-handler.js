/* One database-backed wishlist flow for cards and the detail modal. */
document.addEventListener('click', async function(e) {
    const button = e.target.closest('.wishlist-btn');
    if (!button) return;
    e.preventDefault(); e.stopPropagation();
    if (!document.querySelector('.auth-username')) { window.location.href = '/login'; return; }
    const productId = button.dataset.productId;
    if (!productId || button.disabled) return;
    button.disabled = true;
    try {
        const token = document.querySelector('meta[name="_csrf"]').content;
        const header = document.querySelector('meta[name="_csrf_header"]').content;
        const response = await fetch('/wishlist/toggle', {
            method: 'POST', headers: {Accept: 'application/json', [header]: token},
            body: new URLSearchParams({productId})
        });
        if (response.redirected || response.status === 401) { window.location.href = '/login'; return; }
        if (!response.ok) throw new Error('Wishlist update failed');
        const {inWishlist} = await response.json();
        document.querySelectorAll('.wishlist-btn').forEach(heart => {
            if (heart.dataset.productId !== productId) return;
            heart.classList.toggle('active', inWishlist); heart.classList.toggle('text-danger', inWishlist);
            heart.classList.toggle('text-muted-custom', !inWishlist);
            const icon = heart.querySelector('i');
            icon.classList.toggle('bi-heart-fill', inWishlist); icon.classList.toggle('bi-heart', !inWishlist);
        });
        if (location.pathname === '/wishlist') { location.reload(); return; }
        window.showToast(inWishlist ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích', 'success');
    } catch (error) {
        window.showToast('Không thể cập nhật yêu thích. Vui lòng thử lại', 'error');
    } finally { button.disabled = false; }
}, true);
