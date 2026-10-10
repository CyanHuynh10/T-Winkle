# Verification and optional maintenance tools

Maven/npm build entry points are documented in the root README. Tools never run
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
| `security/generate_notices.py` | Regenerate source/static dependency notices after frontend builds | Run before Maven packaging; includes vendored dependency notices |
| Admin/final-features browser fixtures | Reusable console regression | Data mutations: use isolated copies and inspect cleanup first |
| Manager demo review/lifecycle tools | Optional maintained Playwright fixture support | Private login input and reviewed seed/cleanup required |
| `network/` | Optional LAN firewall configuration | Changes host networking; not invoked by cleanup |

Completed account normalization and exact historical cleanup scripts were retired.
They are not required by Maven/npm builds, startup or maintained regression tests.
The root `docs/` directory is reserved for ignored local personal reports.
Cleanup smoke fixture credentials use ignored `runtime-private/cleanup-smoke-private.json`.
Reusable login tools require explicit environment or ignored private credential input.
The approved application's default-password policy remains unchanged.
Synthetic Admin-created-account browser checks also require
`TWINKLE_TEST_DEFAULT_PASSWORD` explicitly. No tool supplies a login fallback.
