
const CartHandler = {
    getCart: function() {
        return JSON.parse(localStorage.getItem('twinkle_cart')) || [];
    },
    saveCart: function(cart) {
        localStorage.setItem('twinkle_cart', JSON.stringify(cart));
        this.updateCartCountUI();
    },
    addToCart: function(item) {
        let cart = this.getCart();
        // Check if exact same item (product + variant + store) exists
        const existingItemIndex = cart.findIndex(i => 
            i.productId === item.productId && 
            i.variantId === item.variantId && 
            i.storeId === item.storeId
        );
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += (item.quantity || 1);
        } else {
            item.quantity = item.quantity || 1;
            item.cartItemId = Date.now() + Math.random().toString(36).substr(2, 9);
            cart.push(item);
        }
        
        this.saveCart(cart);
        window.showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
    },
    updateQuantity: function(cartItemId, newQty) {
        if (newQty < 1) return;
        let cart = this.getCart();
        const item = cart.find(i => i.cartItemId === cartItemId);
        if (item) {
            item.quantity = newQty;
            this.saveCart(cart);
        }
    },
    removeItem: function(cartItemId) {
        let cart = this.getCart();
        cart = cart.filter(i => i.cartItemId !== cartItemId);
        this.saveCart(cart);
    },
    clearCart: function() {
        this.saveCart([]);
    },
    getCartCount: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },
    updateCartCountUI: function() {
        const count = this.getCartCount();
        const badges = document.querySelectorAll('.cart-count-badge');
        badges.forEach(badge => {
            badge.textContent = count;
            if (count > 0) {
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    }};

document.addEventListener('DOMContentLoaded', () => {
    CartHandler.updateCartCountUI();
});


document.addEventListener('show.bs.modal', function(e) {
    if (e.target.id === 'productDetailModal') {
        const trigger = e.relatedTarget;
        if (trigger) {
            const productCard = trigger.closest('.product-card');
            if (productCard) {
                const addBtn = productCard.querySelector('button[aria-label="Thêm vào giỏ hàng"]');
                if (addBtn) {
                    const match = addBtn.getAttribute('onclick').match(/CartHandler\.addToCart\((.*?)\);/);
                    if (match) {
                        const rawStr = match[1].replace(/&quot;/g, '"');
                        const productData = new Function('return ' + rawStr)();
                        
                        // OVERRIDE WITH VISUAL DATA FROM CARD FOR PROTOTYPE CORRECTNESS
                        const nameEl = productCard.querySelector('h3.h5');
                        if (nameEl) {
                            productData.productName = nameEl.textContent.trim();
                            // Generate a mock product ID based on name so they are distinct
                            let hash = 0;
                            for (let i = 0; i < productData.productName.length; i++) {
                                hash = ((hash << 5) - hash) + productData.productName.charCodeAt(i);
                                hash = hash & hash;
                            }
                            productData.productId = Math.abs(hash);
                        }
                        
                        const priceElCard = productCard.querySelector('.fw-bold.text-cyan');
                        if (priceElCard) {
                            const priceStr = priceElCard.textContent.trim().replace(/[^0-9]/g, '');
                            if (priceStr) {
                                productData.effectivePrice = parseInt(priceStr);
                                productData.originalPrice = parseInt(priceStr); // fallback
                            }
                        }
                        
                        const originalPriceElCard = productCard.querySelector('.text-decoration-line-through');
                        if (originalPriceElCard) {
                            const origStr = originalPriceElCard.textContent.trim().replace(/[^0-9]/g, '');
                            if (origStr) {
                                productData.originalPrice = parseInt(origStr);
                            }
                        }
                        
                        e.target.dataset.productData = JSON.stringify(productData);
                        
                        document.getElementById('productDetailModalLabel').textContent = productData.productName;
                        const priceEl = e.target.querySelector('.fw-bold.text-cyan');
                        if (priceEl) {
                            priceEl.textContent = new Intl.NumberFormat('vi-VN').format(productData.effectivePrice) + 'đ';
                        }
                        const imgWrapper = e.target.querySelector('.detail-img-wrapper');
                        if (imgWrapper) {
                            const img = imgWrapper.querySelector('img');
                            if(img) img.src = productData.image;
                            else {
                                const biImage = imgWrapper.querySelector('.bi-image');
                                if(biImage) biImage.style.display = 'none';
                                imgWrapper.insertAdjacentHTML('beforeend', `<img src="${productData.image}" style="width:100%;height:100%;object-fit:cover;border-radius:1rem;position:absolute;z-index:0;">`);
                            }
                        }
                        
                        e.target.querySelectorAll('.size-btn').forEach(b => {
                            b.classList.remove('btn-dark', 'text-white');
                            b.classList.add('btn-outline-dark');
                        });
                        e.target.querySelectorAll('.color-btn').forEach(b => {
                            if (!b.disabled) {
                                b.classList.remove('btn-dark', 'text-white');
                                b.classList.add('btn-outline-dark');
                            }
                        });
                        
                        const hint = e.target.querySelector('.fst-italic');
                        if(hint) hint.textContent = '* Vui lòng chọn màu và size';
                    }
                }
            }
        }
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

document.addEventListener('click', function(e) {
    if (e.target.closest('.size-btn')) {
        const btn = e.target.closest('.size-btn');
        if (btn.disabled) return;
        const container = btn.closest('.d-flex.flex-wrap.gap-2');
        container.querySelectorAll('.size-btn').forEach(b => {
            b.classList.remove('btn-dark', 'text-white');
            b.classList.add('btn-outline-dark');
        });
        btn.classList.add('btn-dark', 'text-white');
        btn.classList.remove('btn-outline-dark');
        updateVariantHint();
    }
    
    if (e.target.closest('.color-btn')) {
        const btn = e.target.closest('.color-btn');
        if (btn.disabled) return;
        const container = btn.closest('.d-flex.flex-wrap.gap-2');
        container.querySelectorAll('.color-btn').forEach(b => {
            b.classList.remove('btn-dark', 'text-white');
            b.classList.add('btn-outline-dark');
        });
        btn.classList.add('btn-dark', 'text-white');
        btn.classList.remove('btn-outline-dark');
        updateVariantHint();
    }
    
    if (e.target.closest('#modalAddToCartBtn')) {
        const modal = document.getElementById('productDetailModal');
        const dataStr = modal.dataset.productData;
        if (!dataStr) return;
        const baseProduct = JSON.parse(dataStr);
        
        const sizeBtn = modal.querySelector('.size-btn.btn-dark');
        const colorBtn = modal.querySelector('.color-btn.btn-dark');
        
        if (!sizeBtn) {
            if (window.showToast) window.showToast('Cần chọn size trước khi thêm sản phẩm vào giỏ hàng.', 'warning');
            return;
        }
        
        const size = sizeBtn.textContent.trim();
        let color = 'Đen';
        if (colorBtn) color = colorBtn.textContent.trim();
        else if (baseProduct.variantName && baseProduct.variantName.includes(' - ')) {
             // fallback to original color if not selected
             color = baseProduct.variantName.split(' - ')[1];
        }
        
        const cartItem = {
            ...baseProduct,
            variantId: baseProduct.variantId + '-' + size + '-' + color,
            variantName: 'Size ' + size + ' - ' + color
        };
        
        CartHandler.addToCart(cartItem);
    }
});
