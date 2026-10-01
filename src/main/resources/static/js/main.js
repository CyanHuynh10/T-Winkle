document.addEventListener("DOMContentLoaded", () => {
    // Programmatic Toast Notification
    window.showToast = function(message, type = 'error') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center border-0 shadow-lg';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        let bgColor, borderColor, iconClass, iconColor, textColor;
        
        if (type === 'success') {
            bgColor = 'var(--color-success-bg, #ecfdf5)';
            borderColor = 'var(--color-success, #10b981)';
            iconClass = 'bi-check-circle-fill';
            iconColor = 'var(--color-success, #10b981)';
            textColor = 'var(--color-success, #10b981)';
        } else if (type === 'error') {
            bgColor = 'var(--color-danger-bg, #fef2f2)';
            borderColor = 'var(--color-danger, #ef4444)';
            iconClass = 'bi-exclamation-circle-fill';
            iconColor = 'var(--color-danger, #ef4444)';
            textColor = 'var(--color-danger, #ef4444)';
        } else if (type === 'warning') {
            bgColor = 'var(--color-warning-bg, #FEFCE8)';
            borderColor = 'var(--color-shining, #FACC15)';
            iconClass = 'bi-exclamation-triangle-fill';
            iconColor = 'var(--color-shining, #EAB308)';
            textColor = '#CA8A04';
        }
        
        toastEl.style.backgroundColor = bgColor;
        toastEl.style.setProperty('border-left', '4px solid ' + borderColor, 'important');
        
        toastEl.innerHTML = `
            <div class="d-flex px-2 py-1">
                <div class="toast-body d-flex align-items-center">
                    <i class="bi ${iconClass} me-3 fs-5" style="color: ${iconColor};"></i>
                    <span class="fw-bold fs-6" style="color: ${textColor};">${message}</span>
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toastEl);
        const bsToast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
        bsToast.show();
        
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    };

    console.log("T-Winkle Design System Foundation Initialized.");

    const toastElList = document.querySelectorAll('.toast');
    const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 }));
    toastList.forEach(toast => toast.show());

    // ==========================================
    // GLOBAL LOADING & PAGE TRANSITION STATE
    // ==========================================
    const globalLoader = document.getElementById('twinkle-global-transition');
    let failSafeTimer = null;
    
    window.completeGlobalLoading = function() {
        const globalLoader = document.getElementById('twinkle-global-transition');
        if (globalLoader) {
            globalLoader.classList.remove('is-active');
            globalLoader.setAttribute('aria-hidden', 'true');
        }
        
        // Remove isolation state from body so destination UI becomes visible
        document.body.classList.remove('is-transitioning');
        
        if (failSafeTimer) clearTimeout(failSafeTimer);
        
        document.querySelectorAll('button[type="submit"]').forEach(btn => {
            if (btn.dataset.originalText) {
                btn.innerHTML = btn.dataset.originalText;
                btn.classList.remove('disabled');
                btn.style.pointerEvents = 'auto';
                delete btn.dataset.originalText;
            }
        });
    };
    
    window.showGlobalLoading = function() {
        const globalLoader = document.getElementById('twinkle-global-transition');
        if (globalLoader) {
            globalLoader.classList.add('is-active');
            globalLoader.setAttribute('aria-hidden', 'false');
        }
        
        // Isolate destination UI
        document.body.classList.add('is-transitioning');
        
        if (failSafeTimer) clearTimeout(failSafeTimer);
        failSafeTimer = setTimeout(() => {
            console.warn("Global Loading fail-safe triggered.");
            window.completeGlobalLoading();
        }, 15000);
    };

    // Calculate display duration based on transition timestamp
    if (window.__twinkleTransitionStart) {
        const elapsed = Date.now() - window.__twinkleTransitionStart;
        const remainingTime = Math.max(0, 1000 - elapsed);
        
        if (remainingTime > 0) {
            setTimeout(() => {
                window.completeGlobalLoading();
            }, remainingTime);
        } else {
            window.completeGlobalLoading();
        }
    } else {
        // Direct loads or failed validations close immediately
        window.completeGlobalLoading();
    }
    
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            window.completeGlobalLoading();
        }
    });

    // ==========================================
    // FORMS & NAVIGATION
    // ==========================================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    let errorMsg = "Vui lòng kiểm tra lại thông tin.";
                    if (firstInvalid.validity.valueMissing) {
                        if (firstInvalid.type === 'email' || firstInvalid.id.toLowerCase().includes('email')) {
                            errorMsg = "Email không được để trống.";
                        } else if (firstInvalid.type === 'password' || firstInvalid.id.toLowerCase().includes('password')) {
                            errorMsg = "Mật khẩu không được để trống.";
                        } else {
                            errorMsg = "Trường này không được để trống.";
                        }
                    } else if (firstInvalid.validity.typeMismatch) {
                        if (firstInvalid.type === 'email') {
                            errorMsg = "Email không hợp lệ.";
                        } else {
                            errorMsg = "Định dạng không hợp lệ.";
                        }
                    } else if (firstInvalid.validity.tooShort) {
                        errorMsg = `Tối thiểu ${firstInvalid.minLength} ký tự.`;
                    } else if (firstInvalid.validationMessage) {
                        errorMsg = firstInvalid.validationMessage;
                    }
                    if (window.showToast) {
                        window.showToast(errorMsg, 'error');
                    }
                    firstInvalid.focus();
                }
                return;
            }
            
            // Valid Form: just show the button spinner, DO NOT show global loader
            // Server redirect will load new page and trigger global loader via inline script
            // Valid Form: just show the button spinner, DO NOT show global loader
            // Server redirect will load new page and trigger global loader via inline script
            setTimeout(() => {
                if (!e.defaultPrevented) {
                    const btn = form.querySelector('button[type="submit"]');
                    if (btn && btn.dataset.loadingText) {
                        if (!btn.dataset.originalText) {
                            btn.dataset.originalText = btn.innerHTML;
                        }
                        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${btn.dataset.loadingText}`;
                        btn.classList.add('disabled');
                        btn.style.pointerEvents = 'none';
                    }
                    
                    // Create Transition Intent Marker
                    const intent = {
                        sourcePath: window.location.pathname,
                        timestamp: Date.now()
                    };
                    sessionStorage.setItem('twinkleTransitionIntent', JSON.stringify(intent));
                }
            }, 0);
        });
    });

    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && !e.defaultPrevented) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:') && link.target !== '_blank') {
                const isInternal = href.startsWith('/') || href.startsWith(window.location.origin) || !href.includes('://');
                if (isInternal) {
                    const currentPath = window.location.pathname;
                    let targetPath = href;
                    try {
                        if (href.startsWith(window.location.origin)) {
                            targetPath = new URL(href).pathname;
                        } else if (!href.startsWith('/')) {
                            targetPath = new URL(href, window.location.origin).pathname;
                        } else {
                            targetPath = href.split('?')[0].split('#')[0];
                        }
                        if (currentPath !== targetPath) {
                            // Create Transition Intent Marker
                            const intent = {
                                sourcePath: currentPath,
                                timestamp: Date.now()
                            };
                            sessionStorage.setItem('twinkleTransitionIntent', JSON.stringify(intent));
                            window.showGlobalLoading();
                        }
                    } catch (err) {}
                }
            }
        }
    });

});
