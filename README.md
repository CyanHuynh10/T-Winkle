# T-Winkle

Ứng dụng Storefront dùng Java 21, Spring Boot 4.1.1, Spring MVC/Thymeleaf,
Spring Security, Spring Data JPA và SQL Server. Giao diện dùng Bootstrap cùng
CSS/JavaScript trong project; không cần Node, npm, JWT hoặc WebSocket để chạy.

## Source of truth

- `src/main/java`: backend, bảo mật và nghiệp vụ.
- `src/main/resources/templates` và `static`: giao diện và tài nguyên runtime.
- `src/main/resources/db`: SQL migration thủ công và tiện ích dữ liệu.
- `src/test`: test hồi quy; không xóa để bỏ qua lỗi.
- `pom.xml`, `mvnw`, `mvnw.cmd`, `.mvn`: cấu hình build và Maven Wrapper.
- `docs/integration-audit`: báo cáo tích hợp; các báo cáo cũ là bằng chứng lịch sử.
- `tools/network`: tiện ích tùy chọn cho truy cập LAN.

## Cấu hình

Yêu cầu JDK 21 và SQL Server TCP 1433 với database `T_Winkle`. Xem
`.env.example` để biết tên biến môi trường. `.env` là file riêng của máy, được
Git bỏ qua. Spring Boot không tự đọc file này: trong IntelliJ, cấu hình Run
Configuration để đưa các biến từ `.env` vào môi trường của tiến trình.

Thiết lập `DB_USERNAME`, `DB_PASSWORD`, `MAIL_USERNAME`, `MAIL_APP_PASSWORD` và
`APP_BASE_URL`. Không đưa mật khẩu vào source hoặc Git. Banking cần
`BANK_TRANSFER_BANK_ID`, `BANK_TRANSFER_ACCOUNT_NO`, `BANK_TRANSFER_ACCOUNT_NAME`;
khi chưa cấu hình hợp lệ, COD vẫn dùng được. Placeholder AI có sẵn chỉ là phần
chuẩn bị cấu hình; AI Chat chưa được triển khai.

## Database

Đọc [hướng dẫn SQL](src/main/resources/db/README.md) để chuẩn bị database hiện hữu
và áp dụng migration còn thiếu. Project dùng migration SQL thủ công và
`spring.jpa.hibernate.ddl-auto=none`. Không chạy script reset/seed trên database
đang sử dụng. Không có migration hoặc seed tự động khi ứng dụng khởi động.

## Build, test và chạy

Với các biến môi trường đã được cấu hình trong terminal hoặc IntelliJ:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd clean package -DskipTests
java -jar target/t-winkle-0.0.1-SNAPSHOT.jar
```

Hoặc chạy `TWinkleApplication` trong IntelliJ / `mvnw.cmd spring-boot:run`.
Mở `http://localhost:5656`. Test tích hợp cần database demo đã khởi tạo; các test
gửi thông báo giao hàng dùng mail sender giả lập. Preview email từ test nằm trong
`target/integration-audit`, không phải source tài liệu.

## Thanh toán và thông báo

Checkout mới hỗ trợ COD và BANKING qua BIDV/VietQR. QR không tự xác nhận đã nhận
tiền; manager được phân quyền hoặc admin xác nhận tại `/payments/manage`.
VNPAY/MOMO chỉ được giữ để đọc dữ liệu lịch sử. Trạng thái cửa hàng OPEN/CLOSED
mang tính thông tin; mua hàng phụ thuộc sản phẩm/variant ACTIVE và tồn kho.

Thông báo HTML khi đơn được giao sử dụng hạ tầng mail OTP hiện có, chạy sau khi
giao dịch giao hàng commit. `delivery_mail_sent_at` ngăn gửi lặp; lỗi SMTP không
hoàn tác việc giao hàng.

`uploads/` là dữ liệu avatar phát sinh khi chạy và không đưa lên Git. Sao lưu dữ
liệu này cùng database khi triển khai. `.idea/` là cấu hình IDE cục bộ;
`target/`, log và dữ liệu kiểm thử sinh ra không phải source of truth.
