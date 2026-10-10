# T-Winkle Manager Console

Dedicated React/Vite island served at `/manager/**`. Spring Boot serves the committed `src/main/resources/static/manager-assets/manager.js` and `manager.css`; Node/Vite are only build tools.

```powershell
npm ci
npm run typecheck
npm run build
node tests/css-isolation.mjs
```

Official shadcn CLI 4.21.2 generated the Radix Nova components in `src/components/ui`; lockfile pins the actual dependency versions (including Recharts 3). See the [official Sidebar documentation](https://ui.shadcn.com/docs/components/radix/sidebar). Local adaptations scope portals to `#manager-root`, remove backdrop blur, map component state classes to the installed Radix `data-state`/`data-orientation` attributes, and omit the Sidebar's false `data-active` attribute so inactive entries are not highlighted. Keep these adaptations when regenerating components. All compiled selectors are automatically scoped with PostCSS; never import these styles into Storefront.

Browser review uses a fresh packaged Java runtime at port 5657, the isolated SQL demo, and the temporary ignored `target/manager-review/login.json` produced by `tools/manager/Enable-LocalDemoReview.ps1`. Run `npm run test:ui`. Screenshots and results are under ignored `target/manager-review` and never include real account credentials.

Context, profile, inventory, requests, orders and analytics come from `/api/manager`. The server resolves the Manager's store. Support reuses `/api/support` and the existing STOMP broker. Modifications send the Thymeleaf-generated CSRF token. Text is rendered through React's normal escaping.
