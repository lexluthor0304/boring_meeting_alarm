---
title: "How we built a meeting silence detector in 80 lines of Web Audio"
description: "A walkthrough of capturing tab audio with getDisplayMedia, computing RMS levels with AnalyserNode, and firing a multi-channel alert when a meeting goes silent — all in the browser, no backend."
slug: meeting-silence-detector-web-audio
locale: en
datePublished: "2026-05-13"
tags: ["web-audio", "getDisplayMedia", "astro", "cloudflare-workers"]
---

If you've ever sat through a long remote meeting only to realize five minutes after it ended that everyone left, this post is for you. There's no shortage of meeting timer extensions — but a fixed timer doesn't help when the host wraps up early or late. What you actually want is **"alert me when the conversation has been silent for a while."**

[Boring Meeting Alarm](https://alarm.tokugai.com/) is a tiny browser tool that does exactly this:

1. You share the meeting tab with the page.
2. The page listens to the tab's audio and computes a continuous volume reading.
3. When the volume stays below a threshold for the duration you set, it fires a multi-channel alert: a modal, a system notification, a synthesized alarm tone, and a flashing tab title.

The interesting parts are about 80 lines of TypeScript. The whole thing runs entirely client-side and the audio never leaves the browser. This post walks through how it works.

## The building blocks

Two browser APIs do all the work:

- **`navigator.mediaDevices.getDisplayMedia({ audio: true })`** — the screen-share API. Despite the "Display" in the name, it can also capture *audio* from a browser tab, as long as the user ticks the "Share tab audio" checkbox in the picker.
- **The Web Audio API**, specifically `AudioContext` + `AnalyserNode` — gives us real-time access to the audio waveform without ever needing to render or record it.

No external libraries. No backend. No recording.

## Capturing tab audio

```ts
const stream = await navigator.mediaDevices.getDisplayMedia({
  video: { displaySurface: 'browser' },
  audio: true,
  // Non-standard but widely supported in Chromium —
  // makes Chrome's picker default to the "Tab" section.
  selfBrowserSurface: 'exclude',
  systemAudio: 'include',
});
```

A few non-obvious things worth knowing:

**You can't ask for `audio: true` alone.** The spec requires `video` as well, even if we don't care about it. Capture both, then immediately stop the video track to save resources:

```ts
stream.getVideoTracks().forEach((track) => track.stop());
```

**Audio capture is opt-in.** Chrome's picker shows a "Share tab audio" checkbox at the bottom. If the user doesn't tick it, you get a stream with `getAudioTracks().length === 0`. Detect this and prompt them to re-share:

```ts
const audioTracks = stream.getAudioTracks();
if (audioTracks.length === 0) {
  stream.getTracks().forEach((track) => track.stop());
  throw new Error('No audio captured — please tick "Share tab audio" when sharing.');
}
```

**Firefox doesn't support it.** The "Share tab audio" checkbox simply does not appear in Firefox's screen-share dialog. Feature-detect (`navigator.mediaDevices?.getDisplayMedia`) and degrade gracefully.

## RMS → dB

Now we have a `MediaStream`. Wire it into the Web Audio graph and read amplitude on a timer:

```ts
const ctx = new AudioContext();
const source = ctx.createMediaStreamSource(stream);
const analyser = ctx.createAnalyser();
analyser.fftSize = 2048;
source.connect(analyser);
// Note: we do NOT connect analyser → ctx.destination.
// We want to MEASURE the audio, not echo it back to the user's speakers.

const buffer = new Float32Array(analyser.fftSize);

setInterval(() => {
  analyser.getFloatTimeDomainData(buffer);
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    sumSquares += buffer[i] ** 2;
  }
  const rms = Math.sqrt(sumSquares / buffer.length);
  const db = rms > 0 ? 20 * Math.log10(rms) : -100;
  // db is now in roughly [-100, 0]
}, 200);
```

A few notes:

- **Don't connect to the destination.** This is the one easy footgun in the whole project: if you do `analyser.connect(ctx.destination)`, the meeting audio plays back through the user's speakers, on top of the meeting they're already listening to. Just `source → analyser` is enough — `AnalyserNode` taps the stream without needing a downstream node.
- **`getFloatTimeDomainData` over `getByteFrequencyData`.** We want a level meter, not a spectrum analyzer. Time-domain samples in `[-1, 1]` are the most direct route to RMS amplitude.
- **dB is logarithmic.** Doubling the amplitude only adds 6 dB. Human conversation at typical computer volume is somewhere around −30 to −45 dB on this scale. Silence is below −60 dB.
- **200 ms polling.** Fast enough to keep the volume meter responsive, slow enough that we're not pegging the CPU.

## Background tab throttling (and why we don't care)

When the user switches away from our tab, `setInterval` is throttled to a minimum of once per second. That sounds bad for a real-time audio monitor — but for this use case, it isn't:

- We trigger on silence durations measured in seconds (default 30, often longer). 1 Hz polling is plenty.
- The `AudioContext` itself keeps running at audio-thread priority regardless of tab visibility. The samples are still being computed; we're just reading them less often.
- Audio output is not throttled either, so our alarm sound, when it eventually plays, comes through immediately.

In practice: you can run the meeting in one tab, our tool in another tab, switch to a third tab to do other work, and the silence detector still fires.

## Synthesizing an alarm tone

When silence is detected we want to **get the user's attention**. Playing an alarm sound is the lowest-friction option — but we don't want to ship an audio asset (extra request, extra build artifact). The Web Audio API can synthesize one for free:

```ts
class AlarmSound {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private timer: number | null = null;

  start() {
    this.ctx = new AudioContext();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(this.ctx.destination);

    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = 'square';
    this.oscillator.frequency.value = 880;
    this.oscillator.connect(this.gain);
    this.oscillator.start();

    const beep = () => {
      if (!this.ctx || !this.gain) return;
      const t = this.ctx.currentTime;
      const g = this.gain.gain;
      g.cancelScheduledValues(t);
      g.setValueAtTime(0, t);
      g.linearRampToValueAtTime(0.25, t + 0.02);  // attack
      g.setValueAtTime(0.25, t + 0.18);            // sustain
      g.linearRampToValueAtTime(0, t + 0.22);      // release
    };

    beep();
    this.timer = window.setInterval(beep, 600);
  }

  stop() {
    if (this.timer !== null) clearInterval(this.timer);
    try { this.oscillator?.stop(); } catch {}
    this.ctx?.close();
  }
}
```

A `square` oscillator at 880 Hz is bright enough to cut through whatever else the user is doing. The `GainNode` shapes each beep with a tiny ADSR envelope so it doesn't sound like a stuck pulse. Looping the envelope with `setInterval(beep, 600)` produces the classic "beep — beep — beep" pattern.

## Triple alert

Sound alone isn't reliable — the user's speakers may be muted, or they may be focused on a different output device. So we fire three additional channels in parallel:

1. **An in-page modal** — full-screen, covers everything, blocks until dismissed.
2. **A `Notification`** — the browser's native OS-level notification, useful precisely because the user has probably switched tabs. Permission must be requested in a user-gesture context, so we ask for it inside the same click handler that calls `getDisplayMedia`, alongside the screen-share prompt.
3. **A tab title flash** — alternating between the original title and `⚠ Meeting may have ended` on an 800 ms timer. Visible in the browser tab strip even when the page is in the background.

## Privacy posture

Worth pausing on this: at no point does the meeting audio leave the browser.

- There's no backend.
- We never call `MediaRecorder` or any recording API.
- The audio stream goes `source → analyser`, where it's only read as numeric amplitude samples.
- Those samples never escape the page either — they're just used to update a level meter and trigger the alert.

For the user this is a stronger privacy guarantee than a typical meeting tool: there's nothing to lose, because nothing was ever captured.

It also lets us ship as a pure static site (in our case, Cloudflare Workers Static Assets) with zero server-side runtime.

## Try it

- Tool: [alarm.tokugai.com](https://alarm.tokugai.com/) — three locale builds (EN / ZH / JA).
- Source: [github.com/lexluthor0304/boring_meeting_alarm](https://github.com/lexluthor0304/boring_meeting_alarm) — MIT-licensed Astro + TypeScript.
- The interesting parts live in `src/lib/silence-detector.ts`, `src/lib/alarm-sound.ts`, and `src/components/MeetingAlarmApp.astro`.

If you build something with this pattern — a "wake me up when X stops" kind of tool — drop me a line in the [issue tracker](https://github.com/lexluthor0304/boring_meeting_alarm/issues). I'd like to see it.
