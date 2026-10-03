import os

base_dir = r'D:\Cyan\Project\T-Winkle'
tracking_html = os.path.join(base_dir, 'src', 'main', 'resources', 'templates', 'storefront', 'order', 'tracking.html')

with open(tracking_html, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove script src
content = re.sub(r'<script src="/js/tracking-handler.js"></script>', '', content)

# Remove display: none!important from trackingContent
content = re.sub(r'<div id="trackingContent" class="glass-card p-4 p-md-5 rounded-4 border shadow-sm mx-auto" style="max-width: 600px; display: none !important;">',
                 r'<div id="trackingContent" class="glass-card p-4 p-md-5 rounded-4 border shadow-sm mx-auto" style="max-width: 600px;" th:if="">', content)

# Remove empty state display:flex and add th:unless
content = re.sub(r'<div id="trackingNotFoundState" class="flex-column align-items-center justify-content-center py-5" style="display: flex !important;">',
                 r'<div id="trackingNotFoundState" class="flex-column align-items-center justify-content-center py-5" th:unless="">', content)

header_start = r'<div class="text-center mb-5 pb-3 border-bottom border-light">.*?</div>\s*<div class="timeline position-relative" id="timelineContainer">'
new_header = '''<div class="text-center mb-5 pb-3 border-bottom border-light">
                        <div class="fw-bold text-dark fs-5 mb-1" th:text=""></div>
                        <div class="text-muted-custom text-sm mb-3" th:text=""></div>
                        <div>
                            <span class="badge px-3 py-2 border rounded-pill fs-6"
                                  th:classappend=" ? 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25' : 
                                  ( ? 'bg-success bg-opacity-10 text-success border-success border-opacity-25' : 
                                  'bg-info bg-opacity-10 text-info border-info border-opacity-25')">
                                <i class="bi me-2" th:classappend=" ? 'bi-x-circle' : ( ? 'bi-box-seam' : 'bi-info-circle')"></i>
                                <span th:text="">Status</span>
                            </span>
                        </div>
                    </div>

                    <div class="timeline position-relative" id="timelineContainer">
                        <div class="timeline-connector-active" id="activeConnector" th:style=""></div>
                        <div class="timeline-item completed">
                            <div class="timeline-node"><i class="bi bi-check-lg"></i></div>
                            <div class="timeline-content">
                                <div class="timeline-title">Đặt hàng</div>
                                <div class="timeline-time" th:text="">Time</div>
                            </div>
                        </div>
                        <div class="timeline-item" th:classappend=" ? 'completed' : 'pending'">
                            <div class="timeline-node"><i class="bi" th:classappend=" ? 'bi-check-lg' : 'bi-circle-fill'"></i></div>
                            <div class="timeline-content">
                                <div class="timeline-title">Đã xác nhận</div>
                                <div class="timeline-time">Dự kiến</div>
                            </div>
                        </div>
                        <div class="timeline-item" th:classappend=" ? 'completed' : 'pending'">
                            <div class="timeline-node"><i class="bi" th:classappend=" ? 'bi-check-lg' : 'bi-circle-fill'"></i></div>
                            <div class="timeline-content">
                                <div class="timeline-title">Đã giao</div>
                                <div class="timeline-time">Dự kiến</div>
                            </div>
                        </div>'''

content = re.sub(header_start, new_header, content, flags=re.DOTALL)

with open(tracking_html, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated tracking.html")
