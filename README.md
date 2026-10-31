# T-Winkle

T-Winkle is a footwear storefront and store operations application using Java 21,
Spring Boot 4.1.1 and SQL Server. Storefront, Chat, Manager, Admin and Support use
Spring MVC, Thymeleaf, Bootstrap 5 and ordinary JavaScript modules. Initial console
tables and dashboard metrics are server rendered; filters and operations use the
existing protected REST services. Conversations receive live WebSocket/STOMP updates.
JPA/Hibernate handles entity persistence; JdbcTemplate remains for specialized queries.

## Roles and features

- `ROLE_USER`: authentication, OTP/reset/settings, catalog/filtering/store inventory,
  cart/wishlist, checkout, pickup/delivery, COD or Banking/VietQR, orders/tracking,
  cancellation/refunds and product reviews.
- `ROLE_MANAGER`: store dashboards, catalog/inventory/orders, payment verification,
  customer conversations, review responses and XLSX reports sent to Admin.
- `ROLE_ADMIN`: account/store/catalog governance, banking verification, promotions,
  coupons, dashboards, received reports and audit history.
- `ROLE_SUPPORT`: assigned-store conversations and review management.

Groq AI Chat uses `openai/gpt-oss-120b` and session conversations. Human handoff uses
persistent store chat and WebSocket/STOMP. Excel export uses Apache POI. Banking QR
is not proof of payment: confirmation is manual. The approved Admin-created-account
default-password policy remains; exposed/default accounts need review before public
production deployment. No removed roles or payment methods are restored.

## Environment

Install JDK 21 and SQL Server with TCP enabled. Maven packages the frontend assets;
Node/npm and a frontend development server are not needed to build or run the app.
Defaults: application `http://localhost:5656`; database `T_Winkle` at localhost:1433.
Use `.env.example` and `src/main/resources/application.properties` for settings.

Supply `DB_USERNAME`, `DB_PASSWORD`, `MAIL_USERNAME`, `MAIL_APP_PASSWORD`,
`APP_BASE_URL`, `BANK_TRANSFER_*`, and `GROQ_API_KEY` through the process environment.
`AI_PROVIDER`, `GROQ_MODEL` and `GROQ_BASE_URL` select AI configuration; optional
`AVATAR_UPLOAD_DIR` selects avatar storage. Spring Boot does not automatically load
`.env`: configure IntelliJ or export values privately before Maven/Java execution.
Keep `.env` ignored. Never copy credentials into source, documentation or logs.
`JWT_SECRET` optionally enables API token issuance; supply a Base64-encoded key
containing at least 32 cryptographically random bytes. Missing configuration returns
503 for issuance and rejects bearer authentication without affecting browser login.

## Database prerequisites and migration order

For a new empty database, apply `src/main/resources/db/schema-baseline.sql`, then
generate the public demo seed with `python tools/release/seed_demo.py OUTPUT.sql`
and apply it to that empty database. The seed refuses the live `T_Winkle` name and
any populated tables; it creates no accounts, credentials or transactions. Set
`SPRING_DATASOURCE_URL` to the new database when running the app. A verified fresh
bootstrap reproduces 45 products, 259 variants and 776 sparse inventory/demo-sales
rows each. Configure accounts and store assignments through a separately approved
operator process; private account data is deliberately excluded. See
[database instructions](src/main/resources/db/README.md). Apply only missing manual
migrations after a verified recovery backup, in this order:

1. `migration-avatar.sql`
2. `migration-banking-payment.sql`
3. `migration-order-delivery-mail.sql`
4. `migration-chat-support.sql`
5. `migration-manager-console.sql`
6. `migration-admin-console.sql`
7. `migration-full-integration.sql`
8. `migration-final-features.sql`
9. `migration-final-catalog.sql` (schema only; do not reseed existing installations)

`schema-auth.sql` is auth-only initialization, not the whole storefront baseline.
Demo seed/cleanup and inventory rebuild SQL are optional development tools, not
normal installation steps. Never execute them on an approved live database.
Keep `ddl-auto=none`; startup does not run migrations or seed accounts.

## Frontend architecture

`templates/layouts/console.html` supplies role-aware navigation and the shared
Bootstrap console frame. `templates/console/page.html` renders backend page data;
`templates/fragments/console-ui.html` provides shared feedback and conversation UI.
`static/js/console/` contains request/CSRF handling, tables, editors, reviews,
dashboards, exports and chat. `metadata.json` retains the approved form definitions
and table columns. Bootstrap and the standalone STOMP client are bundled locally
under `static/vendor/`, with their licenses. Product images remain local.

The former React UI source, Vite configurations and generated bundles are retired.
`frontend/` retains optional browser/CSS regression tooling only; current native
browser suites are under `tools/migration/` and `tools/console/`. Historical recovery
archives are stored outside the repository and are not build prerequisites.

Operational tables share centered headers, values and compact actions. Inventory
quantity and customer availability are separate columns and separate XLSX fields.
Availability comes from the backend (0 out, 1–5 low, >5 in stock); the independent
reorder threshold stays 10. Missing store inventory stays distinct from zero stock.

## API tokens

Browser navigation and WebSocket handshakes retain session authentication and CSRF.
An authenticated session may `POST /api/tokens` with its CSRF token to obtain a
10-minute HS256 JWT. The bearer-only `/api/client/**` security chain is stateless
and does not accept session cookies for authentication. Available API operations:

- `GET /api/client/me`: current account and current server-assigned authorities.
- `GET /api/client/orders?page=0`: the authenticated customer's orders (`ROLE_USER`).
- `GET /api/client/manager/inventory?page=0`: assigned-store inventory (`ROLE_MANAGER`).
- `GET /api/client/admin/stores?page=0`: store administration data (`ROLE_ADMIN`).
- `DELETE /api/client/token`: revoke the presented token.

Send `Authorization: Bearer <token>` from the API client. The application does not
store JWTs in browser localStorage. Validation pins HS256 and checks signature,
issuer `https://t-winkle.local`, audience `t-winkle-api`, expiry and issuance records.
Roles are reloaded from the database on every authenticated API request. Disabled
accounts and password resets invalidate tokens; revocation is immediate. Issuance
records are bounded and in memory, so process restart or key rotation revokes all
tokens. This lifecycle targets the project's single-instance deployment.

## Backend verification and runtime

With JDK 21 and environment values configured:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd clean package -DskipTests
java -jar target/t-winkle-0.0.1-SNAPSHOT.jar
```

Or run `TWinkleApplication` / `mvnw.cmd spring-boot:run`. Tests require equivalent
SQL Server schema/data. Use an isolated database copy with
`SPRING_DATASOURCE_URL`: some tests commit synthetic fixtures and clean them up, and
one profile test temporarily modifies/restores an account. Do not assume the entire
suite is rollback-only. Protect business data with recovery and fingerprint checks.

`uploads/` is user-owned media: back it up with the database. Dependency caches,
Maven/Playwright output, captures/logs and private recovery files are excluded from
source delivery. [Tool instructions](tools/README.md) distinguish read-only checks
from optional fixture/migration utilities.
Cleanup may remove `target/` after verification; Maven regenerates it. Retain
third-party notices with locally bundled dependencies.

## Source delivery and asset rights

The root `docs/` directory is empty after release cleanup and reserved for local
academic reports. It is ignored; no application build reads it.
Do not generate Markdown reports there or include its contents in source delivery.
Setup, architecture and maintenance instructions belong in the retained READMEs.

The project owner confirms that all 20 SVN-Gilroy OTF files have licenses permitting
use and redistribution with the T-Winkle source project. This records owner-provided
authorization, not independent legal verification. Fonts and typography are preserved.
T-Winkle branding assets are retained as existing project assets; no new blanket
license is assigned. Keep dependency license notices in frontend source and bundles.
