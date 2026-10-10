# Database source of truth

## Final delivery execution order

Restore an authorized, verified existing storefront backup first. These scripts
are not a demonstrated empty-database bootstrap. Review the actual schema and apply
only missing scripts after a recovery backup, in order: avatar → banking-payment →
order-delivery-mail → chat-support → manager-console → admin-console →
full-integration → final-features (`migration-<name>.sql`). `schema-auth.sql`
initializes only the early authentication schema; never run it blindly on an existing
database. Demo seeds/cleanup and `rebuild-store-inventory.sql` are optional historical
development utilities, not installation steps. No migration/cleanup SQL was executed
on the approved live database during final source cleanup. Regression uses an isolated
backup copy; `ddl-auto=none` remains.

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
| `migration-chat-support.sql` | Bổ sung bảng size chart có nguồn kiểm chứng, phân công nhân viên theo cửa hàng và chat người dùng/cửa hàng bền vững; không lưu hội thoại AI hoặc seed bảng size chưa kiểm chứng |

Chat migration giữ `ddl-auto=none`, có transaction và các SET options cần cho
filtered indexes trên SQL Server. Áp dụng thủ công trước khi sử dụng Human Chat.
Không tự phân quyền nhân viên. ROLE_SUPPORT cần một dòng active trong
`STORE_STAFF_ASSIGNMENTS` cho đúng cửa hàng. Ví dụ phân công bằng tham số quản
trị đã kiểm chứng: `store_id`, `user_email`, `active=1`. Các kiểm thử tạo phân
công synthetic trong transaction và rollback, không thay đổi quyền vận hành.

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
# Manager Console

After the existing Chat migration, apply `migration-manager-console.sql` manually. It is additive and idempotent; `ddl-auto=none` stays in place. It adds store status history, catalog/restock requests, staff read state, per-store fulfillment and inventory reorder levels. It preserves existing order history and inventory quantities. See `demo/README.md` for the isolated optional review dataset and guarded cleanup.

### Admin Console
Apply `migration-admin-console.sql` manually after the Chat/Manager migrations. It adds the
inventory movement/payment verification/Admin audit/config tables, normalized promotion
scope targets, request review notes and per-user coupon limits. It is additive and idempotent;
`ddl-auto=none` remains. Existing promotions retain PRODUCT scope/priority 0. Run the full
rollback test suite and packaged verification. The small `TWADMINTEST-smoke-*` browser fixture
must be removed with `tools/admin/smoke-cleanup.sql`; compare original fingerprints afterward.
Use `tools/integration/account-integrity.sql` for read-only constraint checks and
`tools/manager/cleanup-fingerprints.sql` to compare ordered business-data fingerprints.

### Full Project Integration / Final Fix

After the existing Chat/Manager/Admin migrations, take and verify a recovery backup, then apply
`migration-full-integration.sql` manually. This transaction adds PICKUP/DELIVERY, canonical
order status constraints, truthful manual refund records and CHANGE_PASSWORD OTP support.
It removes the exact proven obsolete payment samples, the retired role and obsolete config
tables while preserving Admin audit history. Identity mismatches or unsupported retained
historical payments abort for review. Repeat execution is supported; `ddl-auto=none` remains.
Do not run database migrations concurrently with integration tests or fixture cleanup.
Regression tests live in `src/test/java/cyan/project/twinkle/`; run them against an
isolated database copy as described in the root README. Automatic startup account seeding is removed.
## Final feature migration

Apply `migration-final-features.sql` manually to the existing SQL Server database after a verified backup. It is additive/idempotent and was verified by running twice. Reviews retain their authoritative existing order-item Store provenance; `REVIEW_RESPONSES` uses composite FKs to preserve that linkage. `STORE_REPORTS` stores private prepared XLSX files, sent timestamps, byte hashes and query/column snapshots, with a 20 MiB byte constraint. No account/Store assignment or demo data is seeded by this migration.
