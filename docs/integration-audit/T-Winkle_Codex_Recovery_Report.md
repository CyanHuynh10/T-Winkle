# T-Winkle Codex Recovery Report

**T-WINKLE CODEX STOREFRONT RECOVERY — PASS**

Verified 2026-10-04 (Asia/Saigon) against the packaged Java 21 application, Chrome, and development SQL Server `T_Winkle`. Port remains **5656**, Hibernate `ddl-auto=none`, Spring Boot 4.1.1 and Security 7.1.1. The existing MVC/Thymeleaf architecture, shared security context repository, and approved glass storefront were preserved. No commit, deployment, database reset, or whole historical frontend restoration was performed.

## A. Initial root causes

Required pre-edit status, 30-entry Git log, full diff, and diff statistics were inspected. Starting branch: `t-winkle-pre-ui-restore`, HEAD `a57584f`. Twelve tracked files already had changes and many troubleshooting files were untracked; unrelated user work was retained.

- Malformed Thymeleaf conditionals/escaped quote literals broke root and modal rendering. Address markup used nonexistent `detail`/`province` properties.
- Product detail had prototype variants/stores/reviews; cart shortcuts guessed selections. Shared layout omitted cart/wishlist handlers.
- Profile displayed placeholder identity fields and query-string/inline success feedback, and lacked avatar persistence. The local service already had a transactional update method. A pre-edit failed SQL update was not reproduced; final persistence was established through actual request/commit/session/display checks rather than asserting an unproven original transaction defect.
- Store queries excluded CLOSED stores. Search/count were static. An extra closing element placed the existing modal outside extracted page content.
- Historical loader markup coexisted with orphan legacy styles; the track collapsed under the current layout.
- Cart/order lazy associations and a nonexistent cart image property caused rendering failures. Delivered-order strings were double encoded; extreme cart quantities could overflow integer addition.

The following component matrix was established before integration:

| Existing modal component | Authoritative source | Final binding |
| --- | --- | --- |
| Identity/name/description/category/brand | PRODUCTS/CATEGORIES/BRANDS | Canonical ProductDetailDTO.id |
| Image | PRODUCT_IMAGES | Primary first, then sort_order and ID |
| Price/promotion | PricingService/PROMOTIONS | Effective price plus actual variant adjustment |
| Size/color | ACTIVE PRODUCT_VARIANTS | Exact valid variant matrix |
| Store availability | STORE_INVENTORY/OPEN STORES | Per-variant quantity, including zero stock |
| Quantity/cart | CartService/CARTS/CART_ITEMS | Selected variant/store/quantity |
| Rating/sold | APPROVED REVIEWS/delivered ORDER_ITEMS | Repository aggregates |
| Comments/name/date/distribution | REVIEWS joined USERS | Ordered review DTO projection |
| Heart | WISHLIST_ITEMS(email, Integer product_id) | Shared persisted toggle |

## B. Files modified

Paths are relative to the project root. The final working-tree diff also includes pre-existing changes; not every differing line originated in this pass.

- `.gitignore`, `T-Winkle_Database_Sample_C15_Codex_Ready.sql`, `src/main/resources/application.properties`, `src/main/resources/db/schema-auth.sql`.
- Under `src/main/java/cyan/project/twinkle/`: `component/GlobalModelAttributes.java`; controllers `StorefrontCartController.java`, `StorefrontMainController.java`, `StorefrontStoreController.java`, `StorefrontUserController.java`; DTOs `ProductDetailDTO.java`, `ProfileUpdateForm.java`; `entity/User.java`; `security/CustomUserDetails.java`.
- Repositories under that Java root: `CartItemRepository.java`, `CategoryRepository.java`, `OrderItemRepository.java`, `OrderRepository.java`, `ProductRepository.java`, `ReviewRepository.java`, `StoreInventoryRepository.java`, `StoreRepository.java`.
- Services: `CartService.java`, `StorefrontProductService.java`, `StorefrontStoreService.java`, `StorefrontUserService.java`.
- Assets under `src/main/resources/static/`: `css/main.css`, `js/cart-handler.js`, `js/wishlist-handler.js`, `js/main.js`.
- Templates under `src/main/resources/templates/`: `index.html`, `fragments/layout.html`, `fragments/navbar.html`, `storefront/category/list.html`, `storefront/cart/cart.html`, `storefront/order/history.html`, `storefront/store/list.html`, `storefront/store/detail.html`, `storefront/store/categories.html`, `storefront/user/profile.html`, `storefront/user/addresses.html`, `storefront/user/wishlist.html`.

Temporary untracked `PrintStores.java` was removed; no startup store dump remains. Existing unrelated `refactor_index2.py`, `RollbackTest.java`, and root troubleshooting scripts were retained.

## C. Files added

- Java: `service/AvatarStorageService.java`, `config/UploadWebConfig.java`, `controller/UploadExceptionAdvice.java` under the Java root above.
- `src/main/resources/db/migration-avatar.sql`.
- `src/test/java/cyan/project/twinkle/StorefrontRecoveryTests.java` (six recovery tests).
- This report, repeatable `query-dev-db.ps1`, `verify-public.mjs`, `verify-browser.mjs`, `verify-contracts.mjs`, `verify-loader-source.py`, and linked logs/JSON/screenshots in this audit directory.

## D. SQL/schema changes

Actual USERS schema was inspected first: no avatar field existed. The only schema extension is nullable **dbo.USERS.avatar_url NVARCHAR(500)**. The [idempotent migration](../../src/main/resources/db/migration-avatar.sql) checks COL_LENGTH and was applied to the development database. Canonical sample/auth SQL were updated. Email remains VARCHAR(100) and the primary key. No other columns/keys/statuses or database connection settings changed.

## E. `/` recovery

Valid Thymeleaf expressions preserve backend heart state. Root and all requested category routes render full HTTP 200 pages without template/SpEL errors. [HTTP evidence](public-runtime.json), [fresh log](runtime.log).

## F. Product Card Cart

Independent captured cart action opens the existing approved selection modal. Users select exact size/color/store/quantity; no guessed variant/store. CSRF-protected form submits Long variantId, Integer storeId, and quantity to existing CartService. ACTIVE product/variant, OPEN store, inventory and cart locking remain enforced. Long arithmetic prevents quantity overflow. Real cart additions for products 1 and 2 were inspected in SQL and restored. [Browser evidence](browser-runtime.json).

## G. Product Card Wishlist

Cards and modal share `/wishlist/toggle`, with CSRF-protected AJAX JSON and existing HTML fallback. Visual state follows backend response; reload reads SQL truth. Card product 3 toggle persisted and survived reload. Guests redirect to login. No active localStorage business persistence remains. [Browser evidence](browser-runtime.json).

## H. Product Detail full DB binding

Home/category/wishlist/store pages use the existing canonical detail fragment. Detail identity remains `id`. Images are explicitly sorted primary/sort_order/ID before rendering. PricingService promotions, exact ACTIVE variant matrix, variant adjustment, OPEN inventory including zero stock, quantity guards, approved review distribution/comments/authors/dates, delivered sold counts, hearts and selected cart submission all use backend data. Review eligibility links to the existing order review flow. Review projection avoids per-review user loading; no review schema was invented.

Products 1/2/3 were compared with SQL. Product 1: effective 2,636,100 after 10% promotion, 60 inventory rows/3 zero; product 2: 3,167,100 after 10%, 32 rows/1 zero; product 3: 2,929,000, 80 rows/4 zero, one approved five-star review and one delivered sale. [SQL/HTML contract](database-contract-runtime.json), [detail](product-detail.png), [reviews](product-reviews.png), [tests](recovery-test-results.txt).

## I. Global Loading historical restoration

Only loader HTML/CSS/early intent, state/completion/pageshow, and internal-link blocks were extracted from `df138cc1e46f9a59f8837aea995796ad9d018513`. All three match historical source byte-for-byte by [SHA-256 comparison](historical-loader-source.json). Current CSRF/toasts/backend code remain. Orphan legacy markup was removed; external `flex-shrink: 0` compatibility CSS prevents track collapse without changing historical blocks.

Chrome verified logo/brand/card/background, animated cyan bar and 6px track on all three requested transitions. The category page lacks an original stores link; that transition used an ordinary anchor inserted in the browser only, explicitly recorded in evidence. [Screenshot](global-loading.png), [browser results](browser-runtime.json).

## J. Profile persistence

Form binds username/fullName/phone and optional avatar; email is immutable. Validation/username uniqueness precede transaction save/flush. After commit, the controller reloads the user and refreshes the existing shared security context before success flash and `/profile` redirect.

Actual SQL before: `cyan / Cyan / 0901000011 / avatar NULL`. After browser POST: `codex_browser_verify / Codex Browser Verification / 0909876543 / generated avatar URL`. UI/header reflected committed changes without logout. Duplicate `minh` failed with unchanged SQL. Original account values were restored. [Before/after evidence](browser-runtime.json).

## K. Profile floating notification

Inline green alert and `?success` were removed. Existing shared floating success/error notifications use flash attributes and clean `/profile` URL. Success follows commit. [Success](profile-success.png), [failure](profile-failure.png).

## L. Avatar implementation

Actual PNG/JPEG content is decoded/reencoded, limited to 5MiB and 4096×4096. UUID names avoid trusting client paths/names. Configurable `AVATAR_UPLOAD_DIR` defaults to `uploads/avatars`; Spring serves `/uploads/avatars/**`. Only the URL is stored; rollback deletes a newly written file. Refreshed principal updates navbar/profile. Uploaded media is Git-ignored.

Real multipart upload/SQL/resource/header checks, fake image rejection, and oversized upload rejection passed. Oversized input redirects with shared error flash and unchanged SQL. Test-created file was removed after account restoration. [Browser evidence](browser-runtime.json), [oversized request](database-contract-runtime.json), [tests](recovery-test-results.txt).

## M. Address recovery

Display/edit use canonical addressLine/city, without fake properties. Browser Add/Edit/Set Default/Delete each committed to SQL and reloaded correctly. Temporary address was removed and original default restored. [Evidence](browser-runtime.json).

## N. Cart empty state

Cart empty panel matches Orders/Wishlist glass language/icon/title/description/category action. Populated layout is retained with batch primary images and explicit association loading. Existing empty development account verified all three empty states. [Cart](cartEmptyState.png), [wishlist](wishlistEmptyState.png), [orders](orderEmptyState.png), [populated cart](cart-populated.png).

## O. Store listing all statuses

All six SQL stores are listed; q3/q7 remain CLOSED, others OPEN. Browsing eligibility is separate from purchase validation. [Evidence](browser-runtime.json).

## P. Store total count

Repository count() supplies the all-store total independently of search, verified six. No hardcoded count. [Evidence](browser-runtime.json).

## Q. Store Detail restoration

Existing approved modal is within the rendered fragment and uses actual store name/address/status/slug/image and supported entity fields. OPEN q1/CLOSED q3 open correctly, CLOSED status stays visible, catalogs remain accessible. Standalone detail also uses DB values. No fake map/chat backend. [OPEN](store-q1.png), [CLOSED](store-q3.png).

## R. Store Search

GET `/stores?keyword=...` performs bound repository name/address search over all statuses. Empty query shows all; Quận 1, Quận 3, Thủ Đức and nonexistent term behave correctly. Bound LIKE preserves Vietnamese text; total remains global. [HTTP](public-runtime.json), [browser](browser-runtime.json).

## S. Store Catalog all slugs

Intentional `/stores/{slug}/catagories` spelling remains. All six use store inventory/product/variant/category relationships with ACTIVE products/variants, distinct categories, category filtering, sorting and pagination. SQL comparison verified 45 related products per current store, 12 on first page and actual categories sandals/sneaker/sports. CLOSED catalogs render but store-specific cart buttons and backend purchase are blocked. [Six-store contract](database-contract-runtime.json), [purchase rejection](browser-runtime.json).

The pre-existing catalog search/advanced-filter prototypes have no supported query contract and remain disabled; this pass implements the explicitly requested `/stores` search and store category/sort browsing.

## T. Maven test

Java 21 `mvnw.cmd clean test`: **BUILD SUCCESS**, **9 tests**, **0 failures/errors/skipped**. Six new tests cover rendering, Unicode store search, committed profile/avatar/session and invalid updates, CSRF wishlist persistence, address CRUD/default, product aggregates and cart stock/closed/overflow guards. [Full log](maven-test.log), [recovery summary](recovery-test-results.txt).

## U. Maven package

Java 21 `mvnw.cmd clean package -DskipTests`: **BUILD SUCCESS**. Final verification used the generated JAR, started with Java 21; it remains at localhost:5656, PID 4264 at completion. [Package log](maven-package.log), [runtime](runtime.log).

## V. Runtime errors remaining

Fresh packaged log has **zero matches** for all requested error/exception patterns. Chrome recorded **zero JavaScript exceptions**. Existing dialect/authentication-provider startup warnings do not block tested flows. Negative business/upload cases yield handled notifications. Earlier development logs are preserved separately and are not final packaged evidence. [Fresh audit](fresh-log-audit.json).

Final status/stat/full diff were reviewed, including historical extraction. No whole commit restoration, preview security, `/ui-preview`, mock business data or active localStorage cart/wishlist returned. Existing Integer/Long identities, email PK, active-cart locking, PricingService, PENDING payment, tracking ASC, pending cancellation and review uniqueness remain. Payment/cancellation were preserved by source review, not claimed as newly exercised full workflows.

Verification restored account `cyan / Cyan / 0901000011 / avatar NULL`, wishlist 4 rows, cart 3 rows, original addresses 1/2 with address 1 default. [Final SQL state](final-db-state.json), [diff statistics](final-diff-stat.txt).

## Final verification matrix

Each row below corresponds to actual HTTP/browser/SQL/source/build evidence, including before/after values for state changes.

| Verification | Result | Evidence |
| --- | --- | --- |
| GET / | PASS | [public-runtime.json](public-runtime.json) |
| GET /categories | PASS | [public-runtime.json](public-runtime.json) |
| GET /categories/sneaker | PASS | [public-runtime.json](public-runtime.json) |
| GET /categories/sandals | PASS | [public-runtime.json](public-runtime.json) |
| GET /categories/sports | PASS | [public-runtime.json](public-runtime.json) |
| GET /products/1 | PASS | [public-runtime.json](public-runtime.json) |
| GET /products/2 | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores/q1/catagories | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores/q3/catagories | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores/q5/catagories | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores/q7/catagories | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores/thu-duc/catagories | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores/binh-thanh/catagories | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores?keyword=Qu%E1%BA%ADn%201 | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores?keyword=Qu%E1%BA%ADn%203 | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores?keyword=Th%E1%BB%A7%20%C4%90%E1%BB%A9c | PASS | [public-runtime.json](public-runtime.json) |
| GET /stores?keyword=nonexistent-codex-term | PASS | [public-runtime.json](public-runtime.json) |
| Store total/listing | PASS | [browser-runtime.json](browser-runtime.json) |
| OPEN Store Detail | PASS | [browser-runtime.json](browser-runtime.json) |
| CLOSED Store Detail | PASS | [browser-runtime.json](browser-runtime.json) |
| Store Search Quận 1 | PASS | [browser-runtime.json](browser-runtime.json) |
| Store Search Quận 3 | PASS | [browser-runtime.json](browser-runtime.json) |
| Store Search Thủ Đức | PASS | [browser-runtime.json](browser-runtime.json) |
| Store Search codex-no-store-match | PASS | [browser-runtime.json](browser-runtime.json) |
| Global Loading historical bar | PASS | [browser-runtime.json](browser-runtime.json) |
| Product Card → Detail (guest) | PASS | [browser-runtime.json](browser-runtime.json) |
| Guest Wishlist redirects login | PASS | [browser-runtime.json](browser-runtime.json) |
| Development-account login | PASS | [browser-runtime.json](browser-runtime.json) |
| Authenticated GET /profile | PASS | [browser-runtime.json](browser-runtime.json) |
| Authenticated GET /addresses | PASS | [browser-runtime.json](browser-runtime.json) |
| Authenticated GET /cart | PASS | [browser-runtime.json](browser-runtime.json) |
| Authenticated GET /wishlist | PASS | [browser-runtime.json](browser-runtime.json) |
| Authenticated GET /orders | PASS | [browser-runtime.json](browser-runtime.json) |
| Product Card → Cart selection | PASS | [browser-runtime.json](browser-runtime.json) |
| Modal valid variant/store selection | PASS | [browser-runtime.json](browser-runtime.json) |
| Modal rejects excessive quantity | PASS | [browser-runtime.json](browser-runtime.json) |
| Modal → Wishlist | PASS | [browser-runtime.json](browser-runtime.json) |
| Product Detail database binding 1 | PASS | [browser-runtime.json](browser-runtime.json) |
| Product 1 Modal Wishlist commit | PASS | [browser-runtime.json](browser-runtime.json) |
| Product 1 Modal Cart database commit | PASS | [browser-runtime.json](browser-runtime.json) |
| Product Detail database binding 3 | PASS | [browser-runtime.json](browser-runtime.json) |
| Product 3 Modal Wishlist commit | PASS | [browser-runtime.json](browser-runtime.json) |
| Product Detail database binding 2 | PASS | [browser-runtime.json](browser-runtime.json) |
| Product 2 Modal Wishlist commit | PASS | [browser-runtime.json](browser-runtime.json) |
| Modal → Cart database commit | PASS | [browser-runtime.json](browser-runtime.json) |
| CLOSED store purchase blocked | PASS | [browser-runtime.json](browser-runtime.json) |
| Product Card → Wishlist database/reload | PASS | [browser-runtime.json](browser-runtime.json) |
| Profile DB update / session / clean URL | PASS | [browser-runtime.json](browser-runtime.json) |
| Profile avatar DB/header/profile | PASS | [browser-runtime.json](browser-runtime.json) |
| Profile success floating toast | PASS | [browser-runtime.json](browser-runtime.json) |
| Profile failure floating toast / DB unchanged | PASS | [browser-runtime.json](browser-runtime.json) |
| Address Add database commit | PASS | [browser-runtime.json](browser-runtime.json) |
| Address Edit canonical binding/commit | PASS | [browser-runtime.json](browser-runtime.json) |
| Address Set Default database commit | PASS | [browser-runtime.json](browser-runtime.json) |
| Address Delete/reload database commit | PASS | [browser-runtime.json](browser-runtime.json) |
| Global Loading / → /categories | PASS | [browser-runtime.json](browser-runtime.json) |
| Global Loading /categories → /stores | PASS | [browser-runtime.json](browser-runtime.json) |
| Global Loading /stores → /profile | PASS | [browser-runtime.json](browser-runtime.json) |
| /cart empty state | PASS | [browser-runtime.json](browser-runtime.json) |
| /wishlist empty state | PASS | [browser-runtime.json](browser-runtime.json) |
| /orders empty state | PASS | [browser-runtime.json](browser-runtime.json) |
| Browser JavaScript exceptions | PASS | [browser-runtime.json](browser-runtime.json) |
| Store Catalog inventory/category contract q1 | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Store Catalog inventory/category contract q3 | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Store Catalog inventory/category contract q5 | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Store Catalog inventory/category contract q7 | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Store Catalog inventory/category contract thu-duc | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Store Catalog inventory/category contract binh-thanh | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Product 1 price/promotion/image/inventory/rating/sold | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Product 2 price/promotion/image/inventory/rating/sold | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Product 3 price/promotion/image/inventory/rating/sold | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Authenticated HTTP login | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Authenticated HTTP GET /profile | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Authenticated HTTP GET /addresses | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Authenticated HTTP GET /cart | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Authenticated HTTP GET /wishlist | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Authenticated HTTP GET /orders | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Oversized avatar server rejection / flash / unchanged DB | PASS | [database-contract-runtime.json](database-contract-runtime.json) |
| Loader HTML/CSS/early intent script | PASS | [historical-loader-source.json](historical-loader-source.json) |
| Loader state/completion/pageshow | PASS | [historical-loader-source.json](historical-loader-source.json) |
| Internal-link transition handler | PASS | [historical-loader-source.json](historical-loader-source.json) |
| Maven clean test: 9 tests, 0 failures/errors | PASS | [test log](maven-test.log) |
| Maven clean package -DskipTests | PASS | [package log](maven-package.log) |
| Fresh packaged exception scan | PASS | [log audit](fresh-log-audit.json) |
| Development account restored | PASS | [SQL state](final-db-state.json) |
