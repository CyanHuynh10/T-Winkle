# T-Winkle Admin Console

React/Vite/Tailwind operational island, served by Spring MVC at `/admin` and its deep links.
Use `npm ci` and `npm run build`; output is packaged from `src/main/resources/static/admin-assets`.
No Vite process is required by the packaged application.

UI primitives follow the existing Manager Radix/shadcn implementation and the official
[Sidebar composition](https://ui.shadcn.com/docs/components/sidebar).
The build scopes selectors to `.tw-admin-root`; Radix portals remain inside `admin-root`.

Run `migration-admin-console.sql` manually after the Chat and Manager migrations before starting
the new backend. Schema auto-generation remains disabled. Account passwords are established
through the existing forgot-password OTP workflow; the console never returns password hashes.

Verification: Java rollback tests under `src/test/java/cyan/project/twinkle/admin`, and the
controlled packaged-browser lifecycle under `tools/admin`. Always remove smoke fixtures with
`tools/admin/smoke-cleanup.sql`, compare the original fingerprints, and check integrity.
