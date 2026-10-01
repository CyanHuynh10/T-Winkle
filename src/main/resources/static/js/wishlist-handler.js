/**
 * Wishlist Handler Module
 */
const WishlistHandler = {
    getWishlist: function() {
        return JSON.parse(localStorage.getItem('twinkle_wishlist')) || [];
    },
    saveWishlist: function(wishlist) {
        localStorage.setItem('twinkle_wishlist', JSON.stringify(wishlist));
    },
    add: function(product) {
        let wishlist = this.getWishlist();
        if (!this.has(product.productId)) {
            wishlist.push(product);
            this.saveWishlist(wishlist);
            if(window.showToast) window.showToast('Đã thêm sản phẩm vào danh sách yêu thích.', 'success');
        }
    },
    remove: function(productId) {
        let wishlist = this.getWishlist();
        wishlist = wishlist.filter(p => p.productId !== productId);
        this.saveWishlist(wishlist);
        if(window.showToast) window.showToast('Đã xóa sản phẩm khỏi danh sách yêu thích.', 'success');
    },
    has: function(productId) {
        return this.getWishlist().some(p => p.productId === productId);
    },
    toggle: function(product) {
        if (this.has(product.productId)) {
            this.remove(product.productId);
            return false;
        } else {
            this.add(product);
            return true;
        }
    },
    syncUI: function(preventRender = false) {
        // Sync all wishlist buttons on the page
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productCard = btn.closest('.product-card');
            const productDetail = btn.closest('.modal-content') || btn.closest('.detail-divider-panel')?.parentElement;

            let productId = null;

            if (productCard) {
                // Try to find the cart button to parse product data
                const addBtn = productCard.querySelector('button[aria-label="Thêm vào giỏ hàng"]');
                if (addBtn && addBtn.hasAttribute('onclick')) {
                    const match = addBtn.getAttribute('onclick').match(/CartHandler\.addToCart\((.*?)\);/);
                    if (match) {
                        try {
                            const rawStr = match[1].replace(/&quot;/g, '"');
                            const productData = new Function('return ' + rawStr)();

                            // Emulate same ID logic as cart-handler modal logic
                            const nameEl = productCard.querySelector('h3.h5');
                            if (nameEl) {
                                let hash = 0;
                                const name = nameEl.textContent.trim();
                                for (let i = 0; i < name.length; i++) {
                                    hash = ((hash << 5) - hash) + name.charCodeAt(i);
                                    hash = hash & hash;
                                }
                                productId = Math.abs(hash);
                            } else {
                                productId = productData.productId;
                            }
                        } catch (e) {
                            console.error('Error parsing product data for wishlist', e);
                        }
                    }
                }

                // If this is a card generated on /wishlist page directly
                if (!productId && productCard.dataset.productId) {
                    productId = parseInt(productCard.dataset.productId);
                }
            } else if (productDetail) {
                // It's the product detail modal, read from dataset
                const modal = document.getElementById('productDetailModal');
                if (modal && modal.dataset.productData) {
                    try {
                        const productData = JSON.parse(modal.dataset.productData);
                        productId = productData.productId;
                    } catch (e) {}
                }
            }

            if (productId !== null) {
                const icon = btn.querySelector('i');
                if (this.has(productId)) {
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                    btn.classList.remove('text-muted-custom');
                    btn.classList.add('text-danger');
                    btn.setAttribute('aria-label', 'Xóa khỏi yêu thích');
                } else {
                    icon.classList.remove('bi-heart-fill');
                    icon.classList.add('bi-heart');
                    btn.classList.remove('text-danger');
                    btn.classList.add('text-muted-custom');
                    btn.setAttribute('aria-label', 'Thêm vào yêu thích');
                }
            }
        });

        // Custom logic for /wishlist page refresh
        if (!preventRender && window.location.pathname === '/wishlist' && typeof renderWishlist === 'function') {
            renderWishlist();
        }
    }
};

// Global delegated event listener for wishlist buttons (Capture phase)
document.addEventListener('click', function(e) {
    const wishlistBtn = e.target.closest('.wishlist-btn');
    if (wishlistBtn) {
        e.stopPropagation();
        e.preventDefault();

        // If guest, redirect
        if (typeof isAuthPage !== 'undefined' || !document.body.dataset.auth) {
            const loginLink = document.querySelector('a[href="/login"]');
            if (loginLink && loginLink.offsetParent !== null) {
                window.location.href = '/login';
                return;
            }
        }

        const productCard = wishlistBtn.closest('.product-card');
        const productDetail = wishlistBtn.closest('.modal-content') || wishlistBtn.closest('.detail-divider-panel')?.parentElement;

        let productData = null;
        let productId = null;

        if (productCard) {
            // Emulate cart logic to read ID
            const addBtn = productCard.querySelector('button[aria-label="Thêm vào giỏ hàng"]');
            if (addBtn && addBtn.hasAttribute('onclick')) {
                const match = addBtn.getAttribute('onclick').match(/CartHandler\.addToCart\((.*?)\);/);
                if (match) {
                    try {
                        const rawStr = match[1].replace(/&quot;/g, '"');
                        productData = new Function('return ' + rawStr)();
                        const nameEl = productCard.querySelector('h3.h5');
                        if (nameEl) {
                            let hash = 0;
                            const name = nameEl.textContent.trim();
                            for (let i = 0; i < name.length; i++) {
                                hash = ((hash << 5) - hash) + name.charCodeAt(i);
                                hash = hash & hash;
                            }
                            productId = Math.abs(hash);
                            productData.productId = productId;
                            productData.image = productCard.querySelector('img')?.src || '';
                            productData.rating = productCard.querySelector('.bi-star-fill')?.nextElementSibling?.textContent?.trim() || '5.0';
                            productData.sold = productCard.querySelector('.text-muted-custom:last-child')?.textContent?.replace(/[^0-9]/g, '') || 0;
                        }
                    } catch (err) {}
                }
            }
            if (!productData && productCard.dataset.productId) {
                productId = parseInt(productCard.dataset.productId);
                productData = { productId };
            }
        } else if (productDetail) {
            const modal = document.getElementById('productDetailModal');
            if (modal && modal.dataset.productData) {
                try {
                    productData = JSON.parse(modal.dataset.productData);
                } catch(err){}
            }
        }

        if (productData && productData.productId) {
            WishlistHandler.toggle(productData);
            WishlistHandler.syncUI();
        }
    }
}, true);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait slightly to ensure everything is rendered, then sync UI
    setTimeout(() => {
        WishlistHandler.syncUI();
    }, 100);
});

// Sync on modal shown to ensure modal heart is correct
document.addEventListener('shown.bs.modal', function (e) {
    if (e.target.id === 'productDetailModal') {
        WishlistHandler.syncUI();
    }
});
