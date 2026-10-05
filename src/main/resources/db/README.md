# Database source of truth

Project dùng SQL Server `T_Winkle` và các script SQL chạy thủ công. Không có
Flyway/Liquibase, migration runner hoặc seed tự động. Giữ `ddl-auto=none`.

## Database hiện hữu

Project yêu cầu database `T_Winkle` đã có schema Storefront. Bộ script bên dưới
là nguồn migration hiện hành, không phải bộ khởi tạo đủ 26 bảng nghiệp vụ từ
database trống. SQL sample/reset tại thư mục gốc đã được xóa theo quyết định
của người dùng; không khôi phục hoặc dùng nó trong hướng dẫn chạy.

Khi chuyển máy, chuẩn bị database bằng quy trình backup/restore SQL Server của
dự án, rồi kiểm tra schema và chỉ áp dụng migration còn thiếu. Các ảnh demo
runtime được giữ trong `src/main/resources/static/images/storefront`.

## Migration hiện hành

| Script | Mục đích |
|---|---|
| `schema-auth.sql` | Script khởi tạo auth giai đoạn đầu; không thay thế toàn bộ schema Storefront và không dùng để vá tùy tiện database hiện có |
| `migration-avatar.sql` | Bổ sung cột avatar nullable khi chưa tồn tại |
| `migration-banking-payment.sql` | Cho phép BANKING, giữ COD/VNPAY/MOMO để đọc lịch sử; không sửa các dòng giao dịch |
| `migration-order-delivery-mail.sql` | Bổ sung `ORDERS.delivery_mail_sent_at DATETIME2 NULL` khi chưa tồn tại; không gửi mail cho đơn cũ |

Các migration avatar/banking/delivery được kiểm tra idempotent. Không đổi tên,
xóa hoặc gộp migration đã áp dụng. Với database đang chạy, kiểm tra schema và
chỉ áp dụng script còn thiếu sau khi sao lưu.

## Tiện ích dữ liệu tùy chọn

- `seed-storefront-demo-metrics.sql`: dữ liệu demo cho chỉ số Storefront; không
  phải dữ liệu bắt buộc để ứng dụng khởi động.
- `rebuild-store-inventory.sql`: tiện ích chuẩn bị/rebuild dữ liệu tồn kho demo
  thủ công; không phải migration tự chạy.

Không thực thi hai tiện ích này trong quá trình cleanup hoặc khởi động ứng
dụng. Không xóa bảng backup tồn kho hoặc đơn/account kiểm thử email đã giữ lại
chỉ để làm gọn schema. Dữ liệu vận hành và source Git được quản lý riêng.
