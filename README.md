# Caffeine Cat

A browser game for caring for a cat, earning coins through daily check-ins, and reflecting on caffeine habits. This initial prototype is intended for teens; caffeine consumption itself never earns rewards, and the game does not recommend a daily caffeine target.

## Install on your phone

Open the hosted HTTPS game link in Safari (iPhone) or Chrome (Android).

- iPhone: tap Share, then **Add to Home Screen** (or find Share in the browser menu).
- Android: tap **Install Caffeine Cat** when offered, or use Chrome’s menu → **Install app / Add to Home screen**.
- Stay online for the first load so the offline files can finish downloading. Afterward, launch from the home-screen icon to play offline.
- Progress remains local to that browser/app on that device. Installing on another device does not transfer progress. Export before clearing browser data.

The game must be served over HTTPS for phone installation and offline support. `localhost` works for desktop development, but your phone’s `localhost` does not point at your computer. Opening `index.html` directly does not enable offline installation.

## Develop

Requires Node.js 24 (no third-party dependencies).

```sh
npm start
```

The server listens on port 3000, or `$PORT`. Open it in your local browser when developing locally. Run `npm test` for daily reward, total, calendar, and purchase tests.

## Features

- Name, pet, feed, and play with a cat; no penalties for missed days.
- Earn 20 coins each day for a caffeine check-in, cat care, and an optional reflection.
- Buy room items with earned coins; no real-money purchases.
- Log caffeine in milligrams, explicitly check in with no caffeine, and review seven-day totals.
- Browser-local persistence, JSON export, and deletion.

## Scope

No accounts, analytics, backend database, or cloud synchronization. Data is accessible to other users of the same browser profile and can be lost if browser storage is cleared. Daily rewards follow the device calendar; they are not hardened against clock changes or storage editing. Fonts use system fallbacks; the app works without external services. This prototype provides reflection prompts rather than medical advice. User testing and appropriate privacy review are needed before a public release for teens.
