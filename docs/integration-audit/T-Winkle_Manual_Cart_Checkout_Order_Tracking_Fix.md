# T-Winkle Manual Cart / Checkout / Order / Tracking Fix

Date: 2026-10-04 (Asia/Saigon). Workspace: `D:\Cyan\Project\T-Winkle`. This pass treats the user's manual findings as authoritative and supersedes earlier automated PASS claims for the affected flows.

**Overall: T-WINKLE MANUAL CART/CHECKOUT/ORDER FIX — INCOMPLETE.** Required storefront fixes are implemented and the non-provider acceptance gates pass. Official VNPay and MoMo sandbox requests/settlement cannot be verified until provider-issued credentials and registered callback URLs are configured. They are explicitly BLOCKED, never counted as payment PASS.

## A. Manual failures reproduced

Fresh baseline evidence: [manual-reproduction.json](manual-reproduction.json), [baseline screenshot](manual-baseline-modal.png), [database diagnosis](manual-baseline-db.json).

Trusted Chrome input produced the actual `pointerdown → mousedown → mouseup → click` path with `isTrusted=true`. No DOM `.click()` fallback is used in this pass. Hit testing inspects the target, disabled state and computed pointer-events before pressing and releasing the mouse.

Confirmed baseline findings:

- `sort=price-asc` marked both `popular` and `price-asc` selected. The default selected class was never removed.
- Modal quantity plus **did** increment after a valid OPEN store was selected. A universal quantity click failure was not reproduced, and the report does not invent one. After navigating to the store choices, however, the header's Add-to-Cart control was outside the visible scroll area (recorded top -125.625px). Missing selection also deliberately disabled quantity/cart, which was easy to misread as an unresponsive action.
- Cart checkbox and quantity controls submitted whole-page forms. Unavailable legacy items remained checkout-selectable.
- Actual `q3` / store 2 is CLOSED. User1's selected row 2 references product 6, variant 67, quantity 1 there. Its product and variant are ACTIVE and stock is 13, so the **closed store** causes the reported checkout rejection. The restriction was preserved.
- Order detail bound “Mã đơn” to the numeric PK. Tracking reused a `.timeline-node` style intended for a 24px indicator as the whole event-content row, constraining and overlapping the text.

Verifier corrections are separate from application defects. External assets initially needed more time to load; an early check interacted during the existing loading overlay; another native pointer sequence raced smooth scrolling and selected the next payment card. The final verifier waits for page/transition completion, positions targets with instant scrolling, asserts hit tests and actual payment selection, and records trusted event paths. Chrome stopped emitting mouse events after repeated mobile/desktop emulation switches; the final tracking run performs all desktop native clicks before independent mobile layout checks and passes all nine checks. Superseded attempts are not passing evidence.

## B. Sort fix

Every option now explicitly toggles its selected class and aria-current from the current sort parameter. The trigger reflects Popular, descending or ascending. Native dropdown navigation was checked for all three sorts on global root/category and store root/category routes, retaining category/store identity and keyword.

## C. Modal quantity fix

The flow presents size, color, store, quantity, then the named cart action. The input remains editable; buttons follow minimum 1 and the exact selected inventory maximum. Invalid zero, text and above-stock values reset with shared feedback. Dynamic plus/minus and maximum disabled states are checked through trusted input. Semantic stock pills remain without visible counts. CLOSED choices show `Đã đóng`, neutral disabled styling, and cannot be selected.

## D. Product Card Cart rebuild

Native cart-icon input opens the approved detail modal and focuses size selection. No size/color/store is guessed. Image, wishlist and cart events remain independent; the browser test checks that wishlist changes neither cart nor modal, image opens detail without mutation, and cart opens selection without inserting an item.

The modal is moved to body before opening, avoiding clipped/animated page ancestors and stacking contexts. Baseline hit testing did not show a backdrop universally covering controls; this is a structural safeguard rather than a claimed confirmed root cause.

## E. Product Detail Cart rebuild

Actual mutation is a persistent footer button labeled `Thêm vào giỏ hàng`, visible outside the selection scroller. Its real protected POST supplies productId (Integer), variantId (Long), storeId (Integer), quantity (Integer) and CSRF. Service validation checks ACTIVE product/variant, identity, existing OPEN store, inventory and quantity before mutation. Existing user-row locking and read-without-create architecture remain.

The native event path inserts the exact product 1 / variant 1 / store 1 / quantity 2 and the row survives `/cart` reload. Network payloads have CSRF redacted. [Final browser/HTTP/SQL evidence](manual-runtime.json), [modal screenshot](manual-fixed-modal.png).

## F. Cart AJAX conversion

Protected endpoints `/cart/api/state` and POST `/cart/api/{update,select,remove}` return authoritative quantities, selection, stock, availability/reason, prices and checkout eligibility. Business rejection returns HTTP 400 with the actual server state. Existing form endpoints remain compatible.

`cart-page.js` updates affected rows, removes empty groups, restores rejected state, updates empty/checkout state and uses the shared floating notification. Native checkbox, plus, minus, manual input and remove tests assert fetch requests, unchanged `performance.timeOrigin`, no Document request and corresponding SQL changes.

Cart GET stays read-only. On page initialization, any stale selected unavailable item is deselected through a separate CSRF-protected POST, never a GET mutation. CLOSED items show the precise reason, have disabled checkout checkboxes and remain removable. Backend attempts to select them still reject without SQL change.

## G. Cart UX

“Giỏ hàng” retains the existing shared 48px pre-heading padding token, 8px margin and 24px post-heading rule; settled navbar-to-title measurement is 56px. “← Tiếp tục mua sắm” is a text link above the information blocks. “Thanh toán” uses inline flex with centered horizontal/vertical alignment, preserving colors and dimensions. [Cart screenshot](manual-fixed-cart.png).

## H. Checkout UX

“← Quay lại giỏ hàng” is a text link below the title. Address “Thay đổi” is a cyan action with the existing hover style; “Áp dụng” uses the primary cyan action. Payment selection updates exactly one cyan card/radio state and its hidden method; keyboard support is retained. Missing addresses or selected unavailable rows disable final placement and explain the reason. Quote remains authoritative for every summary update. [Checkout screenshot](manual-fixed-checkout.png).

## I. Payment assets

Copied the user's actual `Elements/VNPay.jpg` and `Elements/Momo.jpg` into `/images/payment/vnpay.jpg` and `/images/payment/momo.jpg`. Checkout and payment UI reference these normal static URLs with object-fit containment, never drive paths or broken external logo placeholders. Browser image completion/natural size and local URLs are asserted.

## J. Coupon Browser

“Xem mã giảm giá” opens a body-level glass modal. Its content uses `aspect-ratio:9/16`, responsive width/height bounds, padding on every side and an internal vertical scrollbar.

Authenticated `/checkout/coupons` returns actual COUPONS records. The existing schema/entity already contains `min_order_value` (decimal), so it is displayed; no column was added. Cards show code, type/value, minimum, validity and remaining usage or rejection state. Eligibility reuses the same active/time/usage/minimum/type validation as authoritative quote/checkout.

Active eligible cards enable copy/apply. Expired, inactive, exhausted or otherwise ineligible cards are dimmed and disable both actions. Controlled database coupons verify all four required states. “Dùng mã” fills the input and applies through `/checkout/quote`; frontend arithmetic is not used. [Coupon browser screenshot](manual-coupon-browser.png).

## K. Checkout business failure diagnosis

The selected Quận 3 legacy item is invalid because its store is CLOSED, not because product status or stock validation should be removed. Both Cart and direct Checkout identify that reason. Direct Checkout disables placement; Cart disables selection and clears the legacy selection via protected AJAX. A forged API selection is rejected and returns unchanged state.

Checkout still checks the complete selected set inside the transaction and emits the precise store/product reason. An OPEN-store selection can proceed after the unavailable item is excluded; no closed-store order is created.

## L. COD transaction

Native controls drive Cart → Checkout → COD → Đặt hàng → `/orders`. SQL confirms the new order, snapshots, matching PENDING payment, initial status history, coupon usage, inventory decrement and removal of only selected cart items. The old CLOSED unselected fixture remains until cleanup. COD now deliberately redirects to `/orders`, as requested.

The final evidence records original/effective unit prices 2,929,000 / 2,636,100 and quantity three: subtotal 8,787,000; product discount 878,700; coupon discount 790,830; shipping 30,000; total **7,147,470**. Store 1 / variant 1 inventory changes **15 → 12**. Order detail displays those stored values rather than recomputing current prices.

## M. VNPay sandbox integration

Implemented the official sandbox payment URL flow, version 2.1.0, sorted encoded parameters, amount ×100, HMAC-SHA512, merchant/reference binding and expiry. The QR locally encodes that official signed URL; it is not a personal-transfer QR. A locked callback checks signature, merchant, reference, method and amount before a one-time PENDING → PAID/FAILED transition. Return URLs verify the signature and show feedback; settlement is IPN-driven.

Real native VNPay checkout creates a PENDING payment and redirects to its owned payment page. Missing configuration shows the explicit blocker and no QR. Unsigned IPN receives RspCode 97 and cannot mutate payment. Provider-issued request/settlement verification remains **BLOCKED — SANDBOX MERCHANT CREDENTIALS REQUIRED**. [Official VNPay contract](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html), [environment setup](PaymentSandboxConfiguration.md).

## N. MoMo sandbox integration

Implemented official sandbox `captureWallet` create requests, HMAC-SHA256, response signature/reference/amount checks, a 5-second connection timeout and a 35-second response timeout (above the documented 30-second minimum). The locally encoded QR uses provider-returned `qrCodeUrl` payload, with the validated sandbox payUrl as fallback. Only whole VND amounts from 1,000 through 50,000,000 are accepted. Verified IPN binds merchant/reference/amount and updates a locked PENDING payment once; valid notifications return 204. Authorization result 9000 does not mark PAID.

Only `/payments/momo/ipn` is exempted from CSRF to receive provider notifications; callback paths are public solely for signature verification. Cart, checkout, payment pages and QR stay authenticated/CSRF-protected as appropriate; role rules remain unchanged. Real native MoMo checkout creates PENDING and shows the explicit missing-config blocker without a QR. Unsigned notification is rejected with HTTP 400 and no mutation.

Provider create/settlement remains **BLOCKED — SANDBOX MERCHANT CREDENTIALS REQUIRED**. [Official MoMo request/QR contract](https://developers.momo.vn/v3/vi/docs/payment/api/wallet/onetime/), [official notification contract](https://developers.momo.vn/v3/vi/docs/payment/api/result-handling/notification/).

## O. Order business-code binding

History, detail, tracking and payment UI show `order.orderCode`, the existing ORDERS.order_code business value. `/orders/{id}` remains a PK-based lookup route with owner checks. Actual seeded order 2 displays `TW202609230002`, not `2`. Controlled orders' displayed codes are compared directly with SQL.

## P. Order summary

Detail always shows subtotal, product promotion discount, coupon discount (including zero), shipping and total from the order snapshot. The tracking action uses the existing cyan primary button with readable white text, centered alignment and approved hover, preserving `/orders/{id}/tracking`. Native input follows that actual link. [Order screenshot](manual-fixed-order.png).

## Q. Tracking redesign

Replaced the indicator/content collision with a responsive two-column vertical timeline: 32px indicator and flexible text with adequate spacing. Actual ORDER_STATUS_HISTORY remains ASC with real timestamps and notes. Completed events are filled; the current event is highlighted. Future milestones are neutral gray, have no timestamp and create no database records. Cancelled orders terminate in red and do not append a delivered milestone.

Status indicators and header badges use yellow waiting, cyan confirmed, green delivered and red cancelled. Pending cancellation uses a separate orange warning and never fabricates a cancelled event. The controlled cancellation is created through native owner controls and checked in SQL.

All four real seeded states are compared with SQL and measured for non-overlapping desktop/mobile content and no mobile horizontal overflow. Evidence: [tracking-runtime JSON](manual-tracking-runtime.json), [waiting/pending screenshot](manual-fixed-tracking.png), [cancelled screenshot](manual-tracking-5.png), [mobile screenshot](manual-tracking-mobile.png).

## R. SQL evidence

Primary evidence is the fresh [manual-runtime.json](manual-runtime.json), with trusted hit tests/event paths, redacted form payload, HTTP statuses, AJAX state, cart rows, order/payment snapshots, stock and coupon data. [manual-tracking-runtime.json](manual-tracking-runtime.json) records the independent real order-history comparisons. These supersede the prior pass's artifacts for acceptance.

Controlled users/coupons are uniquely prefixed MX. Cleanup removes only those fixtures in dependency order and restores inventory consumed by their own order items. Recorded store 1 / variants 1 and 2 quantities and timestamps match their baseline exactly. Original user1 cart selection/quantity and real orders were not modified by the fixture run; its tracking check is read-only. No identity reseeding or unrelated deletion is performed. The final [database snapshot](manual-final-db-state.json) confirms zero temporary users/coupons, inventory 15/16 and unchanged original cart rows 1/2.

## S. Maven

Java: `C:\Program Files\Java\jdk-21.0.12.1`.

| Required command | Result | Evidence |
|---|---|---|
| `.\mvnw.cmd clean test` | BUILD SUCCESS; 17 tests, zero failures/errors/skips | [Test log](manual-maven-test.log) |
| `.\mvnw.cmd clean package -DskipTests` | BUILD SUCCESS | [Package log](manual-maven-package.log) |

Five new database-backed transactional payment tests use explicitly synthetic test-only keys for signature tampering, wrong amount, one-time settlement, replay, authorization, failure and official amount-boundary behavior. They are local contract/security tests, **not** official provider sandbox verification. Their fixtures roll back. The earlier clean attempt failed because the previous runtime held its JAR open; it was stopped and both required clean commands then succeeded.

## T. Runtime log

The final packaged Java 21 app remains on [localhost:5656](http://localhost:5656). Fresh logs are in [manual-runtime.log](manual-runtime.log). The [final audit](manual-final-audit.json) records **143 passing checks** (134 cart/checkout checks and nine tracking checks), zero failed checks, zero relevant runtime errors, successful cleanup and unchanged original cart/inventory. Every current source resource matches its entry in the running packaged JAR; payment image copies also match their originals. No earlier runtime log is used as proof. The approved historical loader blocks remain byte-identical, rechecked by the existing hash verifier; this pass does not redesign that loader.

## U. Remaining blockers

VNPay requires `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET` and `VNPAY_RETURN_URL`, plus its registered public IPN URL. MoMo requires `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`, `MOMO_REDIRECT_URL` and `MOMO_IPN_URL`. None of these credential/configuration variables is currently present. Public registered callbacks are also needed for provider notification; localhost cannot receive those server-to-server requests.

Only official merchant/test credentials should be configured through the environment and the app restarted. No personal bank/card/phone transfer details, merchant secrets or real payment signatures were copied into source or audit logs. Configuration instructions contain names and placeholders only. Until configured, orders remain PENDING and the provider gates are BLOCKED.

### Final acceptance matrix

“Physical browser” below means trusted Chrome pointer/mouse input on hit-tested DOM controls; it does not claim a human physically held the mouse. No DOM `.click()` is used for these gates.

| Flow | Physical browser | HTTP | SQL | Result |
|---|---|---|---|---|
| Sort popular | Trusted dropdown input | Context preserved | N/A | PASS |
| Sort price-desc | Trusted dropdown input | Context preserved | N/A | PASS |
| Sort price-asc | Trusted dropdown input | Context preserved | N/A | PASS |
| Modal quantity - | Trusted mouse | Detail loaded | N/A | PASS |
| Modal quantity + | Trusted mouse | Detail loaded | N/A | PASS |
| Product Card Cart | Native icon → selection | Actual detail fetch | No premature mutation | PASS |
| Product Detail Cart | Native footer button | CSRF POST + redirect | Exact inserted row/reload | PASS |
| Cart checkbox AJAX | Native checkbox | Fetch, no Document navigation | Selected flags changed | PASS |
| Cart quantity AJAX | Native +/- and manual input | Fetch, no Document navigation | Quantity changed | PASS |
| Cart remove AJAX | Native remove | Fetch, no Document navigation | Only target removed | PASS |
| OPEN-store Checkout COD | Native full flow | Redirect /orders | Atomic order/payment/stock/cart/coupon changes | PASS |
| CLOSED-store checkout blocked | Disabled selection and placement | Forged select rejected 400 | No forbidden mutation/order | PASS |
| Coupon Browser | Native open/select | Actual /checkout/coupons | Active/expired/inactive/exhausted fixtures | PASS |
| Coupon Apply | Native Dùng mã | Authoritative /checkout/quote | Coupon and paid snapshots | PASS |
| VNPay sandbox | Selection and blocked page checked | Checkout PENDING; unsigned IPN rejected | No false PAID transition | BLOCKED — credentials/public callbacks required |
| MoMo sandbox | Selection and blocked page checked | Checkout PENDING; unsigned IPN rejected | No false PAID transition | BLOCKED — credentials/public callbacks required |
| Order business code | Native detail navigation | Owned order | Matches order_code/snapshots | PASS |
| Tracking timeline | Native tracking link; desktop/mobile | Actual owned history | ASC, all four states | PASS |
