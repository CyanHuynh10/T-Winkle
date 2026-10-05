# T-Winkle COD + Banking / VietQR finalization

Verified 2026-10-04, Asia/Saigon, in `D:\Cyan\Project\T-Winkle`.

**T-WINKLE COD + BANKING / VIETQR — IMPLEMENTATION PASS**  
**REAL QR SCAN — MANUAL VERIFICATION REQUIRED**

Runtime verification used explicitly authorized **synthetic** process environment
values. Recipient in this report: `******7890` (synthetic). Real receiving account
details were neither used for testing nor copied into this report. No money was
transferred. The user will launch through the existing IntelliJ `.env` setup.

## A. Approved baseline

The approved storefront, inventory, cart AJAX, coupon browser, store rules,
tracking, cancellation, shared layout, navigation, floating controls, and loading
behavior remain in place. This pass changes payment choices and implementation,
adds the Banking page and staff receipt confirmation, and adds minimal payment
information to Order Detail. No inventory rebuild or demo reseed was performed.

The three historical loading blocks still match their approved source hashes:
`historical-loader-source.json`. Existing unrelated working-tree edits were kept.

## B. Payment architecture revision

New checkout accepts exactly `COD` and `BANKING`. Both use the existing atomic
checkout transaction. COD redirects to `/orders`; Banking redirects to the
**existing canonical `/payments/{orderId}` route**. The latter parameter is the
order ID, preserving the established route rather than silently changing it to a
payment ID. Staff confirmation uses the actual payment ID at
`POST /payments/manage/{paymentId}/confirm`.

Banking uses BIDV VietQR Quick Link, with no merchant credentials, public domain,
callback, IPN, or provider sandbox. QR generation is read-only and never marks a
payment received. Payment remains `PENDING` until authorized receipt confirmation.

## C. Removed VNPay/MoMo implementation

Removed active checkout choices, JavaScript branches, sandbox gateway/signature
services, provider callbacks and IPN handling, provider properties, public Security
exceptions, obsolete gateway tests and configuration documentation, and the unused
ZXing dependency. README now describes the actual payment architecture.

Production source references to legacy method strings remain only in the database
compatibility migration. Focused tests retain legacy strings solely to verify
rejection for new purchases and readability of old records. Earlier integration
audit reports remain historical records, not current provider configuration.

## D. Historical Payment compatibility

Before and after cleanup: **186 COD, 2 VNPAY, 1 MOMO** payments. Existing legacy
orders 2, 3, and 5 retain their methods, statuses, amounts, and paid timestamps.
Their Order Detail pages remain readable. New checkout rejects VNPAY and MOMO.

`migration-banking-payment.sql` changes only the two named method check constraints
to allow COD/BANKING/VNPAY/MOMO. It rewrites no data and creates no new status,
column, or table. Reapplication passed; both method constraints remain enabled and
trusted. The existing PENDING/PAID/FAILED/REFUNDED status constraint is unchanged.

## E. .env / .env.example

The application consumes ordinary process environment variables through Spring
placeholders. The existing IntelliJ configuration and local `.env` were preserved.
No application dotenv parser, dependency, secondary secrets file, or alternative
environment setup was introduced.

`.env.example` preserves its previous entries and appends only safe BIDV/account
placeholders. Banking is unavailable when the required configuration is missing;
COD and the rest of the application continue working with clear feedback.

The audit utility compares local secrets in memory exclusively for the requested
source privacy audit; it never supplies application configuration or prints those
comparison values.

## F. Git secret audit

`.env` exists locally, is ignored, is absent from the index, and has no history in
the available Git refs. No index removal was necessary. `.env.example` is not
ignored. No commit was created during this pass.

The source privacy audit checked Java, templates, scripts, CSS, SQL, documentation,
tests, application configuration, README, `.env.example`, and logs. It found **zero
copies of the locally configured real account number or holder name** in those
files. Neither runtime log includes the synthetic receiver values either.

Evidence: `banking-source-audit.json`.

## G. BankTransferProperties

`BankTransferProperties` binds `twinkle.payment.bank` to `bankId`, `accountNo`, and
`accountName`. It validates BIDV/BIN 970418, a valid account identifier, and a
nonblank holder name, rejecting example placeholders. No secret-bearing generated
`toString` is present. Missing configuration is a safe business rejection rather
than an application startup failure.

Synthetic process-environment binding was verified in the packaged runtime.
Binding of the user's real IntelliJ values awaits their launch; it is not claimed
as completed by the synthetic verification.

## H. VietQrService

The service creates the URL from persisted `Order.total`, `Order.orderCode`, and
server-bound receiver configuration. Browser parameters cannot override receiver,
amount, or transfer description. UTF-8 URL encoding includes spaces and `&` safely.

It rejects fractional VND, nonpositive values, totals above 13 digits, and invalid
transfer codes. It never silently rounds the committed total. Configuration and
order validation occur within the Banking checkout transaction before commit.

## I. Checkout UI

Exactly two cards: Thanh toán khi nhận hàng and Chuyển khoản ngân hàng. Both use
the already-installed Bootstrap Icons library, matching 32px icon boxes, card
geometry, padding, radius, spacing, radio controls, and selected cyan state.
Trusted clicks verified exactly one selection and correct hidden method values.
No provider logos or external payment-choice images remain.

The previous COD card used an external cash PNG. To satisfy the explicit shared
icon-library acceptance requirement, its icon alone was replaced with `bi-cash` in
the same 32px box; its card layout, text, radio, and selected styling were preserved.
Banking uses `bi-bank` with the same geometry. Missing configuration disables the
Banking selection and shows the COD guidance.

## J. COD regression

Trusted browser flow: actual product modal selection → Add Cart → floating Cart →
Checkout → coupon → COD → Đặt hàng → Orders. The committed transaction produced
one order, one COD/PENDING payment, one item, one initial history entry, one coupon
usage, stock minus two exactly once, and selected-cart cleanup.

COD also completed through a trusted checkout click in a separate freshly started
packaged runtime with all three Banking environment variables absent.

## K. Banking Checkout

The same trusted browser flow chose BANKING and redirected to the owned payment
page. One order, one BANKING/PENDING payment, order item, status history, coupon
usage, stock decrement, and cart cleanup were verified from SQL after commit.
Purchases from both OPEN and CLOSED stores passed. Store status remained unchanged;
ACTIVE product/variant and sufficient inventory continue to govern eligibility.

## L. Banking Payment Page

Uses the approved shared layout, title followed by `.tw-back-link`, and compact
glass content. Displays configured receiver information only to the order owner,
the TW business code, committed total, transfer description, and payment state.
It explains the scan, receiver/amount/description check, and manual confirmation.

The QR uses `object-fit: contain`, responsive width, and no distortion. Desktop
and 390px mobile checks passed. The live synthetic compact2 image loaded at its
native 540×640 dimensions. The owned page sends `Cache-Control: no-store` and
`Referrer-Policy: no-referrer`.

Blocking the remote QR image showed the fallback receiver/amount/TW information;
the order stayed valid and payment PENDING. Refreshing twice, reloading the image,
and attempting query overrides caused no commerce writes or payment duplication.
Paid pages display the paid state and offer no new QR.

## M. Manual payment confirmation

Staff access: `GET /payments/manage`, then a CSRF-protected POST from the payment
card after checking that money has actually been received. Managers must manage
**every store** in the order through the existing `Store.managerEmail` association.
Admins retain their existing broader authority. Buyers are explicitly barred from
confirming their own payments, including buyers with a staff role.

The transactional service locks the payment using PESSIMISTIC_WRITE, validates
BANKING and the committed amount, changes PENDING to PAID, and records `paidAt`.
A second confirmation preserves the same PAID record and timestamp. It changes no
order, item, status history, coupon, inventory, or cart row. Runtime manager and
admin confirmations passed using controlled synthetic test orders only.

## N. Security

Anonymous payment access redirects to login. An authenticated non-owner receives
404. Ordinary buyer confirmation and a manager outside store scope receive 403.
Missing CSRF on staff confirmation receives 403. Tests also cover a buyer who has
ROLE_MANAGER and still cannot self-confirm.

The `/payments/manage` rules precede the general authenticated payments matcher.
Global CSRF remains enabled, with no obsolete provider callback exclusions. Removed
VNPay/MoMo callback URLs returned 404 when authenticated. QR generation and page
GETs expose no payment mutation action.

## O. SQL evidence

Selected controlled transactions, captured before fixture removal:

| Flow | Order / TW code | Payment after checkout | Committed total | Item/stock | Coupon | Selected cart |
|---|---|---|---:|---|---|---|
| COD / OPEN | 460 / TW2026100416060039C6 | COD/PENDING | 4,774,980 VND | one item, qty 2; 18→16 | one usage, used_count 1 | removed |
| Banking / OPEN | 461 / TW202610041606380C47 | BANKING/PENDING | 4,774,980 VND | one item, qty 2; 16→14 | one usage, used_count 1 | removed |
| Banking / CLOSED | 462 / TW2026100416075171F8 | BANKING/PENDING | 4,774,980 VND | one item, qty 2; 13→11 | one usage, used_count 1 | removed |

Each flow added exactly one order/payment/item/history/coupon usage. Manager/admin
confirmation changed only payment status and paid timestamp. Full commerce
snapshots matched across read/retry and confirmation checks; the duplicate
confirmation preserved the complete payment snapshot as well.

Cleanup removed all synthetic orders, payments, coupons, users, and cart data,
restored consumed inventory and its timestamps, and restored the original manager
assignments. Original order/payment counts, legacy payment records, and the original
user cart matched baseline. All **1,422 inventory rows** remain, quantities 0–25;
zero BF/BM/BP fixture users remain. Database identity sequences were not reseeded.

Evidence: `banking-payment-before.json`, `banking-migration-result.json`,
`banking-migration-repeat.json`, `banking-browser-results.json`, and
`banking-final-db-state.json`.

## P. QR generation

The verified synthetic URL uses BIDV, compact2 PNG, the server receiver, exact
committed total, exact TW order code in `addInfo`, and encoded configured holder
caption. It uses no browser-computed amount or numeric PK as transfer description.

The implementation follows the [official VietQR Quick Link documentation](https://vietqr.io/danh-sach-api/link-tao-ma-nhanh/).
BIDV/BIN 970418 compatibility was checked against the [official bank list](https://api.vietqr.io/v2/banks).
The configured `accountName` is the image caption; the real bank app must resolve
and verify the recipient against the account, rather than trusting that caption.

Automated Java tests validate URL construction only and make no external VietQR
calls. Remote image rendering was verified separately in the synthetic runtime.

## Q. Manual QR scan

**QR SCAN — REQUIRES MANUAL VERIFICATION.**

Launch the finished application through the existing IntelliJ `.env` configuration.
Create a Banking checkout and scan its QR using an actual banking application.
Verify BIDV, the intended resolved account holder/recipient, exact order total, and
exact TW transfer content. No automated money transfer is part of verification.
Only confirm a real order PAID after an authorized actor checks actual receipt.

The synthetic app instances are stopped and port 5656 is available for IntelliJ.
No synthetic receiver has been saved into `.env` or application defaults.

## R. Asset cleanup

Removed all four explicitly requested files:

- `src/main/resources/static/images/payment/vnpay.jpg`
- `src/main/resources/static/images/payment/momo.jpg`
- `Elements/VNPay.jpg`
- `Elements/Momo.jpg`

Production HTML/CSS/JavaScript contains no stale provider logo references. No
unrelated assets were removed. The Banking choice uses a library icon rather than
a BIDV image.

## S. Maven

Java 21: `C:\Program Files\Java\jdk-21.0.12.1`.

- `mvnw.cmd clean test`: **BUILD SUCCESS**, 19 tests, 0 failures/errors/skips;
  seven focused payment tests plus the twelve retained application/commerce tests.
- `mvnw.cmd clean package -DskipTests`: **BUILD SUCCESS**.
- Logs: `banking-maven-test.log`, `banking-maven-package.log`.

The new package SHA-256 is
`3b6ffda349a332d02602a57ed9b59d2cc954debc8d42f131d0385a348ab9e6ab`.

## T. Packaged runtime

The fresh package was run with Java 21, SQL Server T_Winkle, port 5656, and
`ddl-auto=none`, first with synthetic environment configuration and then without
Banking variables. Home, Cart, Checkout, Orders, Order Detail, payment page, and
staff management were verified.

The final main browser run recorded **91/91 PASS** checks with trusted native mouse
events. Five focused mobile/rendering results and six missing-configuration checks
also passed. No browser script exceptions occurred.

Both runtime logs have zero ERROR-level entries and zero TemplateInputException,
TemplateProcessingException, SpelEvaluationException, NullPointerException,
SQLGrammarException, DataIntegrityViolationException, or LazyInitializationException.
Neither log exposes receiver account/name or `.env` contents. The existing Spring
authentication-provider warning mentions the word ERROR as a logging-level setting;
it is a WARN entry, not an application error.

Evidence: `banking-runtime.log`, `banking-missing-config-runtime.log`,
`banking-browser-results.json`, `banking-browser-events.json`,
`banking-mobile-results.json`, `banking-missing-config-results.json`, and
`banking-source-audit.json`. Screenshots ending in `synthetic.png` contain test
receiver data only.

## U. Remaining issues

No unresolved implementation or runtime failure remains in this payment pass.
Real-account IntelliJ launch and the actual banking-app scan are the remaining
manual acceptance gate. Neither is inferred from synthetic image rendering.

The repository already has extensive uncommitted changes and whitespace findings
in approved files from earlier work; those unrelated files were preserved. No
commit, deployment, or financial transaction was performed.

## Final acceptance matrix

| Verification | Result |
|---|---|
| COD only + Banking only for new checkout | PASS |
| VNPay UI removed | PASS |
| MoMo UI removed | PASS |
| VNPay logo removed | PASS |
| MoMo logo removed | PASS |
| stale provider backend removed | PASS |
| stale provider Security exemptions removed | PASS |
| Banking uses existing icon library | PASS |
| `.env` ignored by Git | PASS |
| `.env.example` safe for Git | PASS |
| bank env configuration loads | PASS — synthetic process env; real IntelliJ launch pending |
| no real bank details committed | PASS — source comparison clear; `.env` untracked/no available history |
| BANKING DB method supported | PASS |
| COD regression | PASS |
| Banking Checkout | PASS |
| Payment BANKING/PENDING | PASS |
| VietQR generated | PASS |
| exact Order finalTotal in QR | PASS |
| exact TW business code in QR | PASS |
| authenticated payment page | PASS |
| user cannot self-mark PAID | PASS |
| Manager/Admin can confirm PAID | PASS |
| confirmation idempotent | PASS |
| no duplicate Order | PASS |
| no duplicate stock deduction | PASS |
| no duplicate coupon mutation | PASS |
| QR scan via real banking app | MANUAL REQUIRED |
| Maven test | PASS |
| Maven package | PASS |
| fresh runtime log | PASS |
