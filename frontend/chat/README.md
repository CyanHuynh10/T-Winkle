# Native Chat source audit

Chat uses `templates/chat/page.html` and the shared conversation fragment.
`static/js/console/chat.js` handles AI SSE messages, human chat, read cursors,
reconnects, deduplication and store handoff. Groq remains on the backend.
The licensed standalone STOMP client is packaged under `static/vendor/stomp/`.

This directory retains the development source/secret/CSS audit. Run
`node frontend/chat/scripts/source-audit.mjs` from the root, or `npm run audit`
from this directory. Production packaging uses Maven and ordinary assets.

Retired source recovery archives are stored outside this repository.
