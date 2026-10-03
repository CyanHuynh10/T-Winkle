/**
 * T-Winkle Wishlist Handler
 * Handles wishlist toggle via backend POST to /wishlist/toggle
 */
document.addEventListener('click', function(e) {
    const wishlistBtn = e.target.closest('.wishlist-btn');
    if (!wishlistBtn) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    // Check auth
    const authUser = document.querySelector('.auth-username');
    if (!authUser) {
        window.location.href = '/login';
        return;
    }
    
    const productId = wishlistBtn.getAttribute('data-product-id');
    if (!productId) return;
    
    // Create form POST to backend
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/wishlist/toggle';
    form.style.display = 'none';
    
    const inputProductId = document.createElement('input');
    inputProductId.type = 'hidden';
    inputProductId.name = 'productId';
    inputProductId.value = productId;
    form.appendChild(inputProductId);
    
    // CSRF token
    const csrfMeta = document.querySelector('meta[name="_csrf"]');
    const csrfHeaderMeta = document.querySelector('meta[name="_csrf_header"]');
    if (csrfMeta) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        csrfInput.value = csrfMeta.content;
        form.appendChild(csrfInput);
    } else {
        // Fallback: try to find CSRF from existing form
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
}, true);
