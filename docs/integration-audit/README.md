# Integration audit documentation

Các báo cáo Markdown ghi lại quyết định nghiệp vụ, kiểm thử và các mốc tích hợp.
Chúng hỗ trợ tra cứu và bảo trì, không phải bộ source thay thế `src/`.

Các ảnh chụp, log, JSON trạng thái, HTML render và script sửa source dùng một lần
đã được dọn khỏi repository. Tham chiếu đến chúng trong báo cáo cũ là bằng chứng
kiểm thử lịch sử; không phải dependency khi build hoặc chạy ứng dụng.

Nguồn hiện hành: README ở thư mục gốc, source trong `src/`, SQL schema/seed gốc
và hướng dẫn `src/main/resources/db/README.md`. Xem
[báo cáo cleanup hiện hành](T-Winkle_Project_Source_of_Truth_Cleanup.md)
để biết kết quả kiểm thử mới và trạng thái commit/push.
