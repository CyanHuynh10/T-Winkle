# T-Winkle

T-Winkle is a footwear storefront and store operations application using Java 21,
Spring Boot 4.1.1 and SQL Server. Storefront uses Spring MVC, Thymeleaf and Bootstrap.
Chat, Manager, Admin and Support use React/Vite islands with shadcn components and
`frontend/shared` API, conversation, review, dashboard, report and export code.

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

Install JDK 21, Node/npm for frontend builds, and SQL Server with TCP enabled.
Defaults: application `http://localhost:5656`; database `T_Winkle` at localhost:1433.
Use `.env.example` and `src/main/resources/application.properties` for settings.

Supply `DB_USERNAME`, `DB_PASSWORD`, `MAIL_USERNAME`, `MAIL_APP_PASSWORD`,
`APP_BASE_URL`, `BANK_TRANSFER_*`, and `GROQ_API_KEY` through the process environment.
`AI_PROVIDER`, `GROQ_MODEL` and `GROQ_BASE_URL` select AI configuration; optional
`AVATAR_UPLOAD_DIR` selects avatar storage. Spring Boot does not automatically load
`.env`: configure IntelliJ or export values privately before Maven/Java execution.
Keep `.env` ignored. Never copy credentials into source, documentation or logs.

## Database prerequisites and migration order

Scripts do not reproduce the complete original storefront from an empty database.
Obtain a verified project backup/restore, then inspect the existing schema. See
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

`schema-auth.sql` is auth-only initialization, not the whole storefront baseline.
Demo seed/cleanup and inventory rebuild SQL are optional development tools, not
normal installation steps. Never execute them on an approved live database.
Keep `ddl-auto=none`; startup does not run migrations or seed accounts.

## Frontend builds

Run from the project root, installing Manager before Support:

```powershell
Push-Location frontend/chat
npm ci
npm run build
node scripts/source-audit.mjs
Pop-Location
Push-Location frontend/manager
npm ci
npm run build
Pop-Location
Push-Location frontend/admin
npm ci
npm run build
Pop-Location
Push-Location frontend/support
npm ci
npm run build
Pop-Location
```

Support aliases Manager components/dependencies, so it requires Manager's installed
dependencies. All four builds typecheck and emit scoped CSS/JS to
`src/main/resources/static/<module>-assets/`. Keep all four production bundles in
source delivery: Maven does not invoke npm. Node/Vite is not required at runtime.
After rebuilding all four islands, run `python tools/security/generate_notices.py`
to restore the third-party notices that Vite removes from its output directories,
then package with Maven.

## Backend verification and runtime

With JDK 21 and environment values configured:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd clean package -DskipTests
java -jar target/t-winkle-0.0.1-SNAPSHOT.jar
```

Or run `TWinkleApplication` / `mvnw.cmd spring-boot:run`. Tests require equivalent
SQL Server schema/data. Prefer an isolated database copy with
`SPRING_DATASOURCE_URL`: some tests commit synthetic fixtures and clean them up, and
one profile test temporarily modifies/restores an account. Do not assume the entire
suite is rollback-only. Protect business data with recovery and fingerprint checks.

`uploads/` is user-owned media: back it up with the database. Dependency caches,
Maven/Playwright output, captures/logs and private recovery files are excluded from
source delivery. [Tool instructions](tools/README.md) distinguish read-only checks
from optional fixture/migration utilities.
Cleanup may remove `target/` and each frontend `node_modules/` after verification.
Maven and `npm ci` regenerate them; install Manager dependencies before Support.

## Source delivery and asset rights

The root `docs/` directory is ignored and reserved for local personal reports.
Do not generate Markdown reports there or include its contents in source delivery.
Setup, architecture and maintenance instructions belong in the retained READMEs.

The project owner confirms that all 20 SVN-Gilroy OTF files have licenses permitting
use and redistribution with the T-Winkle source project. This records owner-provided
authorization, not independent legal verification. Fonts and typography are preserved.
T-Winkle branding assets are retained as existing project assets; no new blanket
license is assigned. Keep dependency license notices in frontend source and bundles.
