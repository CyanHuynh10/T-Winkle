# T-Winkle final storefront closeout

Verified 2026-10-04, Asia/Saigon.

**T-WINKLE FINAL STOREFRONT CLOSEOUT — PASS**

All automated and runtime gates passed. One real notification was sent to the
configured mailbox; the user confirmed receipt and correct HTML details in this
chat. No mail credential, receiver bank configuration, or `.env` content appears
in this report.

## A. Approved baseline

This pass has exactly two feature scopes: Banking QR page polish and delivered-order
email. Checkout/payment transactions, COD, VietQR URL generation, bank environment
configuration, payment receipt confirmation, authorization, statuses, store rules,
cart, coupons, cancellation, tracking, reviews, navigation, and shared layout were
preserved. The approved loading blocks still match their historical hashes.

The email feature adds one nullable Order notification marker and integrates with
the existing fulfillment service and OTP email infrastructure. Existing unrelated
working-tree changes were preserved. No commit or deployment was performed.

## B. Banking QR UI polish

The visible “Tải lại mã QR” text link is removed. A compact 36px Bootstrap
`bi-arrow-clockwise` icon button sits in its own row at the top-right **inside**
the existing card, above and separated from the centered QR. It has a neutral white
background, subtle shadow, normal gray icon, cyan hover/focus, and an accessible
reload label. No icon package was added.

The original responsive image width and `object-fit: contain` remain. Trusted
browser input verified placement, centering, cyan hover, and a reload request for
the same authoritative QR URL. Complete order/item/payment/history/coupon/stock/cart
snapshots were identical before and after reload and page refresh. Payment stayed
BANKING/PENDING. Desktop and 390px mobile layouts have no horizontal overflow.
Owner-only access, `Cache-Control: no-store`, and `Referrer-Policy: no-referrer`
remain in place.

Banking screenshots use explicitly checked synthetic receiver data. The existing
Banking regression script's retry selector was updated to the new icon ID.

Evidence: `closeout-browser-results.json`, `closeout-browser-events.json`,
`closeout-qr-desktop-synthetic.png`, `closeout-qr-mobile-synthetic.png`.

## C. Existing mail infrastructure

OTP uses `AuthService` → `EmailService.sendEmail` → the existing `JavaMailSender`,
configured by existing `spring.mail.*`, `MAIL_USERNAME`, and `MAIL_APP_PASSWORD`.
The original OTP method signature, subject, plaintext body, and sending path remain
compatible. `EmailService` now also prepares delivered-order HTML through that
same sender. No second SMTP configuration or mail system was created.

Three 10-second SMTP connection/read/write timeout settings were added to the
existing configuration to limit individual stalled network operations. The
existing `app.base-url` / `APP_BASE_URL` property supplies the order link. `.env`
and its IntelliJ loading setup were not changed.

## D. Delivered email architecture

The locked fulfillment transaction changes status and saves history, then publishes
`OrderDeliveredEvent(orderId, historyId)`. `OrderDeliveredListener` handles it with
`@TransactionalEventListener(AFTER_COMMIT)`. It calls a separate Spring bean,
`OrderDeliveryNotificationService`, using `REQUIRES_NEW` to reload committed data,
lock the order, check the persistent guard, send, and record success.

This follows [Spring's transaction-bound event pattern](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html).
The independent transaction is necessary because changes made using the original
after-completion resources would not commit; see the [Spring annotation documentation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/event/TransactionalEventListener.html).

SMTP executes only after the business delivery transaction commits. The separate
notification transaction holds the per-order lock to serialize competing sends;
an SMTP failure can roll back its notification marker, never the already-committed
delivery status/history. No broker, scheduler, batch sender, or retry subsystem
was introduced.

## E. Database migration

`src/main/resources/db/migration-order-delivery-mail.sql` adds only
`ORDERS.delivery_mail_sent_at DATETIME2 NULL` when absent. `Order.deliveryMailSentAt`
maps the field. Application `ddl-auto=none` remains unchanged.

The migration was applied and reapplied successfully. Existing order statuses and
rows were not rewritten. Historical delivered orders receive no startup event and
are not batch-mailed. Their sent markers remain NULL.

Evidence: `closeout-db-before.json`, `closeout-migration.json`,
`closeout-migration-repeat.json`, `closeout-final-db-state.json`.

## F. Delivery transition integration

Production status-write inspection found one legitimate delivery transition:
`OrderFulfillmentService.transition`, called by the existing authenticated,
CSRF-protected `POST /manager/orders/{id}/status` route. The new event is published
at that canonical domain service rather than attached to a frontend button.

Existing actor checks, store-manager scope, pessimistic order locking, pending
cancellation rules, and permitted transitions are preserved. Only a valid
non-delivered → Đã giao transition publishes the event. Non-delivered transitions,
read/detail/tracking operations, duplicate delivery requests, and rolled-back
transitions do not send email. A duplicate delivery request retains the existing
invalid-transition behavior and does not append another history entry.

## G. Email template

Dedicated template: `src/main/resources/templates/mail/order-delivered.html`,
rendered through the existing Thymeleaf engine and sent as UTF-8 HTML using
`MimeMessageHelper`. The template uses email-safe tables and inline styles: neutral
background, white card, dark text, cyan branding/total/action, and green delivered
status. It uses no scripts, animation, glass effects, CSS Grid, or unreliable local
product images.

Thymeleaf escapes recipient, address, notes, product and variant snapshots. Tests
include hostile markup and verify it stays escaped text. Desktop and mobile
full-page previews were inspected without overflow. The synthetic preview
deliberately displays escaped test markup to demonstrate this protection.

Evidence: `closeout-email-preview.html`, `closeout-email-rendering.json`,
`closeout-email-desktop-full-synthetic.png`,
`closeout-email-mobile-full-synthetic.png`.

## H. Email contents

Subject: `[T-Winkle] Đơn hàng {orderCode} đã được giao thành công`.

The email contains branding, the required delivered heading and greeting, TW code,
stored order date, actual delivered-history timestamp, delivered status, readable
payment method and actual persisted payment status, historical shipping snapshot,
nonblank shipping note, and every OrderItem.

Items use stored product name, `variantName` (size/color snapshot), quantity,
committed unit price, and line total. Store name uses the existing associated store
model; no OrderItem schema change was introduced. Totals use stored subtotal,
product discount, coupon discount, shipping, and final total. Zero discount rows
are displayed consistently. Current product prices, promotions, and UserAddress
records are not used to recompute historical values.

COD/BANKING labels and all four payment states are tested. Legacy VNPay/MoMo values
remain readable only as historical email labels. The configured base URL creates
the protected `/orders/{orderId}` detail link; localhost is not hardcoded in the
mail template. The recipient always comes from `Order.user.email`, never browser
input.

## I. Idempotency

The original delivery transaction is pessimistically locked. The independent
notification transaction also locks that order and checks `deliveryMailSentAt`.
Success writes the marker using a conditional repository update of that column
alone, preserving the business `updated_at` delivery snapshot.

Tests verify duplicate status requests, duplicate event handling, a previously
persisted marker, and two concurrent delivery requests produce one successful
notification. Concurrent status updates produce one delivery history entry.
The real runtime duplicate request preserved the sent timestamp.

## J. Mail failure behavior

A simulated SMTP failure leaves the order Đã giao and its delivery history committed,
with `delivery_mail_sent_at = NULL`. The listener catches failure and logs only
order ID, failure class, and safe outcome guidance. It logs neither exception
message/stack nor recipient, credentials, or message content. No automatic retry
occurs. This test's deliberately simulated warning is not a runtime failure.

If SMTP succeeds but marker persistence fails, the listener logs that distinct
outcome and performs no immediate resend. SMTP and a relational database cannot
share an atomic commit: a process crash after acceptance but before marker storage
can leave an unstamped accepted message. The lightweight after-commit event is
also not a durable outbox if the process stops before handling it. These explicit
limits are consistent with this pass's requested lightweight design; normal
duplicate/concurrent requests are guarded. No absolute distributed exactly-once
guarantee is claimed for crash or ambiguous transport failure windows.

## K. OTP regression

The test invokes the actual OTP generation path with a mocked shared sender. It
verifies the correct recipient, unchanged OTP subject, six-digit message, persisted
verification record, and the existing plaintext sending method. Mail configuration
and the HTML extension coexist in the application context. Maven sends no real
Gmail messages.

## L. Automated tests

**33 tests passed**, 0 failures/errors/skips: 19 retained payment/commerce/application
tests and 14 delivered-email cases. The new cases cover committed versus rolled-back
delivery, correct owner recipient, business code, delivery time, shipping/items/
totals snapshots, escaping, payment labels/states, persistent guard, duplicate
events/status updates, concurrent updates, SMTP failure isolation, and OTP.

`JavaMailSender` is mocked throughout the new Maven email tests. The generated MIME
content is asserted by meaningful fields rather than a brittle entire HTML string.
The sender mock finalizes MIME headers as the real sender does.

## M. Real mail manual verification

The user explicitly authorized **one** test message to the configured mailbox.
A clearly labelled controlled order, `529 / TWTESTCL1791108516620`, was owned by
that account through canonical persisted ownership. A temporary authorized store
manager invoked the existing CSRF-protected delivery route; an extra browser
recipient parameter was ignored.

| Evidence | Result |
|---|---|
| Actual delivery/history timestamp | 04/10/2026 17:08:52, Asia/Saigon |
| Order status | Đã giao |
| Payment snapshot | COD / PENDING, 295,000 VND |
| Successful sent timestamp | 04/10/2026 17:09:08.0863847, Asia/Saigon |
| Delivered history count | 1 |
| Duplicate delivery request | No resend; same sent timestamp |
| Inbox receipt and correct HTML details | **PASS — user confirmed in this chat** |

The successful timestamp follows the real delivery timestamp rather than replacing
it. SMTP acceptance was verified first; final PASS was recorded only after the
user confirmed actual receipt and rendering. No further real test emails were sent.
The verification script records its one-attempt guard before the transition and
refuses to run a second real-mail attempt.

The labelled controlled order and its notification marker remain for review, along
with its controlled owner account. No actual purchase, shipment, or money transfer
is required by that fixture. All temporary staff/QR test accounts and QR order data
were removed, consumed QR-test stock was restored, and original manager assignments
were restored. Original order-status counts remain 6 waiting, 182 delivered,
1 cancelled, and 1 confirmed; the retained test adds one delivered order. All 1,422
inventory rows and the original user cart remain in place. Historical orders have
zero sent markers; only the controlled order has a successful marker.

Evidence: `closeout-real-mail-attempt.json`, `closeout-real-mail-check.json`,
`closeout-controlled-mail-order.json`, `closeout-final-db-state.json`.

## N. Maven

Java 21: `C:\Program Files\Java\jdk-21.0.12.1`.

- `mvnw.cmd clean test`: **BUILD SUCCESS**, 33 tests, 0 failures/errors/skips.
- `mvnw.cmd clean package -DskipTests`: **BUILD SUCCESS**.

Logs: `closeout-maven-test.log`, `closeout-maven-package.log`.
Package: `target/t-winkle-0.0.1-SNAPSHOT.jar`.
SHA-256: `51d5a0e8cfcff4461dba09c79b2141fd2279422ebc23d2b6bdaf184dfcd70ea6`.

## O. Runtime

The existing application occupied port 5656 while the fresh package was starting.
That startup conflict was isolated in `closeout-port-conflict.log` and resolved
for verification by running the fresh package on temporary port **5657**. The
project's normal configured port remains 5656; the pre-existing process was not
stopped or replaced.

The fresh Java 21 package, `ddl-auto=none`, passed Home, Cart, Checkout, Orders,
Order Detail, Tracking, Banking payment, and the existing staff delivery POST flow.
The staff POST was inspected without following its pre-existing manager-detail
redirect; this pass does not claim to rebuild the separate manager page templates.
There were **20/20 PASS** storefront/QR browser checks, two desktop/mobile email
rendering checks, and successful real-send/duplicate-request/inbox-confirmation
evidence. No browser script exceptions occurred.

The final fresh-runtime log contains zero ERROR-level entries and zero requested
template/SpEL/null/mail/SQL/integrity/lazy-loading error markers. The existing Spring
authentication warning mentions ERROR as a logging setting, but is a WARN entry.
Source/log comparison found no copied real SMTP password or bank receiver details,
and no recipient address or receiver configuration in the runtime log.

The owned temporary test process on 5657 was stopped after verification. The
pre-existing application on 5656 remains running.

Evidence: `closeout-runtime.log`, `closeout-source-audit.json`, browser/rendering
artifacts, and the real-mail check artifacts above.

## P. Remaining issues

No unresolved closeout implementation, runtime, or inbox verification failure
remains. The notification durability/SMTP-marker crash-window limits are documented
in J. The one clearly labelled controlled mail order is retained for audit/review.
No retry subsystem, manager UI redesign, or unrelated storefront change was added.

## Final acceptance matrix

| Verification | Result |
|---|---|
| QR reload text removed | PASS |
| QR reload icon top-right | PASS |
| QR centered | PASS |
| QR reload has no DB mutation | PASS |
| delivery_mail_sent_at migration | PASS |
| mail uses existing OTP infrastructure | PASS |
| only transition to Đã giao triggers email | PASS |
| duplicate delivery does not resend | PASS |
| correct recipient email | PASS |
| correct TW order code | PASS |
| correct delivery timestamp | PASS |
| shipping snapshot included | PASS |
| all OrderItems included | PASS |
| totals use stored snapshots | PASS |
| COD label correct | PASS |
| BANKING label correct | PASS |
| mail failure does not rollback Order | PASS |
| successful mail stores sentAt | PASS |
| OTP regression | PASS |
| HTML email rendering | PASS |
| real test email received | PASS — confirmed by user |
| Maven test | PASS |
| Maven package | PASS |
| fresh runtime log | PASS — isolated fresh package on 5657 |
