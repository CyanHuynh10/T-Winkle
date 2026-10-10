# T-Winkle Chat island

React is mounted only by the Thymeleaf Chat template. Spring Boot serves the
production assets from `src/main/resources/static/chat-assets`; Vite is not
required at runtime.

Build with Node (verified with 24.16.0):

```powershell
cd frontend/chat
npm ci
npm run build
node scripts/source-audit.mjs
```

The lockfile pins dependencies. Generated production assets are kept in source
so ordinary Maven packaging does not require Node. Rebuild these assets after
frontend edits. The build removes only its dedicated `chat-assets` output.

Official shadcn registry components were installed using shadcn 4.21.1:

- Message, MessageAvatar, MessageContent, MessageHeader.
- MessageScrollerProvider, MessageScroller, MessageScrollerViewport,
  MessageScrollerContent, MessageScrollerItem, MessageScrollerButton.
- Avatar, AvatarImage, AvatarFallback.
- Bubble, BubbleContent.
- Marker, MarkerContent, MarkerIcon.
- Button (used by the scroller controls).

Sources: [Message](https://ui.shadcn.com/docs/components/base/message),
[Message Scroller](https://ui.shadcn.com/docs/components/base/message-scroller),
[Bubble](https://ui.shadcn.com/docs/components/base/bubble).
The scroller behavior comes from `@shadcn/react/message-scroller`; avatar and
slot primitives come from Radix. These are actual registry source components,
with CSS adapted for this isolated island.

Tailwind preflight is omitted. The build scopes every top-level CSS selector
under `.tw-chat-root`, including theme and utility selectors. The audit checks
the emitted CSS, browser persistence APIs, and accidental Groq browser access.

No AI transcript is stored in browser storage. Session state is loaded from
Spring on mount, reload, and tab focus. Store Chat uses STOMP user queues,
reconnects, fetches durable history, and deduplicates persisted message IDs.

Packaged verification uses the maintained Java chat regression tests,
`node scripts/source-audit.mjs`, and the read-only baseline browser smoke in
`tools/integration/post-correction-baseline-smoke.mjs`. The latter requires
`TWINKLE_VERIFY_PASSWORD` explicitly; no password fallback is provided.
Historical demo-account fixture/restart scripts were retired during final cleanup.
