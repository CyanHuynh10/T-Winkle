# T-Winkle Support console

`npm ci` then `npm run build` produces `src/main/resources/static/support-assets/support.js` and `support.css`. Build the Manager workspace dependencies as well: this island reuses the existing operational UI primitives from `frontend/manager/src` through its `@` alias. No Vite server is needed in production.

The flat sidebar contains only Hội thoại and Đánh giá. `/support` is the login destination. Store authority is checked on the backend against active staff assignments; the live Support account intentionally has none. Styles and portals stay inside `.tw-support-root`.

Conversations and Reviews share their React implementation with Manager/Admin in `frontend/shared`. `DashboardDate`, `ExportButton`, and `Reports` contain the remaining shared final-feature UI. Production artifacts must be rebuilt whenever those sources change.
