# T-Winkle Store Inventory Rebuild / Cart Finalization

Date: 2026-10-04 (Asia/Saigon). Workspace: `D:\Cyan\Project\T-Winkle`.

**T-WINKLE STORE INVENTORY / CART FINALIZATION — PASS**

This pass supersedes the prior OPEN-only purchasing rule. All required gates in this brief pass on the fresh Java 21 package: **208 browser/runtime checks**, 17 tests, clean packaging, SQL integrity and cleanup checks. Trusted browser means Chrome pointer/mouse input with `isTrusted=true`; no DOM `.click()` acceptance fallback or claim of a human holding the mouse is made.

## A. Store business-rule revision

OPEN/CLOSED now describes operating status only. Cart add, quantity, selection and checkout ignore that status. ACTIVE product/variant, actual matching store/variant inventory, positive stock and sufficient quantity remain required. Product/variant identity and owner checks remain enforced. No fake confirmation ETA or transaction delay is introduced. Store cards/details retain Đang mở/Đã đóng.

## B. STORE_INVENTORY pre-audit

[Baseline JSON](store-inventory-before.json) was captured before any database changes: **45 ACTIVE products, 474 ACTIVE variants, six stores, 2,844 inventory rows**. Every store originally carried all 474 variants and all 45 products. The JSON includes per-product variant counts, schema and active cart rows. This pass's actual original cart is row 2, quantity one, unselected; the user had already removed row 1 since the prior pass. Older fixtures were not restored.

## C. 1000-row misconception verification

Actual `COUNT(*)` returned 2,844, proving the table exceeded 1,000 rows before this rebuild. SSMS `SELECT TOP (1000)` limits a query's result, not table capacity. No replacement purchase inventory table was created.

## D. Backup

The rebuild saved **dbo.STORE_INVENTORY_BACKUP_20261004_140514500**, with all 2,844 original rows, verified in [final database evidence](store-final-db-state.json). Backup and rebuild run inside one transaction with XACT_ABORT, rollback on errors and an inventory table lock. Recovery: stop checkout activity, transactionally replace STORE_INVENTORY with the four columns store_id, variant_id, quantity and updated_at from this named backup, then verify active cart compatibility before committing. Never restore this snapshot over later legitimate stock changes without reviewing them.

## E. Inventory rebuild algorithm

[Development rebuild script](../../src/main/resources/db/rebuild-store-inventory.sql) retains STORE_INVENTORY's existing composite key. Stores are ordered by store_id; variants by ID within each product. A rotating modulo window assigns three of six stores per active variant (approximately half each product's variants per store), with intentional missing pairs. Quantity is `(variant_id * 7 + store_id * 11) % 26`, giving 0–25 stock. Active-cart pairs are included and raised to at least their current required quantities without modifying carts. Prerequisites, active variant coverage and cart compatibility are checked before commit. Repeating the same source data yields the same target distribution; each execution creates a unique recovery backup. This is an explicit development operation, never an automatic application startup seed.

## F. Inventory post-audit

**1,422 rows**, every active variant distributed, every product represented in multiple stores, all existing active cart pairs valid. All six stores still carry 45 products while carrying different variant subsets. [Full post-audit, all 45 products, variant matrix and metrics](store-inventory-after.json).

| Store | Operating status | Inventory rows / variants | Products | Zero | Low (1–5) | Available (>5) |
|---|---|---:|---:|---:|---:|---:|
| q1 | OPEN | 233 | 45 | 10 | 43 | 180 |
| q3 | CLOSED | 230 | 45 | 5 | 50 | 175 |
| q5 | OPEN | 233 | 45 | 9 | 38 | 186 |
| q7 | CLOSED | 241 | 45 | 14 | 48 | 179 |
| thu-duc | OPEN | 244 | 45 | 9 | 47 | 188 |
| binh-thanh | OPEN | 241 | 45 | 10 | 45 | 186 |

## G. Store Catalog DB fix

Catalog queries use STORES → STORE_INVENTORY → PRODUCT_VARIANTS → PRODUCTS with ACTIVE products/variants, store slug and optional category/search. Existing inventory-based queries needed no OPEN filter removal because they already browse CLOSED stores. Root and sneaker/sandals/sports children for every slug were checked against SQL. All three sort queries retain store context. The shared catalog no longer displays the store identity/status row under its heading; measured root title/search/sort positions exactly match global /categories.

## H. Store-specific variant matrix

Catalog image/detail controls carry the actual store ID into the existing modal. Supported sizes/colors derive from real variant IDs present in that store's inventory rows. Missing combinations are disabled; selected stock rows stay in store context. Global Home/categories/Wishlist derive options across the inventory system. Missing inventory differs from an existing zero-stock row, which displays Hết hàng and blocks purchase. The q1 contextual choice matrix is compared directly with SQL. [Context screenshot](store-final-store-context.png).

## I. Product Detail inventory status UI

Inventory rows show only Còn hàng (green), Sắp hết (yellow), Hết hàng (red), retaining the existing pill/border/font spacing and shadow language. No OPEN/CLOSED or visible numeric stock suffix appears there. Central `InventoryStateService` and `twinkle.inventory.low-stock-threshold=5` assign states; JS does not duplicate thresholds. Zero-stock buttons are disabled; CLOSED stores with positive stock remain selectable. All three states and the CLOSED-store positive-stock badge were checked using actual inventory. [CLOSED-store modal](store-final-detail-closed.png).

## J. Quantity control inheritance from Cart

Cart's delegated interactions and authoritative mutation pattern were extracted into shared `quantity-control.js` (`TwQuantity`). Cart and Product Detail both use its click/change/input delegation, integer parsing, stock maximum, minimum one and committed-value restoration. Modal quantity is local selection until Add; Cart commits through the protected API and re-renders server state. Trusted +/- and manual editing work in both contexts. Zero, negative, empty, nonnumeric, above-stock and overflow inputs restore the last accepted value; no competing +/- handlers remain.

## K. Product Card Cart removal

Actual cart-button markup was removed from Home, categories, Wishlist and store/shared card templates, including the legacy unused store catalog template. Card-only data-cart attributes and delegation are removed. Images/details and Wishlist remain, and Floating Cart is preserved. Only `#modalAddToCartBtn` is the product-level Add entry point. Source and rendered-page checks confirm absence, without CSS hiding.

## L. Product Detail Cart final verification

Fresh trusted input opens detail through the product image, chooses real size/color/store, edits quantity and presses Thêm vào giỏ hàng. A CSRF-protected `/cart/api/add` request inserts the exact matching CART_ITEMS row, returns authoritative state and updates the badge without changing `performance.timeOrigin`. Floating Cart navigation then displays the exact row. OPEN-store and CLOSED-store full COD flows both create owned orders, PENDING COD payments, correct totals, initial history, stock decrement and selected-cart cleanup. The CLOSED purchase uses actual Quận 7 status CLOSED, which is never changed to OPEN. Quận 3 remains CLOSED, has a browsable inventory-backed catalog and its original positive-stock cart pair remains valid. [Primary runtime/SQL evidence](store-finalization-runtime.json), [trusted event paths](store-finalization-events.json).

## M. Floating Cart count

Server-side count uses one aggregate `SUM(CART_ITEMS.quantity)` for ACTIVE carts. Guests/no cart get zero and hide the badge. Shared response rendering updates it after Add, +/-/manual quantity and remove without Document navigation. Two actual rows with quantities two and three produce badge **5**, proving it is not row count. Checkout empties the selected fixture cart and hides the zero badge. Only the compact badge is added to the approved floating control.

## N. Global back-link standardization

Shared `.tw-back-link` provides left alignment, cyan hover and one spacing rule. Checkout, Order Detail, Tracking, Store Detail and the payment page place their parent-return link under the title. Order Detail's circular back button and Tracking's footer back control were removed. Addresses use existing modal child forms and have no separate Back page control. Cart's continue-shopping link is a browsing action; business cancellation, submit controls, pagination and unrelated breadcrumbs remain unchanged. Store Detail's pre-existing incomplete script was removed so this audited route has no JavaScript syntax exception.

## O. Coupon modal redesign

The internal panel/cards now use white backgrounds, clean borders and subtle shadows, with no internal backdrop blur. Dùng mã is cyan/white with shadow and stronger cyan hover; Sao chép is white/dark with shadow and cyan hover. Unavailable cards remain gray/dimmed and both actions disabled. All code/type/value/minimum/date/usage data and backend quote validation remain. Native open/apply and computed styling/disabled-state checks pass. [White coupon modal](store-final-coupons.png).

## P. Homepage data queries

All three sections fetch exactly three records, with no hidden extra cards. PRODUCTS.created_at already exists and is mapped; no migration/backfill was needed. Newest sorts ACTIVE created_at DESC, id ASC. Popular aggregates delivered ORDER_ITEMS quantity, sold DESC / ID ASC. Sale queries only current valid positive ACTIVE promotions and orders by greatest effective monetary saving, capped at base price consistently with PricingService, ID ASC. This replaces the old cheap-product sale proxy. Native rendered IDs match independent SQL for each section. Image, promotion, rating and sold lookups are batched; lazy brand/category relations in aggregate catalog queries are hydrated once per page. [Homepage screenshot](store-final-home.png).

## Q. Demo sales/review seed

[Idempotent development seed](../../src/main/resources/db/seed-storefront-demo-metrics.sql) creates recognizable DEMO-SI data: four disabled demo users, **180 delivered orders, 474 variant order items, matching PAID COD payments, 540 actual history rows and 180 APPROVED reviews**. Existing original orders/items/history/statuses are unchanged by exact snapshot comparison. Items have actual product/store/variant FKs, price/quantity/line totals; order totals and payments match. History uses only the existing permitted Chờ xác nhận → Đã xác nhận → Đã giao states and real ordered demo timestamps. The initial seed attempt using unsupported Đang giao safely rolled back; the corrected seed succeeded. A second execution returns the same 180 orders/reviews and creates no duplicates. Sales quantities and ratings are deterministic and varied (mostly 4–5, some 3, few 1–2), never HTML constants or redundant Product columns. These are explicit development historical fixtures and do not pretend to be live purchases or deduct current inventory.

Product sales/rating/star totals aggregate canonical delivered items and APPROVED reviews. Variant sales aggregate ORDER_ITEMS.variant_id; ratings and 1–5 counts derive safely through REVIEWS.order_item_id → ORDER_ITEMS.variant_id, with consistency guards. The DTO includes soldCount, ratingAverage, reviewCount and ascending starCounts via batched aggregate queries. Variants without a review retain count zero, rather than fabricated ratings. All product/variant metrics and star distributions are in the post-audit JSON.

## R. Maven

Java 21, ddl-auto=none, existing database and port preserved. `.\mvnw.cmd clean test`: **BUILD SUCCESS, 17 tests, zero failures/errors/skips**. `.\mvnw.cmd clean package -DskipTests`: **BUILD SUCCESS**. [Test log](store-maven-test.log), [package log](store-maven-package.log). The prior CLOSED-rejection assertion was revised to assert allowed CLOSED purchases with valid inventory. The quote test now uses a transactional isolated fixture instead of assuming the user's current cart is selected. An initial grouped promotion entity-graph query failed SQL Server GROUP BY validation; ranking IDs and batch-hydrating the selected products fixed it before the final clean builds.

## S. Runtime

The fresh Java 21 packaged app remains at [localhost:5656](http://localhost:5656), PID 14452. Required public/authenticated pages and all six store/category routes are verified. **208 passing runtime checks**, zero browser exceptions, zero relevant fresh runtime errors, and all source resources match the packaged JAR. Controlled SF users/coupons/orders were removed; inventory quantities/timestamps were restored exactly after test purchases. DEMO-SI data and the backup intentionally remain. [Fresh runtime log](store-runtime.log), [final audit](store-final-audit.json), [final SQL state](store-final-db-state.json). The original global loader blocks remain byte-identical to their approved historical hashes; unrelated UI was preserved.

## T. Remaining blockers

No blockers remain for this inventory/cart finalization brief. Official VNPay/MoMo sandbox request/settlement from the earlier pass still requires merchant credentials and registered public callbacks; this pass makes no new provider-verification claim. The earlier independent SQL verifier's correlated aggregate was corrected to comply with SQL Server; only the final successful browser run is acceptance evidence.

## Required matrix

| Verification | Result |
|---|---|
| Product Card Cart removed everywhere | PASS |
| Product Detail +/- trusted click | PASS |
| Product Detail manual quantity | PASS |
| Product Detail Add Cart | PASS |
| Floating Cart count | PASS |
| Inventory green state | PASS |
| Inventory yellow state | PASS |
| Inventory red state | PASS |
| Store status hidden from inventory rows | PASS |
| OPEN Store purchase | PASS |
| CLOSED Store purchase | PASS |
| Zero-stock blocked | PASS |
| Back links standardized | PASS |
| Coupon white UI | PASS |
| Coupon cyan action | PASS |
| Store Catalog visual match /categories | PASS |
| q1 Store Catalog DB | PASS |
| q3 Store Catalog DB | PASS |
| q5 Store Catalog DB | PASS |
| q7 Store Catalog DB | PASS |
| thu-duc Store Catalog DB | PASS |
| binh-thanh Store Catalog DB | PASS |
| Store-specific size/color disable | PASS |
| Newest 3 | PASS |
| Popular 3 | PASS |
| Promotion 3 | PASS |
| Product sales aggregate | PASS |
| Variant sales aggregate | PASS |
| Product rating distribution | PASS |
| Variant rating distribution or documented schema limitation | PASS |
| Maven test | PASS |
| Maven package | PASS |
