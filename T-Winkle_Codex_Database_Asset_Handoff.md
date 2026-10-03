# T-Winkle — Codex Database & Temporary Image Asset Handoff

## Database
Use `T-Winkle_Database_Sample_C15_Codex_Ready.sql` as the database seed/reset script.

The SQL preserves the existing 26-table Storefront contract. It does not add an avatar column to `USERS`.

## Temporary image source
Source file on the developer machine:

`D:\Cyan\Project\T-Winkle\Elements\Raw\T-Winkle.png`

Codex must copy that file into the project before runtime verification:

- `src/main/resources/static/images/storefront/products/T-Winkle.png`
- `src/main/resources/static/images/storefront/stores/T-Winkle.png`
- `src/main/resources/static/images/storefront/brands/T-Winkle.png`
- `src/main/resources/static/images/storefront/categories/T-Winkle.png`
- `src/main/resources/static/images/storefront/avatars/T-Winkle.png`

The same temporary image is intentionally reused for all product/store/brand/category image records and the user-avatar fallback.

Do NOT store the absolute `D:\...` path in SQL or application source as an image URL. Database image fields use project-relative web paths such as `/images/storefront/products/T-Winkle.png`.

## Missing folders/files
During backend integration, Codex must inspect the live project and create any missing backend folders/files required by the canonical flow. Reuse existing correct files first; create only what is actually missing and required by the backend contract.

Do not create UI redesigns or new frontend architecture merely because a backend file/folder is missing.

## User avatar
`USERS` has no avatar column in the canonical schema. Do not change the schema to add one. Use `/images/storefront/avatars/T-Winkle.png` as the temporary static avatar fallback where the current UI needs a user avatar.

## Verification
After database import and backend integration, verify that:
- all 26 tables exist;
- payment statuses remain `PENDING/PAID/FAILED/REFUNDED`;
- cancellation statuses remain `PENDING/APPROVED/REJECTED`;
- no forbidden legacy coupon/payment fields are introduced;
- image-bearing seeded records point to the temporary in-project asset paths;
- no duplicate ACTIVE cart exists for a user in the seed data;
- pending cancellation does not simultaneously mark the order as `Đã hủy`.
