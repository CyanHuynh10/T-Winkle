/**
 * T-Winkle Tracking Handler (Phase 17 Prototype)
 * Handles visual read-only representation of the order status.
 * Relies exclusively on twinkle_orders snapshot.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTracking();
});

function initTracking() {
    const orderIdInput = document.getElementById('pageOrderId');
    if (!orderIdInput) return;
    
    const orderId = orderIdInput.value;
    renderTracking(orderId);
}

function getOrderById(id) {
    try {
        const data = localStorage.getItem('twinkle_orders');
        if (!data) return null;
        const orders = JSON.parse(data);
        return orders.find(o => o.orderId === id) || null;
    } catch (e) {
        console.error("Failed to read twinkle_orders:", e);
        return null;
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
}

function getStatusSemantics(status) {
    switch(status) {
        case 'Chờ xác nhận': return { color: 'warning', text: 'Chờ xác nhận', icon: 'bi-hourglass-split' };
        case 'Đã xác nhận': return { color: 'info', text: 'Đã xác nhận', icon: 'bi-check-circle' };
        case 'Đã giao': return { color: 'success', text: 'Đã giao', icon: 'bi-box-seam' };
        case 'Đã hủy': return { color: 'danger', text: 'Đã hủy', icon: 'bi-x-circle' };
        default: return { color: 'secondary', text: status, icon: 'bi-info-circle' };
    }
}

function renderTracking(orderId) {
    const notFound = document.getElementById('trackingNotFoundState');
    const content = document.getElementById('trackingContent');
    const order = getOrderById(orderId);

    if (!order) {
        notFound.style.setProperty('display', 'flex', 'important');
        content.style.setProperty('display', 'none', 'important');
        document.getElementById('trackingHeading').style.display = 'none';
        return;
    }

    notFound.style.setProperty('display', 'none', 'important');
    content.style.setProperty('display', 'block', 'important');

    // Header Info
    document.getElementById('trkOrderId').textContent = order.orderId;
    document.getElementById('trkDate').textContent = 'Đặt lúc: ' + formatDate(order.createdAt);
    
    const statusInfo = getStatusSemantics(order.status);
    document.getElementById('trkStatusBadge').innerHTML = `<span class="badge bg-${statusInfo.color} bg-opacity-10 text-${statusInfo.color} px-3 py-2 border border-${statusInfo.color} border-opacity-25 rounded-pill fs-6"><i class="bi ${statusInfo.icon} me-2"></i>${statusInfo.text}</span>`;

    const pendingAlert = document.getElementById('trkPendingCancel');
    if (order.cancellationRequest && order.cancellationRequest.status === 'PENDING_STORE_CONFIRMATION') {
        pendingAlert.style.setProperty('display', 'block', 'important');
    } else {
        pendingAlert.style.setProperty('display', 'none', 'important');
    }

    // Timeline Construction
    const timelineContainer = document.getElementById('timelineContainer');
    // Keep the connector, remove old nodes
    Array.from(timelineContainer.children).forEach(child => {
        if (child.id !== 'activeConnector') child.remove();
    });

    const activeConnector = document.getElementById('activeConnector');
    const nodes = [];
    
    if (order.status === 'Đã hủy') {
        nodes.push({ title: 'Đặt hàng', time: formatDate(order.createdAt), state: 'completed', icon: 'bi-check-lg' });
        nodes.push({ title: 'Đã hủy', time: 'Chưa cập nhật thời gian', state: 'cancelled', icon: 'bi-x-lg' });
        activeConnector.style.height = '100%';
    } else {
        if (order.status === 'Chờ xác nhận') {
            nodes.push({ title: 'Đặt hàng', time: formatDate(order.createdAt), state: 'current', icon: 'bi-circle-fill' });
            nodes.push({ title: 'Đã xác nhận', time: 'Dự kiến', state: 'pending', icon: 'bi-circle-fill' });
            nodes.push({ title: 'Đã giao', time: 'Dự kiến', state: 'pending', icon: 'bi-circle-fill' });
            activeConnector.style.height = '0%';
        } else if (order.status === 'Đã xác nhận') {
            nodes.push({ title: 'Đặt hàng', time: formatDate(order.createdAt), state: 'completed', icon: 'bi-check-lg' });
            nodes.push({ title: 'Đã xác nhận', time: 'Chưa cập nhật thời gian', state: 'current', icon: 'bi-circle-fill' });
            nodes.push({ title: 'Đã giao', time: 'Dự kiến', state: 'pending', icon: 'bi-circle-fill' });
            activeConnector.style.height = '50%';
        } else if (order.status === 'Đã giao') {
            nodes.push({ title: 'Đặt hàng', time: formatDate(order.createdAt), state: 'completed', icon: 'bi-check-lg' });
            nodes.push({ title: 'Đã xác nhận', time: 'Chưa cập nhật thời gian', state: 'completed', icon: 'bi-check-lg' });
            nodes.push({ title: 'Đã giao', time: 'Chưa cập nhật thời gian', state: 'completed', icon: 'bi-check-lg' });
            activeConnector.style.height = '100%';
        } else {
            // Default fallback
            nodes.push({ title: 'Đặt hàng', time: formatDate(order.createdAt), state: 'current', icon: 'bi-circle-fill' });
            activeConnector.style.height = '0%';
        }
    }

    // Render nodes
    let html = '';
    nodes.forEach((node) => {
        const stateClass = node.state === 'pending' ? '' : node.state;
        const iconClass = node.state === 'pending' ? 'bi-circle-fill' : node.icon;
        
        html += `
            <div class="timeline-item ${stateClass}">
                <div class="timeline-node">
                    <i class="bi ${iconClass}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-title">${node.title}</div>
                    <div class="timeline-time">${node.time}</div>
                </div>
            </div>
        `;
    });

    timelineContainer.insertAdjacentHTML('beforeend', html);
}
