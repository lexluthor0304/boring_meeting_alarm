# boring_meeting_alarm

A tiny browser tool that listens to your meeting tab and rings the bell when the silence drags on past a threshold you pick. Deployed at **https://alarm.tokugai.com**.

Everything runs locally in the browser. No audio leaves your machine, no backend, no login.

- English: https://alarm.tokugai.com/
- 中文: https://alarm.tokugai.com/zh/
- 日本語: https://alarm.tokugai.com/ja/

## How it works

1. Click **Start Monitoring**.
2. The browser opens the screen-share picker. Pick the tab where your meeting is running and **tick the "Share tab audio" checkbox**.
3. The page taps into the tab's audio stream via `getDisplayMedia` and runs it through `AnalyserNode` to read RMS / dB level.
4. If the level stays below your threshold for the duration you set, the page shows a modal, flashes the tab title, sends a system notification, and (optionally) plays a synthesized alarm tone.

## Browser support

- **Chrome / Edge / Brave / Arc** on desktop — works.
- **Firefox** — does not support tab audio capture via `getDisplayMedia`, page will show a not-supported notice.
- **Safari** — limited support; not officially supported here.
- HTTPS is required (production is fine; `localhost` is treated as secure for dev).

## Tech stack

- **Astro** (`output: 'static'`) with the built-in i18n routing for `en` / `zh` / `ja`
- TypeScript + Web Audio API + `getDisplayMedia` + Notification API
- Settings persisted in `localStorage`
- Alarm tone synthesized via `OscillatorNode` / `GainNode` (no audio assets shipped)
- **Cloudflare Workers Static Assets** for hosting
- Google Analytics 4 and Google AdSense Auto Ads are opt-in via env vars

## Local development

```bash
npm install
npm run dev
# open http://localhost:4321
```

For `getDisplayMedia` to work in dev, the browser needs a secure context — `localhost` qualifies.

## Configuration

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_GA_ID` | GA4 Measurement ID (e.g. `G-XXXXXXXXXX`). Leave empty to skip the script entirely. |
| `PUBLIC_ADSENSE_CLIENT_ID` | AdSense publisher ID (e.g. `ca-pub-1234567890123456`). Leave empty to skip. |

Both are public values (visible in the HTML), so they're injected at build time via Astro's `PUBLIC_*` env convention.

## Deploy to Cloudflare

```bash
npm run deploy
```

This runs `astro build` and then `wrangler deploy`. The first time, after deploy, bind the custom domain `alarm.tokugai.com` to the Worker in the Cloudflare dashboard (Workers & Pages → your worker → Settings → Domains & Routes → Add Custom Domain). DNS auto-resolves if the apex is already on Cloudflare.

## Analytics events

When `PUBLIC_GA_ID` is set, the following GA4 events are emitted:

| Event | Trigger | Notable params |
| --- | --- | --- |
| `start_monitoring` | User starts monitoring, audio track acquired | duration, threshold, alarm/notif toggles |
| `stop_monitoring` | User clicks Stop | `reason=user_clicked` |
| `screen_share_track_ended` | User stops sharing from browser UI | `was_monitoring_for_sec` |
| `screen_share_cancelled` | `getDisplayMedia` rejected (NotAllowedError) | — |
| `no_audio_track` | User didn't check "Share tab audio" | — |
| `silence_detected` | Silence judgement fires | `silence_duration_sec` |
| `silence_alert_dismissed` | User closes the modal | `seconds_to_dismiss` |
