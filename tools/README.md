# Verification and optional maintenance tools

Maven production build and optional browser-tool entry points are documented in the root README. Tools never run
automatically on application startup. Inspect modes and SQL before executing.

| Area | Purpose | Constraint |
|---|---|---|
| `chat/Invoke-ChatVerification.ps1` | Test/package/run wrapper | Migrate mode writes schema; not a cleanup verification step |
| `manager/Invoke-ManagerVerification.ps1` | Manager build/runtime/schema/demo wrapper | Seed/Cleanup/Migrate require operator review and isolation |
| `manager/cleanup-fingerprints.sql`, `integration/account-integrity.sql` | Ordered full-table SHA-256 and constraint checks | Read business data; temporary connection-local SQL tables |
| Other retained schema/final/forensic audit SQL | Repeatable maintenance diagnostics | Historical count assumptions may need review |
| `integration/CheckBaselineCredential.java` | Read-only supplied-credential verification | Requires `TWINKLE_VERIFY_PASSWORD`; prints no password/hash |
| `integration/post-correction-baseline-smoke.mjs` | Read-only browser route/layout check | Requires `TWINKLE_VERIFY_PASSWORD`; port 5657; account credentials may differ |
| `integration/audit-source.mjs`, `document-audit.mjs` | Source/route inventory | Console output only; no report files created |
| `security/scan_deliverables.py` | Full candidate credential scan | Explicit default-policy/synthetic exceptions; no secret output |
| Admin/final-features browser fixtures | Reusable console regression | Data mutations: use isolated copies and inspect cleanup first |
| Manager demo review/lifecycle tools | Optional maintained Playwright fixture support | Private login input and reviewed seed/cleanup required |
| `network/` | Optional LAN firewall configuration | Changes host networking; not invoked by cleanup |
| `migration/verify.py` | Verified backup, isolated test copy, Maven checks, live read-only fingerprints | Never resets the live database; `reset-clone` targets only its owned test copy |
| `migration/browser.py`, `migration/browser.py flows` | Current native five-role and transaction acceptance suites | Disposable fixtures on the owned copy; external AI disabled; flows require explicit `TWINKLE_TEST_DEFAULT_PASSWORD` |
| `migration/live_ai.py` | One separately approved live AI acceptance attempt | Sends shopping context to Groq; requires explicit approval and records a one-attempt guard |

Historical frontend-build/seed wrappers below the other tool directories predate
the native frontend. Their npm-build steps are retired; they are not application
build prerequisites. Retained fixture-specific browser sources remain available
for maintenance; use the current native suites for stack migration acceptance.

Completed account normalization and exact historical cleanup scripts were retired.
They are not required by Maven/npm builds, startup or maintained regression tests.
The root `docs/` directory is reserved for ignored local personal reports.
Cleanup smoke fixture credentials use ignored `runtime-private/cleanup-smoke-private.json`.
Reusable login tools require explicit environment or ignored private credential input.
The approved application's default-password policy remains unchanged.
Synthetic Admin-created-account browser checks also require
`TWINKLE_TEST_DEFAULT_PASSWORD` explicitly. No tool supplies a login fallback.

Release checks: `tools/release/verify.py baseline|tests|package|integrity` records
live read-only fingerprints and runs Maven against the established isolated copy.
Set JAVA_HOME to JDK 21 first. `prepare_test.py` repairs baseline assignments only
in that isolated copy after browser tests; never point fixtures at the live DB.
`check_bootstrap.py` creates an empty temporary schema-test DB, seeds public demo
data, verifies counts/constraints/repeat refusal, then removes its own test DB.
`export_schema.py` reads metadata only. `seed_demo.py OUTPUT.sql` generates the
fresh empty-database demo seed. These tools read private `.env` settings locally;
never commit that file or verification output. Install sqlcmd for SQL tooling.
`scan_history.py` scans all reachable Git objects without printing matching values.
`migration/browser.py console` runs the full console alignment/responsive suite.
Browser suites require optional `npm ci --prefix frontend/admin` and installed
Microsoft Edge. They bind only localhost and use the established isolated copy.

`migration/browser.py inventory` checks the split stock columns with real sorting,
reorder filtering, independent column visibility and inventory XLSX preparation.
The live AI check uses its own synthetic user and localhost port 5659 so that it
does not change the browser acceptance account's credentials.
