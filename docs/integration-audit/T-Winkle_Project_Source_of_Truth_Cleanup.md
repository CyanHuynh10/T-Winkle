# T-Winkle — Source-of-truth cleanup

Ngày: 2026-10-04. Đây là kết quả cleanup tiếp theo báo cáo repository finalization
đã bị dừng ở security gate. Báo cáo này ghi nhận trạng thái hiện hành; báo cáo
finalization trước đó được giữ như bằng chứng lịch sử của lượt kiểm tra ban đầu.

**Cleanup, test và package: PASS. Commit/push: BLOCKED bởi credential trong lịch sử Git.**

## Những phần đã dọn

Đã rà soát dependency Maven, tham chiếu source/runtime, mục đích bộ staging,
script sửa source một lần và tài nguyên ứng dụng trước khi xóa. Tất cả đường dẫn
xóa đệ quy được resolve và kiểm tra nằm trong `D:\Cyan\Project\T-Winkle`.

Đã xóa **2.244 file**, tổng **48.200.564 byte**, thuộc 257 đường dẫn cleanup:

| Nhóm | Kết quả |
|---|---|
| `node_modules/` | Xóa 1.868 file; project không cần Node để build/run |
| `package.json`, `package-lock.json` | Xóa dependency jsdom dùng cho kiểm thử DOM trước đây; không có frontend build runtime |
| `T-Winkle_Backend_Source_of_Truth_C15_Antigravity_Staging/` | Xóa 116 file staging/copy cũ; README của bộ này xác nhận chưa build/runtime verified |
| `Elements/` | Xóa 6 file thiết kế/nguồn cũ; giữ nguyên các ảnh production đã có trong `static/` |
| `Prompt/` | Xóa PDF prompt triển khai; không phải dependency runtime |
| Script Python tại thư mục gốc | Xóa 72 script sửa/check/chụp source dùng một lần |
| `CheckDB.java` | Xóa helper JDBC rời có hardcoded password; không thuộc source Maven |
| HTML dump/template rời tại thư mục gốc | Xóa 4 file; template đang vận hành nằm trong `src/main/resources/templates` |
| Handoff asset/database cũ | Xóa tài liệu handoff đã được thay thế bằng source và hướng dẫn SQL hiện hành |
| `docs/integration-audit` | Xóa 173 log, screenshot, JSON, HTML, dump/diff và công cụ kiểm thử tạm; giữ báo cáo Markdown hữu ích |

Có 170 file đã tracked được xóa có chủ đích. Không dùng `git clean`, reset,
restore, checkout toàn cục hoặc xóa production source để làm gọn trạng thái Git.
Manifest đường dẫn/lý do xóa và evidence kiểm thử nằm ngoài repository tại:

`C:\Users\cyanh\.codex\visualizations\2026\10\03\01a1033f-a113-7081-871f-1a567adad772\milestone-work\cleanup-run`

## Source of truth được giữ

```text
T-Winkle/
├── .env.example
├── .gitattributes
├── .gitignore
├── .mvn/wrapper/
├── mvnw / mvnw.cmd
├── pom.xml
├── README.md
├── T-Winkle_Database_Sample_C15_Codex_Ready.sql
├── src/
│   ├── main/java/                 backend và bảo mật
│   ├── main/resources/
│   │   ├── application.properties
│   │   ├── db/                   migration, tiện ích SQL, README
│   │   ├── static/               tài nguyên runtime
│   │   └── templates/            giao diện và email template
│   └── test/java/                 7 lớp test hồi quy
├── docs/integration-audit/         báo cáo Markdown
└── tools/network/                 tiện ích LAN tùy chọn
```

`.git/` được giữ để quản lý repository. `.env`, `.idea`, `uploads` và `target`
được giữ cục bộ, không phải candidate Git: lần lượt là cấu hình môi trường,
cấu hình IntelliJ, dữ liệu avatar và package/build sinh ra. Không xóa dữ liệu
runtime chỉ vì không phải source. Sáu ảnh demo lớn trong `static/images` được
giữ để bảo toàn URL và tính tương thích dữ liệu, không tái thiết kế asset/UI.

## Thay đổi cấu hình và tài liệu

- Bỏ literal password fallback khỏi `application.properties`; database password
  chỉ lấy từ `${DB_PASSWORD}`. `.env` hiện tại có cấu hình này và không bị sửa.
- Giữ `ddl-auto=none`, port mặc định 5656 và kiến trúc payment/email đã duyệt.
- Bổ sung ignore cho `out/`, `node_modules/`, log, file OS và ảnh/JSON/HTML capture.
- Preview HTML do test email tạo ra chuyển từ thư mục tài liệu sang
  `target/integration-audit`; không thay đổi assertion hoặc nghiệp vụ.
- README hướng dẫn đúng cách build/run/env/DB; bỏ claim JWT/WebSocket/Cloudinary
  không phù hợp dependency hiện tại. Không triển khai AI Chat.
- Thêm SQL README phân biệt reset seed, migration hiện hành và utility tùy chọn.
  Chỉ sửa comment asset trong seed để không yêu cầu thư mục `Elements` đã bỏ;
  không thay đổi DDL/DML của script trong lượt cleanup này.
- Giữ nguyên tên và semantics migration đã áp dụng. Không thêm Flyway/Liquibase,
  không nâng cấp hoặc xóa dependency Maven cần thiết.

Đối chiếu 54 patch production đang tracked với bản diff đã lưu trước cleanup:
**không thay đổi backend, template hoặc static production đã duyệt**. Phần sửa
trong test chỉ là vị trí output preview. Không bắt đầu milestone AI/support.

## Security audit

Trước khi thêm báo cáo này, inventory gồm 219 file source/config/test/doc/assets
còn hiện hữu và eligible cho Git. Scan candidate không phát hiện các password,
mail credential, API token, bank receiver đang cấu hình trong `.env`; không có
literal Spring password default hoặc private-key/API-token pattern được phát
hiện. `.env` vẫn ignored/untracked, `.env.example` có placeholder/default công
khai an toàn. Báo cáo không chứa giá trị credential.

**SECURITY BLOCKER vẫn tồn tại trong Git history:** cả 20 reachable commit
chứa literal database password hoặc password fallback trong
`src/main/resources/application.properties`, gồm HEAD
`a57584f3f9a7fac4c6896d700c735c23f86b4003`, dòng 12. Các commit cũ tiêu biểu:
`236ec7d25a36a4dcdbcccb49a025997ea307820f` dòng 11 và
`4c00b075358100b2ae498eba0564f868d2408be6` dòng 13. Giá trị: `[REDACTED]`.

Không có `.env` từng tracked trong reachable refs đã kiểm tra. Scan source hiện
tại sạch không đồng nghĩa lịch sử Git sạch. Commit mới không loại bỏ credential
trong commit cha. Chưa rewrite, amend, reset, rebase hoặc force push.

Lệnh test ban đầu lấy credential từ history bị automatic approval review từ
chối. Không dùng lệnh đó hoặc workaround tương đương. Test/runtime thành công
sau đó dùng DB credential từ `.env` hiện tại, không lấy credential từ history.

## Database đã kiểm tra

Chỉ rà soát schema bằng SELECT. Không áp dụng migration, reset seed, demo seed,
rebuild tồn kho hoặc thêm/sửa index/constraint trong lượt cleanup.

| Kiểm tra | Kết quả |
|---|---|
| Bảng nghiệp vụ live và root seed | 26 bảng, tên bảng khớp |
| JPA table mappings được nhận diện | 24 bảng mapped; không có bảng mapped bị thiếu trong live DB |
| Backup table | `STORE_INVENTORY_BACKUP_20261004_140514500` — RETAINED INTENTIONALLY |
| Foreign keys | 38, không disabled/untrusted; không delete cascade |
| Index của lookup Storefront trọng điểm | 18 index đã rà soát; không thêm index suy đoán |
| Method constraint | COD/BANKING/VNPAY/MOMO, enabled/trusted |
| Payment/order/cancellation/review constraints đã rà soát | Enabled/trusted, vocabulary hiện hành giữ nguyên |
| `ORDERS.delivery_mail_sent_at` | `datetime2`, nullable |
| Inventory | 1.422 dòng; fixture browser xác nhận hoàn trả stock ban đầu |
| Controlled email order/account | Order 529 `TWTESTCL1791108516620` và account — RETAINED INTENTIONALLY |
| Marker mail của Order 529 | Giữ nguyên `2026-10-04T17:09:08.0863847` |

Optional demo metrics và backup DB không bị xóa. Các fixture synthetic do test
browser thêm được dọn cuối lượt; chúng không phải đơn mua/giao hàng thật.

## Build và regression mới

| Kiểm tra | Kết quả |
|---|---|
| `mvnw.cmd clean test` với SMTP local và sender synthetic | BUILD SUCCESS — 33 test, 0 failure/error/skipped |
| `mvnw.cmd clean package -DskipTests` sau test | BUILD SUCCESS |
| Mail/OTP/delivery guard/failure regression | Test Mockito; không gửi email thật |
| Chrome COD/Banking regression trên package mới | 91 kiểm tra PASS |
| COD và BANKING checkout | PASS; không cung cấp VNPAY/MOMO checkout mới |
| VietQR/reload/tampering/read-only behavior | PASS với tài khoản bank synthetic |
| Manager/admin banking confirmation và CSRF/scope | PASS |
| OPEN/CLOSED informational-only rule | PASS |
| Fixture cleanup | PASS — inventory, store config, original orders, cart user1 giữ nguyên |
| Storefront route smoke | 11 route PASS |
| Runtime log | Không có ERROR-level event/exception trọng điểm chưa giải quyết; chữ ERROR trong WARN cấu hình auth không phải ERROR event |

Package mới chạy trên **5657**, Java PID **21600**, với DB từ `.env` hiện tại,
receiver bank synthetic và SMTP local port 1. Process được dừng sau khi xác nhận
đúng PID/port ownership. App IntelliJ của người dùng tại **5656/PID 18284** được
giữ nguyên.

Route smoke: `/`, `/categories`, `/stores`, `/products/1`, `/wishlist`, `/cart`,
`/checkout`, `/orders`, `/orders/{fixtureId}`, `/orders/{fixtureId}/tracking`,
`/payments/{fixtureId}`. Product detail trả về modal fragment đúng thiết kế.
Banking page riêng đã được kiểm tra trong bộ 91 phép kiểm tra. Smoke checkout
khi không có cart hợp lệ được chuyển về cart đúng hành vi; transaction checkout
thực tế đã được kiểm tra trong regression COD/Banking.

Các lần chuẩn bị smoke đầu tiên gặp thiếu fixture, login chưa chờ chuyển trang
hoàn tất, thiếu `created_at`, và expectation full-document thay vì modal fragment.
Các lỗi thuộc harness này đã được sửa, fixture rollback/dọn sạch và lượt cuối
pass đủ 11 route. Không thay đổi production để làm các kiểm tra pass.

## Git và hành động còn cần

| Item | Trạng thái |
|---|---|
| Branch | `t-winkle-pre-ui-restore`, không đổi branch |
| Remote | `origin`, `https://github.com/CyanHuynh10/T-Winkle.git` |
| HEAD | `a57584f3f9a7fac4c6896d700c735c23f86b4003`, commit cũ |
| Upstream | Chưa cấu hình |
| Candidate source/config/artifact audit | Final scan 220 file sau khi thêm báo cáo: không phát hiện credential đã cấu hình; không có build/log/env/IDE output eligible |
| Staging | Chưa stage; index để trống do security gate |
| Milestone commit | Chưa tạo; intended subject `feat: complete T-Winkle storefront milestone` |
| Push | Chưa thực hiện — SECURITY BLOCKER |
| Working tree | Có source đã duyệt và cleanup đang chờ commit; không tuyên bố Git clean |

Kiểm tra DB cuối lượt xác nhận không còn account/order `SMOKE` do harness tạo,
inventory vẫn 1.422 dòng và marker mail của Order 529 không đổi.

Theo yêu cầu security gate trước đó, dừng trước commit/push khi credential nằm
trong lịch sử. Không tự hiểu yêu cầu cleanup là quyền rewrite history hoặc force
push. Để tiếp tục, cần xử lý credential còn hợp lệ và duyệt phương án lịch sử
riêng: xác định refs/remote bị ảnh hưởng, bảo toàn source và refs hiện tại, thử
removal trên bản sao cô lập, audit/test lại rồi duyệt cách cập nhật remote và
đồng bộ các clone. Chưa thực hiện bất kỳ bước rewrite/publish nào của phương án.

**Source hiện tại đã clean và chạy được khi có env hợp lệ. Git milestone chưa
được khóa/push vì lịch sử còn credential.**
