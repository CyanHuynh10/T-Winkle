# Manager review dataset

Apply `migration-chat-support.sql`, then `migration-manager-console.sql` before using these optional scripts. Nothing runs at startup. Use `tools/manager/Invoke-ManagerVerification.ps1 -Mode Seed` and `-Mode Cleanup`; credentials are read privately from the existing local `.env`.

The seed owns only `TWMGRDEMO` identifiers: a dedicated store, 32 disabled accounts (30 customers, one Manager, one Support), one brand/category, 10 products, 50 variants, 299 orders and 598 lines across the current calendar year, 12 requests and 10 conversations. Future months are deliberately synthetic annual-chart review data. Orders already marked delivered have a mail marker; direct SQL never publishes delivery events. No provider/mail calls occur.

Repeat seed is a no-op. Partial/colliding datasets are rejected. Cleanup refuses unrelated orders/conversations referring to demo records and uses FK order; FK constraints also prevent deleting referenced unrelated data. The whole cleanup transaction rolls back on failure.

Accounts have no usable password and start disabled. For a private local review, choose a temporary password, encode it with the application's BCryptPasswordEncoder, and update **only** `TWMGRDEMO-manager@example.invalid` with that hash and `is_enabled=1`. Never put the password/hash in source, SQL or the report. Disable the account or run cleanup when review ends. Existing real account passwords must never be changed for this review.
