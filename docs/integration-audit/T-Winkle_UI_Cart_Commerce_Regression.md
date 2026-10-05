# T-Winkle UI / Cart / Commerce Regression

Verification date: 2026-10-04, Asia/Saigon. This report supersedes the earlier recovery report for the cart and the flows tested here. Final status and evidence totals appear in section Z.

## A. Current source baseline

Workspace: `D:\Cyan\Project\T-Winkle`. Branch: `t-winkle-pre-ui-restore`; HEAD: `a57584f3f9a7fac4c6896d700c735c23f86b4003`. The working tree already contained recovery work and unrelated changes. Those were preserved; no reset, commit or deployment was performed.

The application uses the existing SQL Server `T_Winkle` database, port 5656 and Java 21. Hibernate schema generation remains disabled. The final clean package was started separately after the clean tests. All final HTTP/browser checks target that packaged application, rather than a development server or mocked services.

## B. User-observed Cart failure root cause

The user's manual failure was treated as a failed gate regardless of the previous report. Fresh tracing followed the actual card listener, modal script, selected variant/store, submitted form, controller, transactional service, SQL rows and `/cart` reload.

Confirmed defects in the integration were incomplete product identity in the modal POST, hidden store rows whose visibility state was not fully cleared, insufficient guidance when selection left the submit button disabled, and inconsistent quantity validation. Search/sort listeners were also outside the fragment rendered by the shared layout, and store search used a global destination. Those defects were repaired.

The original manual failure cannot be attributed conclusively to one of these defects from the available evidence. Native pointer injection did not produce reliable clicks in this headless session. The successful final browser evidence therefore uses DOM `.click()` on the real controls and handlers, and does **not** claim a physical mouse test. Hover evidence uses Chrome's forced CSS hover state. Both methods and the actual network/SQL results are recorded explicitly.

## C. Product Card Cart fix

Card cart buttons open the approved product detail modal. They do not choose an arbitrary first variant or submit immediately. The modal requires size, color, store and positive quantity. Store catalog cards carry the current store identity; closed-store controls are disabled. Cart and wishlist handlers remain separate.

Final browser gate: clicking product 3's cart button opened its detail modal; selecting its exact variant 24 and store 1 enabled Add to Cart. The resulting request and database insertion are documented in section O and [phase-a-cart-gate.json](phase-a-cart-gate.json).

## D. Product Detail Cart fix

The modal submits `productId`, `variantId`, `storeId`, `quantity` and CSRF to `/cart/add`. Variant selection uses the actual variant matrix. The backend verifies ACTIVE product/variant, variant/product identity, OPEN store, existing inventory and available stock before mutation. `variantId` remains Long and `storeId` Integer. The controller retains compatibility with existing clients omitting productId; the current UI always supplies it and provided identity is validated.

The cart service keeps the canonical user-row PESSIMISTIC_WRITE lock. Cart reads do not create a cart. Success feedback follows the committed service call. Missing selections now have visible guidance and selection controls expose their state.

## E. Wishlist states

Circular white backgrounds and existing dimensions remain. Default hearts are neutral outlines, hover is red on white, and selected hearts are filled red on white. Initial server-rendered icons and asynchronous modal state use persisted wishlist data. Browser/SQL verification covers toggle, reload, logout/login, home, category, store catalog, wishlist and modal synchronization. The test-added wishlist entry was removed after verification.

## F. Quantity component

Modal and cart use minus / square numeric input / plus controls, with 44px square inputs and hidden native spinners. Minimum is 1, maximum is the selected inventory quantity. Modal input and increment/decrement are disabled until a store is selected. Manual input rejects empty, zero, negative, overflow and above-stock values. Backend validation repeats the constraints; changing quantity to zero no longer silently deletes a cart row. Closed-store quantities cannot be increased.

## G. Inventory-state UI

`InventoryStateService` centralizes the configured threshold `twinkle.inventory.low-stock-threshold=5`. OUT: quantity <= 0; LOW: 1..5; AVAILABLE: >5. Templates/JavaScript consume the returned semantic state instead of duplicating the threshold.

Store choices show green `Còn hàng`, yellow `Sắp hết` and red `Hết hàng` pills without visible raw quantities. Computed colors were verified as RGB (16,185,129), (202,138,4), and (239,68,68). Closed-store meaning remains separate from inventory state.

## H. Home 3×3 grids

Popular and Sale request a maximum of nine products from the service and render three desktop columns. Both final rendered sections contain nine cards at three distinct horizontal positions. Other catalog pagination retains its existing page size.

## I. Category navbar

Navbar order is `Tất cả`, `Sneaker`, `Sandals`, `Sports`, using actual database categories. Active state follows the current route with the approved cyan styling. Global links remain under `/categories`; store links remain under `/stores/{slug}/catagories`, including child category slugs. Keyword and sort are retained in category navigation.

## J. Store Catalog route/UI

Both `/stores/{slug}/catagories` and `/stores/{slug}/catagories/{categorySlug}` render the actual shared category template. The intentional spelling is preserved. Store identity/status are real database values. Category availability and products derive from that store's inventory, with ACTIVE product/variant constraints.

Search by product name or brand stays within the store and selected category. Popular, effective-price ascending and effective-price descending sorting remain database queries; no Java base-price sorting was introduced. Search, sorting, category links and pagination preserve route/context. The rendered catalog has no Filter control. The older unused store categories template is not the routed view.

[catalog-current-runtime.json](catalog-current-runtime.json) records 96 successful real HTTP/SQL comparisons across all six stores, four category contexts and four search/sort/page combinations. The integration tests also exercise store search and sorting against SQL. [Current store catalog screenshot](current-store-catalog.png).

## K. Store Search empty state

An unmatched search renders one centered glass panel with a store icon, title and description. Duplicate loose text was removed after visual inspection. The overall Stores page remains intact. [Final screenshot](current-stores-empty.png) and the UI artifact verify the resulting state.

## L. Dropdown order

Authenticated dropdown order is `Hồ sơ cá nhân`, `Địa chỉ giao hàng`, `Đơn hàng`, `Danh sách yêu thích`, `Đăng xuất`. Actual rendered order was asserted in Chrome. Logout retains its protected POST form.

## M. Avatar crop result

**OPTIONAL AVATAR CROP — NOT IMPLEMENTED (SKIPPED).** Existing server-side avatar validation/storage and profile integration remain. Crop was optional and no new cropping dependency was added. The existing recovery integration tests passed in this pass's clean test run.

## N. Shared title spacing

The canonical category layout's total pre-title space is 56px: 24px main padding + 8px main margin + 24px section padding. The equivalent shared rule preserves that result using 48px main padding + 8px margin and zero heading-section padding. Title-to-search separation is 24px. Shared CSS tokens are `--storefront-heading-before:48px` and `--storefront-heading-after:24px`.

After transitions finish, Chrome measured navbar-bottom to h1-top as exactly 56px on global category routes, store catalogs, Profile, Addresses, Orders, Wishlist, Cart, Stores, Checkout and Tracking. Order Detail uses the same wrapper start and after-spacing; its 40px back button vertically centers the 33.59375px title, giving h1-top 59.203125px. That existing row geometry is retained rather than moving its unrelated back control. The verifier explicitly allows only this measured 3.203125px centering difference. Animated intermediate measurements in the cart trace are not substituted for settled UI measurements.

## O. Cart SQL evidence

Final real request:

```text
POST /cart/add
productId=3&variantId=24&storeId=1&quantity=1&_csrf=[redacted]
```

Before: the user's cart contained rows 1, 2 and 3. After the real modal submit: CART_ITEMS row **39**, product **3**, variant **24**, store **1**, quantity **1**, was added. Existing rows were unchanged. The cart redirected to `/cart`; its rendered row carried the matching product, variant and store IDs and survived reload. The success gate uses this SQL difference, not HTTP 200 alone.

The final browser test also submitted above-stock quantity, a closed store and a mismatched product identity. Each returned to `/cart` with actual rejection feedback and no SQL change. Quantity client tests cover minimum, plus, minus, manual invalid values and maximum. The controlled row was removed and the original cart restored exactly. Evidence: [phase-a-cart-gate.json](phase-a-cart-gate.json). Separate commerce tests verify multiple variants/stores, quantity changes, selection changes, removal and read-without-create behavior.

## P. Checkout regression

Checkout displays only selected items, grouped by actual store, with actual images, variants, current effective prices, owned address choices, shipping, discounts and payment choices. It no longer evaluates a nonexistent product image property. `/checkout/quote` supplies authoritative coupon and total calculations without mutation; frontend coupon application uses that response rather than local arithmetic.

Successful checkout commits ORDERS, ORDER_ITEMS, PAYMENTS, ORDER_STATUS_HISTORY and COUPON_USAGES together with inventory/coupon changes and selected cart removal. Unselected items remain. Ownership, payment method and inventory are validated server-side. [commerce-runtime.json](commerce-runtime.json) records actual HTTP and SQL snapshots.

## Q. Pricing/coupons

Original unit price = base price + variant adjustment. Effective unit price = PricingService effective product price + variant adjustment. Order subtotal records original totals; product discount records their difference; paid item unit/line totals snapshot effective prices. Final = subtotal - product discount - coupon discount + shipping. SQL-derived expected values were compared to both quote and committed order.

One `now` is used within each pricing operation. Promotion status/start/end/type/value continue through the existing PricingService. Percent discounts honor their maximum and merchandise cap; fixed discounts cap against merchandise to prevent negative totals. FREESHIP is exactly min(shipping, coupon value), independent of merchandise. Tests include valid PERCENT/FIXED/FREESHIP and expired/inactive/exhausted/nonexistent rejection. Coupon used_count and COUPON_USAGES only change on committed checkout. Quote snapshots prove no mutation.

Concrete SQL-verified example: four selected units at original 2,929,000 and effective 2,636,100 give subtotal 11,716,000, product discount 1,171,600, PERCENT coupon discount 1,054,440 and shipping 30,000, producing total **9,519,960**. FIXED leaves only 30,000 shipping; FREESHIP discounts 30,000 despite its configured 50,000 value. Store catalog ascending/descending effective-price sequences are independently compared with SQL promotion arithmetic across the catalog matrix.

## R. Inventory/rollback

Inventory and coupon repositories retain PESSIMISTIC_WRITE locks before stock deduction and coupon validation/increment. Checkout also locks the canonical user row and processes selected inventories in deterministic store/variant order. The controlled COD transaction recorded store 1 / variant 1 stock **15 → 12**, matching quantity three.

An insufficient-stock case fails on a later selected line after an earlier deduction, proving full transactional rollback. Invalid coupon, invalid address ownership and invalid payment cases compare before/after JSON snapshots of orders, items, payments, history, coupon usages, coupons, inventory and cart. All snapshots match after rejection. Lock annotations and call ordering were inspected; no multi-process stress/load claim is made.

## S. Payment

COD, VNPAY and MOMO create a payment with method matching checkout, amount matching the order total, and status PENDING. Tests do not fabricate provider callbacks or mark unpaid VNPAY/MOMO payments PAID. External gateway settlement is outside this initial-payment regression.

## T. Order History

History is owner-scoped and ordered by createdAt DESC, id DESC, nine orders per page. The controlled fixture creates enough orders to verify the real first-page IDs against SQL. Order detail uses stored product/variant/image/paid-price/address snapshots. Foreign-order requests are rejected. Existing UI geometry is retained.

## U. Cancellation

An owned eligible order accepts a request with reason, required additional text for `Khác`, requester email and timestamp. It writes PENDING and leaves the order status unchanged. The order is locked while checking duplicate pending requests. Duplicate, delivered and cancelled-order attempts leave the relevant SQL rows unchanged. A pending request hides the repeat action and displays the pending notice.

## V. Tracking

Actual ORDER_STATUS_HISTORY is displayed chronologically ASC. The test compares rendered statuses with SQL-created history. Pending cancellation appears as `Đang chờ cửa hàng xác nhận hủy`; it does not fabricate a completed `Đã hủy` event. Order code, creation time, current status and detail link use the owned order.

## W. Delivered Order

Inspection found no usable existing fulfillment transition for a controlled delivery. A minimal production `OrderFulfillmentService` and authenticated `/manager/orders/{id}/status` action were added in the existing manager area. This is not a public testing endpoint. Enabled ROLE_MANAGER actors must manage every store on the order; the domain service also permits enabled ROLE_ADMIN actors. It locks the order, rejects pending cancellation and invalid transitions, and writes real status history for `Chờ xác nhận → Đã xác nhận → Đã giao`.

The actual scoped store manager moved controlled orders through these transitions over HTTP. An unauthorized actor is also covered by a real database integration test. The existing SecurityConfig and role boundaries were not weakened.

## X. Review

Delivered order detail exposes actual order-item review forms. Review validation requires ownership, delivered status, associated product and rating 1..5. User-row locking serializes the global user/product uniqueness check. Tests reject undelivered items, foreign ownership, ratings 0/6/-1, repeated same-item reviews and the same product from a different delivered order item.

A valid rating-five review committed as APPROVED. Product detail immediately included its comment and updated average/count/distribution data. SQL confirms one review for the user/product. All controlled reviews were subsequently removed during fixture cleanup.

## Y. Maven

Java: `C:\Program Files\Java\jdk-21.0.12.1`.

| Command | Result | Evidence |
|---|---|---|
| `.\mvnw.cmd clean test` | BUILD SUCCESS; 12 tests, 0 failures, 0 errors, 0 skipped | [Test log](ui-commerce-maven-test.log) |
| `.\mvnw.cmd clean package -DskipTests` | BUILD SUCCESS | [Package log](ui-commerce-maven-package.log) |

The 12 include three new actual-database commerce integration tests and the existing recovery/rollback/database-contract/startup tests. No application source changed after this package was built.

## Z. Final runtime status

**T-WINKLE UI/CART/COMMERCE REGRESSION — PASS.** All required final automated gates passed. The optional avatar crop is explicitly skipped.

| Fresh packaged-runtime evidence | Checks | Failed |
|---|---:|---:|
| [Cart browser/network/SQL gate](phase-a-cart-gate.json) | 20 | 0 |
| [UI and wishlist](phase-a-ui.json) | 68 | 0 |
| [Store catalog HTTP/SQL](catalog-current-runtime.json) | 96 | 0 |
| [Commerce transactions](commerce-runtime.json) | 86 | 0 |
| Total | 270 | 0 |

The final Java 21 package remains available at [http://localhost:5656](http://localhost:5656), PID 15336. Required public and authenticated routes were rendered by the final checks, including `/`, category routes, Stores/store catalogs, Cart, Checkout, Orders, Wishlist, Profile and Addresses. Chrome reported no JavaScript exceptions.

[Fresh runtime log audit](ui-commerce-log-audit.json) found **zero** actual ERROR-level entries and zero listed template, SpEL, null-pointer, SQL grammar, integrity or lazy-initialization exceptions in [the final runtime log](ui-commerce-runtime.log). The scan matches the log level rather than the word ERROR inside a startup authentication warning. Historical loader HTML/CSS/intent, completion/pageshow and internal-link blocks remain byte-identical to the approved commit, verified again by [source hashes](historical-loader-source.json).

Controlled commerce fixtures were removed in dependency order: reviews, cancellations, coupon usages, payments, history, items/orders, carts, addresses, role assignments, user and uniquely named coupons. Cleanup restores only inventory quantities consumed by those controlled orders; original timestamps are restored only when stock matches the baseline. Its four recorded inventory rows match exactly before/after. [Final database state](ui-commerce-final-db-state.json) confirms no temporary `cx%@twinkle.test` users or `CX%` coupons, the original three user1 cart rows, and wishlist products 1, 7, 16 and 31 (the tested temporary product 3 is absent). Test addresses/profile data were not changed by these runtime checks. No unrelated rows were deleted and identity sequences were not reseeded.

Relevant evidence is the **current** phase-a-cart-gate, phase-a-ui, catalog-current-runtime and commerce-runtime JSON, rather than previous development attempts.

Test method boundaries: browser interactions execute the real DOM handlers with `.click()`; hover is a forced CSS pseudo-state; commerce transactions use real HTTP sessions/CSRF and SQL Server. This establishes the automated browser-to-database flow and does not claim an additional physical mouse session or external payment settlement.

During verifier development, a malformed SQL comparison and PowerShell output encoding were corrected. A concurrent login invalidated an earlier cart browser session because the app permits one session per account; its controlled row was explicitly restored, rejection assertions were strengthened to require `/cart` plus actual feedback, and final authenticated checks were serialized. These superseded attempts are not counted as passing evidence.

### Phase A verification matrix

| UI / Flow | Result | Evidence |
|---|---|---|
| Wishlist default state | PASS | White background and outline: UI JSON |
| Wishlist hover state | PASS | Chrome CSS forced hover, white/red |
| Wishlist selected state | PASS | SQL, reload, logout/login, all card contexts |
| Modal wishlist state | PASS | Persisted selected modal heart |
| Product Card Cart flow | PASS | Browser handler → modal → real POST |
| Product Detail Add to Cart | PASS | Exact variant/store request and SQL row 39 |
| Cart DB persistence | PASS | SQL difference and exact `/cart` reload |
| Quantity [-][number][+] | PASS | Min/max, manual invalid values, server guards |
| Còn hàng badge | PASS | Actual positive-stock green pill |
| Sắp hết badge | PASS | Actual low-stock yellow pill |
| Hết hàng badge | PASS | Actual zero-stock red pill |
| Popular grid 3×3 | PASS | Nine cards / three x positions |
| Sale grid 3×3 | PASS | Nine cards / three x positions |
| Category Tất cả | PASS | Actual root route and active state |
| Global category active routes | PASS | All three category slugs |
| Store local category navigation | PASS | Store route identity retained |
| Store Catalog inherited UI | PASS | Same rendered category template; no Filter |
| Store-specific category DB result | PASS | 96 HTTP/SQL catalog comparisons |
| Stores no-result empty state | PASS | DOM assertion and visual inspection |
| User dropdown order | PASS | Actual DOM order |
| Shared title spacing | PASS | Settled measurements; Detail centering documented |
| Avatar crop optional | SKIPPED | Optional enhancement not implemented |

### Phase B transaction matrix

Runtime and SQL evidence for every row is in [commerce-runtime.json](commerce-runtime.json).

| Flow | Runtime | SQL | Result |
|---|---|---|---|
| Cart Add | Real POST and cart view | Exact variants/stores/quantities | PASS |
| Cart quantity | Protected update POST | Persisted changed quantity | PASS |
| Cart selected | Selection POST | Selected flags match | PASS |
| Checkout COD | Redirect to real detail | All related tables committed | PASS |
| VNPAY initial Payment | Actual checkout | Method/amount/PENDING | PASS |
| MOMO initial Payment | Actual checkout | Method/amount/PENDING | PASS |
| PERCENT coupon | Quote and checkout | Arithmetic/count/usage | PASS |
| FIXED coupon | Actual VNPAY checkout | Merchandise cap; nonnegative total | PASS |
| FREESHIP coupon | Actual MOMO checkout | Shipping cap 30000 | PASS |
| Inventory decrement | Successful checkout | Exact stock 15 → 12 | PASS |
| Stock rollback | Rejected later item | Full eight-table snapshot unchanged | PASS |
| Invalid coupon rollback | Four rejected coupon cases | Snapshot unchanged | PASS |
| Invalid address rollback | Foreign address rejected | Snapshot unchanged | PASS |
| Order History | Actual paged history | Owner/DESC/nine IDs | PASS |
| Order Detail | Real owned detail | Paid snapshots match | PASS |
| Cancellation request | Protected owner POST | PENDING/reason/email/time; order unchanged | PASS |
| Duplicate cancellation | Repeat rejected | No second request | PASS |
| Tracking ASC | Rendered timeline | Matches real ASC history | PASS |
| Delivered Order | Scoped manager HTTP action | Delivered status/history | PASS |
| Valid Review | Real delivered-item POST/modal | One APPROVED review | PASS |
| Duplicate Review | Same and different order item rejected | User/product uniqueness retained | PASS |
| Invalid Rating | 0/6/-1 rejected | No review inserted | PASS |
| Unauthorized Review | Foreign/undelivered item rejected | No review inserted | PASS |
