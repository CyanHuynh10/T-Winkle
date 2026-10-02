/**
 * T-Winkle Review Handler (Phase 18 Prototype)
 */

document.addEventListener('DOMContentLoaded', () => {
    initReviewSystem();
});

const ReviewState = {
    currentProductId: null,
    currentUser: null,
    isAuthenticated: false,
    eligibleOrderId: null,
    eligibleVariant: null,
    hasReviewed: false,
    selectedRating: 0,
    currentSort: 'newest'
};

function initReviewSystem() {
    // 1. Detect Auth State
    const userElement = document.querySelector('.auth-username');
    if (userElement) {
        ReviewState.isAuthenticated = true;
        ReviewState.currentUser = userElement.textContent.trim();
    }

    // 2. Listen to modal opens to capture productId
    const productModal = document.getElementById('productDetailModal');
    if (productModal) {
        productModal.addEventListener('show.bs.modal', function (event) {
            // Attempt to get product ID from trigger or fallback to 1 (Urban Runner 2026 default)
            const button = event.relatedTarget;
            let pId = 1; 
            if (button && button.hasAttribute('data-product-id')) {
                pId = parseInt(button.getAttribute('data-product-id'));
            }
            ReviewState.currentProductId = pId;
            
            resetReviewForm();
            checkEligibilityAndRender();
        });
    }

    // Bind Review Form Events
    bindReviewEvents();
}

function getReviews() {
    try {
        const data = localStorage.getItem('twinkle_reviews');
        return data ? JSON.parse(data) : [];
    } catch(e) { return []; }
}

function saveReviews(reviews) {
    localStorage.setItem('twinkle_reviews', JSON.stringify(reviews));
}

function getOrders() {
    try {
        const data = localStorage.getItem('twinkle_orders');
        return data ? JSON.parse(data) : [];
    } catch(e) { return []; }
}

function checkEligibilityAndRender() {
    const productId = ReviewState.currentProductId;
    const allReviews = getReviews();
    const productReviews = allReviews.filter(r => r.productId === productId);
    
    // Check duplicate
    if (ReviewState.isAuthenticated) {
        const existingReview = productReviews.find(r => r.username === ReviewState.currentUser);
        if (existingReview) {
            ReviewState.hasReviewed = true;
        } else {
            ReviewState.hasReviewed = false;
            // Check order eligibility
            const orders = getOrders();
            ReviewState.eligibleOrderId = null;
            ReviewState.eligibleVariant = null;
            
            // Need an order with status 'Đã giao' containing productId
            for (const order of orders) {
                if (order.status === 'Đã giao') {
                    const item = order.items.find(i => i.productId === productId || i.productId == productId); // loose comparison if types differ
                    if (item) {
                        ReviewState.eligibleOrderId = order.orderId;
                        ReviewState.eligibleVariant = item.variantName || 'Mặc định';
                        break;
                    }
                }
            }
        }
    }

    renderReviewSection(productReviews);
}

function renderReviewSection(reviews) {
    renderSummary(reviews);
    renderActions();
    renderReviewList(reviews);
}

function renderSummary(reviews) {
    const total = reviews.length;
    document.getElementById('revTotalCount').textContent = `${total} đánh giá`;
    
    if (total === 0) {
        document.getElementById('revAvgRating').textContent = '0.0';
        document.getElementById('revAvgStars').innerHTML = '<i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>';
        document.getElementById('revDistBar').innerHTML = '';
        return;
    }

    let sum = 0;
    const dist = {1:0, 2:0, 3:0, 4:0, 5:0};
    reviews.forEach(r => {
        sum += r.rating;
        dist[r.rating]++;
    });
    
    const avg = (sum / total).toFixed(1);
    document.getElementById('revAvgRating').textContent = avg;

    let starHtml = '';
    for (let i=1; i<=5; i++) {
        if (avg >= i) starHtml += '<i class="bi bi-star-fill"></i>';
        else if (avg >= i - 0.5) starHtml += '<i class="bi bi-star-half"></i>';
        else starHtml += '<i class="bi bi-star"></i>';
    }
    document.getElementById('revAvgStars').innerHTML = starHtml;

    // Distribution bars
    let distHtml = '';
    for (let i=5; i>=1; i--) {
        const pct = (dist[i] / total) * 100;
        distHtml += `
            <div class="d-flex align-items-center gap-2 text-sm">
                <div class="fw-medium text-dark" style="width: 20px;">${i}<i class="bi bi-star-fill text-muted ms-1" style="font-size: 0.7rem;"></i></div>
                <div class="progress flex-grow-1 bg-light" style="height: 6px;">
                    <div class="progress-bar rounded-pill" style="background: #06B6D4; width: ${pct}%"></div>
                </div>
                <div class="text-muted-custom" style="width: 30px; text-align: right;">${dist[i]}</div>
            </div>
        `;
    }
    document.getElementById('revDistBar').innerHTML = distHtml;
}

function renderActions() {
    const container = document.getElementById('revActionContainer');
    const formContainer = document.getElementById('revFormContainer');
    
    if (!ReviewState.isAuthenticated) {
        container.innerHTML = `<a href="/login" class="btn btn-outline-dark rounded-pill px-4 py-2 fw-medium">Đăng nhập để đánh giá</a>`;
        formContainer.style.setProperty('display', 'none', 'important');
        return;
    }

    if (ReviewState.hasReviewed) {
        container.innerHTML = `<div class="alert alert-success d-inline-block rounded-4 mb-0"><i class="bi bi-check-circle-fill me-2"></i>Bạn đã đánh giá sản phẩm này.</div>`;
        formContainer.style.setProperty('display', 'none', 'important');
        return;
    }

    if (ReviewState.eligibleOrderId) {
        container.innerHTML = `<button class="btn btn-cyan text-white rounded-pill px-4 py-2 fw-bold shadow-sm" onclick="showReviewForm()">Viết đánh giá</button>`;
    } else {
        container.innerHTML = `<div class="alert alert-secondary d-inline-block rounded-4 mb-0 border text-muted-custom"><i class="bi bi-info-circle me-2"></i>Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã được giao.</div>`;
        formContainer.style.setProperty('display', 'none', 'important');
    }
}

function showReviewForm() {
    document.getElementById('revActionContainer').style.display = 'none';
    document.getElementById('revFormContainer').style.setProperty('display', 'block', 'important');
}

window.showReviewForm = showReviewForm;

function renderReviewList(reviews) {
    const list = document.getElementById('revList');
    const sortContainer = document.getElementById('revSortContainer');

    if (reviews.length === 0) {
        list.innerHTML = `<div class="text-center py-5 text-muted-custom"><i class="bi bi-chat-square-text mb-2" style="font-size: 2rem; opacity: 0.5;"></i><br>Chưa có đánh giá nào cho sản phẩm này.</div>`;
        sortContainer.style.setProperty('display', 'none', 'important');
        return;
    }

    sortContainer.style.setProperty('display', 'flex', 'important');

    // Sort
    const sorted = [...reviews];
    if (ReviewState.currentSort === 'newest') {
        sorted.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (ReviewState.currentSort === 'high') {
        sorted.sort((a,b) => b.rating - a.rating);
    } else if (ReviewState.currentSort === 'low') {
        sorted.sort((a,b) => a.rating - b.rating);
    }

    let html = '';
    sorted.forEach(r => {
        let stars = '';
        for(let i=1; i<=5; i++) {
            stars += (i <= r.rating) ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
        }

        const date = new Date(r.createdAt).toLocaleDateString('vi-VN');
        const initial = r.username.charAt(0).toUpperCase();

        html += `
            <div class="glass-card rounded-4 p-4 border shadow-sm">
                <div class="d-flex align-items-start gap-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center bg-cyan text-white fw-bold shadow-sm flex-shrink-0" style="width: 40px; height: 40px;">
                        ${initial}
                    </div>
                    <div class="flex-grow-1 min-w-0">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold text-dark">${r.username}</span>
                            <span class="text-muted-custom text-sm">${date}</span>
                        </div>
                        <div style="color: #FACC15;" class="mb-2 text-sm">${stars}</div>
                        <div class="text-muted-custom text-xs mb-2">Phân loại: ${r.variantSnapshot || 'Mặc định'}</div>
                        <p class="text-dark mb-0 text-sm" style="line-height: 1.5;">${r.comment}</p>
                    </div>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;
}

function bindReviewEvents() {
    const stars = document.querySelectorAll('.rev-star-item');
    stars.forEach(star => {
        star.addEventListener('mouseover', (e) => {
            const val = parseInt(e.target.getAttribute('data-val'));
            highlightStars(val);
        });
        star.addEventListener('mouseout', () => {
            highlightStars(ReviewState.selectedRating);
        });
        star.addEventListener('click', (e) => {
            ReviewState.selectedRating = parseInt(e.target.getAttribute('data-val'));
            highlightStars(ReviewState.selectedRating);
        });
        star.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                ReviewState.selectedRating = parseInt(e.target.getAttribute('data-val'));
                highlightStars(ReviewState.selectedRating);
            }
        });
    });

    const submitBtn = document.getElementById('revSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitReview);
    }

    const sortSelect = document.getElementById('revSortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            ReviewState.currentSort = e.target.value;
            checkEligibilityAndRender();
        });
    }
}

function highlightStars(val) {
    const stars = document.querySelectorAll('.rev-star-item');
    stars.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-val'));
        if (sVal <= val) {
            s.classList.remove('bi-star');
            s.classList.add('bi-star-fill');
            s.style.color = '#FACC15';
        } else {
            s.classList.remove('bi-star-fill');
            s.classList.add('bi-star');
            s.style.color = '#CBD5E1';
        }
    });
}

function resetReviewForm() {
    ReviewState.selectedRating = 0;
    highlightStars(0);
    const commentEl = document.getElementById('revComment');
    if (commentEl) commentEl.value = '';
    
    const actionContainer = document.getElementById('revActionContainer');
    if (actionContainer) actionContainer.style.display = 'block';
    const formContainer = document.getElementById('revFormContainer');
    if (formContainer) formContainer.style.setProperty('display', 'none', 'important');
}

function submitReview() {
    if (ReviewState.selectedRating === 0) {
        if (window.showToast) window.showToast('Vui lòng chọn mức đánh giá.', 'warning');
        else alert('Vui lòng chọn mức đánh giá.');
        return;
    }

    const comment = document.getElementById('revComment').value.trim();
    if (!comment) {
        if (window.showToast) window.showToast('Vui lòng nhập bình luận.', 'warning');
        else alert('Vui lòng nhập bình luận.');
        return;
    }

    const reviews = getReviews();
    
    // Safety duplicate check again
    const existing = reviews.find(r => r.productId === ReviewState.currentProductId && r.username === ReviewState.currentUser);
    if (existing) {
        if (window.showToast) window.showToast('Bạn đã đánh giá sản phẩm này rồi.', 'error');
        return;
    }

    const newReview = {
        reviewId: 'REV-' + Date.now(),
        productId: ReviewState.currentProductId,
        orderId: ReviewState.eligibleOrderId,
        username: ReviewState.currentUser,
        rating: ReviewState.selectedRating,
        comment: comment,
        variantSnapshot: ReviewState.eligibleVariant,
        createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    saveReviews(reviews);

    if (window.showToast) window.showToast('Đã gửi đánh giá thành công.', 'success');
    else alert('Đã gửi đánh giá thành công.');

    ReviewState.hasReviewed = true;
    resetReviewForm();
    checkEligibilityAndRender();
}
