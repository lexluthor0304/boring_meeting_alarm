---
title: Privacy Policy
locale: en
lastUpdated: "2026-05-13"
---

## TL;DR

Boring Meeting Alarm is a personal project that runs entirely in your browser. Your meeting audio is never recorded or uploaded. We use Google Analytics 4 for traffic measurement and Google AdSense for ads, both gated behind your explicit consent via Google Consent Mode v2.

## What we do NOT collect

**Your meeting audio.** The tool uses the Web Audio API to compute volume levels locally in your browser. The audio stream never leaves your machine. There is no backend, no recording, and no upload. You can verify this by reading the source on [GitHub](https://github.com/lexluthor0304/boring_meeting_alarm) or by inspecting the browser DevTools Network panel — no audio data leaves the page.

## What we DO collect

### Functional data — always, stored in your browser only

- Your tool settings (silence duration, threshold, alarm-sound on/off, notification on/off) — stored in `localStorage` so they persist across sessions
- Your cookie consent decision — also in `localStorage`

This data never leaves your browser.

### Analytics — only after you click "Allow"

Google Analytics 4 collects standard web analytics: page views, anonymized device/browser info, geographic region, and referrer. Until you click "Allow" in the consent banner, Google Consent Mode v2 keeps this in cookieless mode — no `_ga` cookies, no client identifier.

### Advertising — only after you click "Allow"

Google AdSense may serve personalized ads using cookies. Until you click "Allow" in the consent banner, AdSense runs in non-personalized mode.

## Cookies used

| Cookie | Set by | Purpose | When |
|---|---|---|---|
| `bma:settings`, `bma:consent` | This site (`localStorage`) | Remember your settings and consent choice | Always |
| `_ga`, `_ga_*` | Google Analytics | Anonymized site analytics | Only after you click "Allow" |
| AdSense / DoubleClick cookies | Google AdSense | Personalized ads | Only after you click "Allow" |

## Your choices

- **Consent banner:** click "Reject" to keep analytics and personalized-ads cookies disabled.
- **Change your mind:** clear your browser's site data for `alarm.tokugai.com` to re-trigger the banner.
- **Browser controls:** all modern browsers can block third-party cookies in settings.
- **Do Not Track:** we honor the browser's DNT signal where Consent Mode v2 supports it.

## Third parties

| Service | Purpose | Their privacy policy |
|---|---|---|
| Google Analytics 4 | Site analytics | [policies.google.com/privacy](https://policies.google.com/privacy) |
| Google AdSense | Advertising | [policies.google.com/technologies/ads](https://policies.google.com/technologies/ads) |
| GitHub (Star/Fork buttons) | The footer buttons load `buttons.github.io/buttons.js`, which may set cookies via github.com | [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) |

## Children

This site is not directed to children under 13 (or under 16 in jurisdictions where higher age applies). We do not knowingly collect data from children.

## Changes to this policy

We may update this policy occasionally. The "Last updated" date above reflects the most recent change. Material changes will be called out at the top.

## Contact

For questions, corrections, or data-deletion requests — note that no personally identifiable data is stored on any server we control — open an issue at [github.com/lexluthor0304/boring_meeting_alarm/issues](https://github.com/lexluthor0304/boring_meeting_alarm/issues).
