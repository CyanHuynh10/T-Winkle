# T-Winkle Storefront Page Audit

## PAGE: index.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- index.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('T-Winkle - Cửa hàng', ~{::div.storefront-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- product : ${newestProducts}
- 'Đã bán ' + (${product.soldCount != null ? product.soldCount : 0})
- ${product.name}
- ${#numbers.formatDecimal(product.originalPrice, 0, 'COMMA', 0, 'POINT')} + '₫'
- ${product.ratingAverage != null ? #numbers.formatDecimal(product.ratingAverage, 1, 1) : '0.0'}
- ${product.categoryName}
- product, iterStat : ${saleProducts}
- product, iterStat : ${popularProducts}

WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: auth\forgot-password.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- auth\forgot-password.html

FRAGMENTS:
- ~{fragments/layout :: base('Quên mật khẩu - T-Winkle', ~{::div.forgot-container})}
- ~{fragments/otp_modal :: otp_modal}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):
- @{/forgot-password}

CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: auth\login.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- auth\login.html

FRAGMENTS:
- ~{fragments/layout :: base('Đăng nhập - T-Winkle', ~{::div.login-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):
- @{/login}

CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: auth\otp.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- auth\otp.html

FRAGMENTS:
- ~{fragments/layout :: base('Xác thực OTP - T-Winkle', ~{::div.otp-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- ${session.AUTH_FLOW_EMAIL}

WRITE ACTIONS (Forms):
- @{/otp}
- @{/otp/resend}

CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: auth\register.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- auth\register.html

FRAGMENTS:
- ~{fragments/layout :: base('Đăng ký - T-Winkle', ~{::div.register-container})}
- ~{fragments/otp_modal :: otp_modal}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):
- @{/register}

CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: auth\reset-password.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- auth\reset-password.html

FRAGMENTS:
- ~{fragments/layout :: base('Đặt lại mật khẩu - T-Winkle', ~{::div.reset-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):
- @{/reset-password}

CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: fragments\layout.html
ROUTE: Unknown

PURPOSE: Fragment

TEMPLATES:
- fragments\layout.html

FRAGMENTS:
- ${content}

CSS:
- https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css
- https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css

JAVASCRIPT:
- https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js

COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- ${title}
- ${warning}
- ${success}
- ${error}

WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: fragments\navbar.html
ROUTE: Unknown

PURPOSE: Fragment

TEMPLATES:
- fragments\navbar.html

FRAGMENTS:


CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- ${currentUsername}

WRITE ACTIONS (Forms):
- @{/logout}

CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: fragments\otp_modal.html
ROUTE: Unknown

PURPOSE: Fragment

TEMPLATES:
- fragments\otp_modal.html

FRAGMENTS:


CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\cart\cart.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\cart\cart.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Giỏ hàng - T-Winkle', ~{::div.cart-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- ${item.variant.size} + ' - ' + ${item.variant.color}
- ${#numbers.formatDecimal(item.unitPrice, 0, 'COMMA', 0, 'POINT')} + '₫'
- ${item.product.name}
- ${entry.key.name}
- item, stat : ${entry.value}
- entry : ${groupedCart}

WRITE ACTIONS (Forms):
- @{/cart/remove}
- @{/cart/update}
- @{/cart/toggle-select}

CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\category\list.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\category\list.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Sản phẩm - T-Winkle', ~{::div.storefront-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- ${productDTO?.name}
- ${productDTO?.categoryName}
- i : ${#numbers.sequence(0, products.totalPages - 1)}
- ${(selectedCategory == 'sneaker' ? 'Sneaker' : (selectedCategory == 'sandals' ? 'Sandals' : (selectedCategory == 'sports' ? 'Sports' : 'Bộ sưu tập')))}
- 'Đã bán ' + (${product.soldCount != null ? product.soldCount : 0})
- ${product.name}
- ${#numbers.formatDecimal(product.originalPrice, 0, 'COMMA', 0, 'POINT')} + '₫'
- ${#numbers.formatDecimal(product.effectivePrice, 0, 'COMMA', 0, 'POINT')} + '₫'
- ${product.ratingAverage != null ? #numbers.formatDecimal(product.ratingAverage, 1, 1) : '0.0'}
- ${productDTO?.ratingAverage != null ? #numbers.formatDecimal(productDTO?.ratingAverage, 1, 1) : '0.0'}
- ${product.categoryName}
- ${i + 1}
- ${productDTO?.brandName}
- product : ${products.content}

WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\checkout\checkout.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\checkout\checkout.html

FRAGMENTS:
- ~{fragments/layout :: base('Thanh toán - T-Winkle', ~{::div.checkout-container})}
- ~{fragments/navbar :: navbar}

CSS:


JAVASCRIPT:
- /js/checkout-handler.js
- /js/order-handler.js

COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- ${addr.addressLine} + ', ' + ${addr.ward} + ', ' + ${addr.district} + ', ' + ${addr.city}
- ${addr.fullName} + ' | ' + ${addr.phone}
- ${#numbers.formatDecimal(item.unitPrice, 0, 'COMMA', 0, 'POINT')} + '₫'
- item : ${selectedItems}
- ${#numbers.formatDecimal(shippingFee, 0, 'COMMA', 0, 'POINT')} + '₫'
- addr : ${addresses}
- ${item.product.name}
- 'Ghi chú: ' + ${addr.note}
- ${#numbers.formatDecimal(subtotal, 0, 'COMMA', 0, 'POINT')} + '₫'
- ${item.variant.size} + ' - ' + ${item.variant.color} + ' | ' + ${item.store.name}
- ${#numbers.formatDecimal(total, 0, 'COMMA', 0, 'POINT')} + '₫'
- 'x' + ${item.quantity}

WRITE ACTIONS (Forms):
- @{/checkout/process}

CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\order\detail.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\order\detail.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Chi tiết đơn hàng - T-Winkle', ~{::div.order-detail-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\order\history.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\order\history.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Đơn hàng của tôi - T-Winkle', ~{::div.order-history-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\order\tracking.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\order\tracking.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Theo dõi đơn hàng - T-Winkle', ~{::div.tracking-container})}

CSS:


JAVASCRIPT:
- /js/tracking-handler.js

COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\store\categories.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\store\categories.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Sản phẩm - T-Winkle', ~{::div.storefront-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- i : ${#numbers.sequence(0, products.totalPages - 1)}
- ${(selectedCategory == 'sneaker' ? 'Sneaker' : (selectedCategory == 'sandals' ? 'Sandals' : (selectedCategory == 'sports' ? 'Sports' : 'Bộ sưu tập')))}
- 'Đã bán ' + (${product.soldCount != null ? product.soldCount : 0})
- ${product.name}
- ${#numbers.formatDecimal(product.originalPrice, 0, 'COMMA', 0, 'POINT')} + '₫'
- ${#numbers.formatDecimal(product.effectivePrice, 0, 'COMMA', 0, 'POINT')} + '₫'
- ${product.ratingAverage != null ? #numbers.formatDecimal(product.ratingAverage, 1, 1) : '0.0'}
- ${product.categoryName}
- ${i + 1}
- product : ${products.content}

WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\store\detail.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\store\detail.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Chi tiết Cửa hàng - T-Winkle', ~{::div.storefront-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- ${store.name}

WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\store\list.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\store\list.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Cửa hàng - T-Winkle', ~{::div.storefront-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:
- // Simple frontend UI search interaction for presentation
                    document.addEventListener('DOMContentLoaded', () => {
                        const input = document.getElementById('storeSearchInput');
                        const clearBtn = document.getElementById('clearStoreSearchBtn');
                        const emptyState = document.getElementById('storeEmptyState');
                        const grid = document.getElementById('storeGridList');
                        
                        if(input && clearBtn) {
                            input.addEventListener('input', () => {
                                if(input.value.trim().length > 0) {
                                    clearBtn.classList.remove('d-none');
                                    // Mock empty state if typing something arbitrary
                                    if(input.value.trim().toLowerCase() === 'xyz') {
                                        grid.classList.add('d-none');
                                        emptyState.classList.remove('d-none');
                                    } else {
                                        grid.classList.remove('d-none');
                                        emptyState.classList.add('d-none');
                                    }
                                } else {
                                    clearBtn.classList.add('d-none');
                                    grid.classList.remove('d-none');
                                    emptyState.classList.add('d-none');
                                }
                            });
                            clearBtn.addEventListener('click', () => {
                                input.value = '';
                                clearBtn.classList.add('d-none');
                                grid.classList.remove('d-none');
                                emptyState.classList.add('d-none');
                                input.focus();
                            });
                        }
                    });

CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\user\addresses.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\user\addresses.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Địa chỉ giao hàng - T-Winkle', ~{::div.addresses-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\user\profile.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\user\profile.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Hồ sơ cá nhân - T-Winkle', ~{::div.profile-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):
- ${currentUsername != null ? #strings.substring(currentUsername, 0, 1).toUpperCase() : 'U'}
- ${currentUsername != null ? currentUsername : 'user'}
- ${currentUsername != null ? currentUsername : 'Thành viên'}

WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

## PAGE: storefront\user\wishlist.html
ROUTE: Unknown

PURPOSE: Page

TEMPLATES:
- storefront\user\wishlist.html

FRAGMENTS:
- ~{fragments/navbar :: navbar}
- ~{fragments/layout :: base('Yêu thích - T-Winkle', ~{::div.wishlist-container})}

CSS:


JAVASCRIPT:


COMPONENT INVENTORY:
- TODO

READ DATA (th:text / th:each):


WRITE ACTIONS (Forms):


CONTROLLER:
- TODO

SERVICES:
- TODO

REPOSITORIES:
- TODO

DATABASE TABLES:
- TODO

MOCK DATA:


CURRENT ISSUES:
- TODO

INTEGRATION STATUS: PENDING

DATABASE PERSISTENCE STATUS: PENDING

---

