# T-Winkle — Git history credential remediation and Storefront milestone

Date: 2026-10-05 (Asia/Saigon). This report supersedes the interrupted rotation
check. It records verified pre-publication results; final commit/push/post-fetch
results are recorded in the external publication receipt described in P–R.

## A. Initial security blocker

Reachable history exposed a database password/default in
`src/main/resources/application.properties`. Values are omitted. Removing the
current default alone did not remove the historical exposure.

## B. MAIN-only Git policy

Canonical local branch: **main**. Canonical remote: **origin/main** at
`https://github.com/CyanHuynh10/T-Winkle.git`. No development branch was created.
Only existing local main was aligned. The old `t-winkle-pre-ui-restore` branch
remains local at `a57584f3f9a7fac4c6896d700c735c23f86b4003`, temporarily retained
as a sensitive safety reference, not canonical and not a push target.

No second broad cleanup occurred. No AI/Groq/chat/support feature was started.

## C. Credential rotation verification

**CONFIRMED.** The user manually rotated the SQL Server login and updated local
`.env`. In-memory digest comparison found zero matches between the new local
DB password and historical credential assignments/defaults in 20 commits.
No password value or digest was printed or saved as evidence. `SELECT 1` using
the new local configuration succeeded. `.env` was never modified, staged,
copied into the source snapshot, or included in a patch.

## D. Pre-remediation backup

External safety directory:

`C:/Users/cyanh/.codex/visualizations/2026/10/03/01a1033f-a113-7081-871f-1a567adad772/milestone-work/history-remediation-v2/confirmed-rotation-run`

The approved working-tree snapshot contains 220 source/config/test/doc/asset
files, with file hashes for equivalence checking. It excludes `.env`, `.idea`,
target, uploads, logs, and runtime captures. Existing tracked deletions were
preserved by snapshotting only approved files still present.

`T-Winkle-before-history-remediation.bundle` was created with `--all` and verified
as a complete Git bundle. It contains old history and is marked **SENSITIVE
BACKUP — DO NOT SHARE OR COMMIT**. The isolated bare repository and backup refs
are outside the project and were never proposed for publication.

## E. Main/origin-main divergence audit

After initial fetch:

| Ref | Original hash |
|---|---|
| Current non-main HEAD | `a57584f3f9a7fac4c6896d700c735c23f86b4003` |
| main | `27d04e1db011cd5bd9d843c5af88dda8bcc0cc7c` |
| origin/main | `27d04e1db011cd5bd9d843c5af88dda8bcc0cc7c` |

Main and origin/main had no divergence. Current HEAD was two commits ahead of
main, with no main-only commits. Both snapshot commits were preserved on top
of sanitized main ancestry. The remote advertised only main and no tags.
No unrelated remote work was overwritten or merged.

## F. History rewrite

Used **git-filter-repo 2.47.0**, installed outside the project. The first rewrite
ran only in an isolated fresh mirror. Its supported file-info callback changed
only the database password assignment in the exact historical configuration
path to `${DB_PASSWORD}`. No literal replacement credential was written to a
replacement file or command.

Empty/degenerate pruning was disabled and commit-hash/message rewriting was
disabled. All 20 commits were retained. A commit-by-commit audit verified the
parent topology, original messages, authors/committers/dates, file paths and
all tree entries; the only changed blob path was the database configuration.
No orphan repository, squash, format pass, source renaming or message edit.

Sanitized pre-milestone main tip:
`c9808c8e1e99678ebd56f0c1be64837cdea683b9`.

Tool reference: [official git-filter-repo documentation](https://github.com/newren/git-filter-repo/blob/main/Documentation/git-filter-repo.txt).

## G. Secret-removal verification

Isolated rewritten history and local main each passed a full reachable-history
scan: 20 commits, 1,848 unique text blobs, zero tracked `.env` occurrences and
zero findings. Checks include historical credential values in credential
contexts, literal Spring password/default assignments, configured current DB,
mail/API/bank receiver values, private-key/token/Bearer patterns and literal
JDBC credentials. Unrelated numeric substrings and safe placeholders are not
classified as credentials.

Current main candidate scan also passed with zero configured-secret or literal
password findings; no generated/env/build/backup candidate content.

The original private local branch, Git reflogs, and sensitive external bundle
retain old history intentionally. They are not reachable from sanitized main
and are not pushed. No public tags or unrelated branches require modification.

## H. Approved source restoration

The working tree was preserved in place while sanitized objects were imported.
An ordinary switch safely refused the dirty config; HEAD/index were then
aligned to existing main without checking out or resetting source files.
No removed staging/tooling/capture content was restored.

Root SQL sample deletion is **APPROVED BY USER**, intentionally retained:
`T-Winkle_Database_Sample_C15_Codex_Ready.sql`. It was not restored or regenerated.
No additional source was deleted.

## I. Source equivalence

Byte hashes against the approved snapshot verified unchanged Java, templates,
static assets, SQL migrations, tests, pom and other source. Only the two approved
README normalizations and this final report may differ.

Root README no longer points to the deleted sample. The database README now
identifies current manual migrations and an existing Storefront database as
the runtime prerequisite. It does not claim the remaining scripts recreate
all 26 tables from an empty database. Production semantics were unchanged.

## J. Database read-only verification

No database reset, seed, inventory rebuild, schema/constraint/index modification
or deletion of business data. Read-only checks verified:

- Inventory: 1,422 rows.
- Backup `STORE_INVENTORY_BACKUP_20261004_140514500`: RETAINED INTENTIONALLY.
- Controlled audit order 529, code `TWTESTCL1791108516620`, and its account:
  RETAINED INTENTIONALLY; mail marker remains `2026-10-04T17:09:08.0863847`.
- 38 foreign keys, none disabled/untrusted.
- Payment/order method constraints enabled/trusted, retaining COD/BANKING/VNPAY/MOMO.
- `delivery_mail_sent_at`: nullable datetime2.

Regression alone used controlled temporary synthetic fixtures, then restored
stock/store settings and removed fixture accounts/orders. Original business
rows and cart data were checked for preservation. No real email or transfer.

## K. Maven test

From sanitized main: `mvnw.cmd clean test` **BUILD SUCCESS** — 33 tests,
0 failures, 0 errors, 0 skipped. The sender was synthetic and SMTP local; delivery
mail uses Mockito. OTP, AFTER_COMMIT, duplicate marker and SMTP failure behavior
are covered. The required second test after final staging remains a commit gate
and its actual result is included in the publication receipt.

## L. Maven package

`mvnw.cmd clean package -DskipTests`: **BUILD SUCCESS** after the clean test.
Dependencies/Java/framework versions were not changed.

## M. Runtime regression

Fresh packaged application from main ran on temporary port 5657, PID 15468,
using rotated local DB config, a synthetic bank receiver and localhost SMTP
port 1. No unrelated process was stopped. Runtime audit found 0 ERROR-level
events and none of the listed template/SpEL/null/SQL/integrity/lazy/mail exceptions.

## N. Storefront regression

**91 native Chrome COD/Banking checks PASS**, including COD/BANKING selection,
absence of new VNPAY/MOMO offerings, authoritative VietQR, read-only reload and
refresh, query tampering resistance, buyer/outsider denial, CSRF and manager/admin
confirmation, idempotency and CLOSED-store eligibility. Synthetic fixture cleanup
verified original data and inventory restoration.

**11 route checks PASS**: `/`, `/categories`, `/stores`, `/products/1`, `/wishlist`,
`/cart`, `/checkout`, `/orders`, `/orders/{fixtureId}`, tracking and payments.
Product detail is the approved modal fragment. Empty-cart checkout redirects
normally; populated COD/BANKING checkout was separately exercised in the 91 checks.
No AI/support behavior was added.

## O. Final main staged diff

Staging is permitted only on main after the above gates. The complete staged
source set and diff are compared with the 220-file approved snapshot, allowing
only README/report updates. Previously reviewed cleanup deletions and the newly
approved SQL sample deletion are included. The six large images are existing
approved runtime assets. No env, target, IDE, logs, bundle, rewrite workspace,
JAR/ZIP or temporary capture may enter the index.

Actual staged audit and the second test are recorded externally before commit.

## P. Milestone commit

Required subject: `feat: complete T-Winkle storefront milestone`, on **main**.
The milestone hash is the Git commit containing this report and can be resolved
with `git log -1 --format=%H -- docs/integration-audit/T-Winkle_Git_History_Credential_Remediation_Final.md`.

A report cannot embed the hash of its own containing commit. To preserve the
single milestone commit and a clean working tree, the literal final hash and
publication results are appended to the finalized external copy of this report,
in the safety directory above, after commit/push verification. That receipt does
not modify committed source or require a second documentation commit.

## Q. origin/main update

Publication remains gated on staged audit, post-staging test and another fetch.
The lease must match the exact previously verified remote main hash above.
Only main is updated, using an explicit `--force-with-lease` if required by the
sanitized ancestry. No plain force, mirror, tag or other ref push is allowed.
Actual push outcome is recorded in the final external publication receipt.

## R. Post-push verification

Acceptance requires fresh fetch, local main == origin/main, clean working tree,
and a full secret scan reachable from fetched origin/main. These are not claimed
as performed before publication. Their actual outcomes and commit hash are
recorded in the finalized report supplied after completion.

## S. Remaining notes

Old local branch: **RETAINED TEMPORARILY — NOT CANONICAL**, unpushed. External
bundle/private backup remains sensitive. Future development starts from main;
AI Chat requires a new explicit request.

Current source, rotation, rewrite, history/source scans, build/package and fresh
runtime/regression gates have passed. The final commit/push acceptance is set
only after post-publication verification, never inferred from this pre-commit report.
