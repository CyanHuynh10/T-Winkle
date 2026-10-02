/**
 * T-Winkle Order Handler (Phase 16 Prototype)
 * Handles local storage persistence for Orders, Cart update after order,
 * Order History list rendering, Order Detail rendering, and Cancellation flow.
 */

window.OrderHandler = {
    getOrders: function() {
        try {
            const data = localStorage.getItem('twinkle_orders');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse twinkle_orders:", e);
            return [];
        }
    },
    
    saveOrders: function(orders) {
        localStorage.setItem('twinkle_orders', JSON.stringify(orders));
    },

    getOrderById: function(id) {
        const orders = this.getOrders();
        return orders.find(o => o.orderId === id);
    },

    createOrder: function(snapshot) {
        // Build the final order object
        const order = {
            orderId: snapshot.orderId || 'TW-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toISOString(),
            status: 'Chờ xác nhận',
            shippingAddress: snapshot.shippingAddress,
            paymentMethod: snapshot.paymentMethod,
            items: snapshot.items,
            subtotal: snapshot.subtotal,
            productDiscount: snapshot.productDiscount,
            shippingFee: snapshot.shippingFee,
            couponDiscount: snapshot.couponDiscount,
            total: snapshot.total
        };

        // Save order
        const orders = this.getOrders();
        orders.unshift(order); // Newest first
        this.saveOrders(orders);

        // Update Cart (Remove ONLY selected items)
        let cart = [];
        try {
            const stored = localStorage.getItem('twinkle_cart');
            if (stored) {
                cart = JSON.parse(stored);
            }
        } catch(e) {}

        const unselectedItems = cart.filter(item => item.selected === false);
        localStorage.setItem('twinkle_cart', JSON.stringify(unselectedItems));

        return order;
    },

    requestCancellation: function(orderId, reason, customReason) {
        const orders = this.getOrders();
        const orderIndex = orders.findIndex(o => o.orderId === orderId);
        if (orderIndex === -1) return false;

        const order = orders[orderIndex];

        if (order.status !== 'Chờ xác nhận') {
            return false;
        }

        if (order.cancellationRequest) {
            // Duplicate prevention
            return false;
        }

        order.cancellationRequest = {
            status: 'PENDING_STORE_CONFIRMATION',
            reason: reason,
            customReason: customReason,
            requestedAt: new Date().toISOString()
        };

        this.saveOrders(orders);
        return true;
    },

    formatCurrency: function(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    },

    formatDate: function(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    },

    getStatusSemantics: function(status) {
        switch(status) {
            case 'Chờ xác nhận': return { color: 'warning', text: 'Chờ xác nhận', icon: 'bi-hourglass-split' };
            case 'Đã xác nhận': return { color: 'info', text: 'Đã xác nhận', icon: 'bi-check-circle' };
            case 'Đã giao': return { color: 'success', text: 'Đã giao', icon: 'bi-box-seam' };
            case 'Đã hủy': return { color: 'danger', text: 'Đã hủy', icon: 'bi-x-circle' };
            default: return { color: 'secondary', text: status, icon: 'bi-info-circle' };
        }
    }
};
