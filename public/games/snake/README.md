# Little Sunshine — Portfolio edition

Adapted from Nathan Shan's existing Little Sunshine Snake game (source revision
`bc2c4b7`). The original project is unchanged. This is a playable break, not a
portfolio project card.

The `/play` route loads this static game in a same-origin iframe to isolate its
Canvas styles and keyboard controls. Leaving the route destroys the iframe and
its animation loop. No game assets are loaded by the portfolio homepage.

Integration changes:

- Responsive host-sized board, touch direction buttons and a visible pause button.
- Pause when the game loses focus; keep normal Space activation for buttons.
- Preserve the original pet sprite, audio, rules and local high-score storage.
- Freeze decorative time-based effects when reduced motion is requested.
- Do not register the original service worker or publish its PWA manifest here.
  The original worker deletes unrelated cache names, so it must not be copied
  unmodified into a shared website origin. The standalone source retains its PWA.

Browser check: `node scripts/check-snake-browser.mjs` from the portfolio root,
with `PLAYWRIGHT_MODULE` pointing to an existing Playwright installation when
needed. `PORTFOLIO_URL` defaults to `http://127.0.0.1:4174/`.
