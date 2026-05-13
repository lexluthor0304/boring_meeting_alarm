---
title: "用 80 行 Web Audio API 写一个会议静音提醒工具"
description: "拆解如何用 getDisplayMedia 捕获标签页音频、AnalyserNode 计算 RMS 电平，并在会议陷入沉默时触发多通道提醒——全部在浏览器里完成，没有后端。"
slug: meeting-silence-detector-web-audio
locale: zh
datePublished: "2026-05-13"
tags: ["web-audio", "getDisplayMedia", "astro", "cloudflare-workers"]
---

如果你曾经熬完一场漫长的远程会议、结果会议结束 5 分钟后才发现大家早就散了——这篇文章就是为你写的。市面上不缺会议倒计时插件，但固定时长的计时器并不能解决主持人提前或延后散会的情况。你真正想要的是：**"当对话陷入沉默一段时间后提醒我。"**

[会议静音提醒](https://alarm.tokugai.com/zh/) 就是干这件事的小工具：

1. 你把会议标签页共享给页面；
2. 页面监听这个标签页的音频并持续读取音量；
3. 当音量低于阈值且持续达到你设定的时长时，触发四个通道的提醒：页面 modal、系统通知、合成警报音、标签页标题闪烁。

核心实现大约 80 行 TypeScript，全部在客户端运行，会议音频从不离开浏览器。本文走一遍它的实现思路。

## 用到的两个 Web API

只需要两个浏览器 API：

- **`navigator.mediaDevices.getDisplayMedia({ audio: true })`** —— 屏幕共享 API。虽然名字里有 "Display"，它其实可以捕获**浏览器标签页的音频**，前提是用户在弹出的选择框里勾选了"共享标签页音频"。
- **Web Audio API**，具体是 `AudioContext` + `AnalyserNode` —— 让我们实时读取音频波形，而不需要渲染或录制它。

不需要任何第三方库，没有后端，没有录音。

## 捕获标签页音频

```ts
const stream = await navigator.mediaDevices.getDisplayMedia({
  video: { displaySurface: 'browser' },
  audio: true,
  // 非标准但 Chromium 系都支持——
  // 让 Chrome 的选择器默认停在「标签页」分类。
  selfBrowserSurface: 'exclude',
  systemAudio: 'include',
});
```

几个不那么显然的细节：

**不能只要 `audio: true`。** 规范要求必须同时声明 `video`，即使我们不需要视频。两个都取下来，然后立刻停掉视频轨道节省资源：

```ts
stream.getVideoTracks().forEach((track) => track.stop());
```

**音频捕获是 opt-in 的。** Chrome 的选择框底部有一个"共享标签页音频"复选框。用户不勾，你拿到的 stream 就会有 `getAudioTracks().length === 0`。代码里要检测并提示重新共享：

```ts
const audioTracks = stream.getAudioTracks();
if (audioTracks.length === 0) {
  stream.getTracks().forEach((track) => track.stop());
  throw new Error('没有捕获到音频——共享时请勾选"共享标签页音频"。');
}
```

**Firefox 不支持。** Firefox 的屏幕共享对话框里根本没有"共享标签页音频"这个选项。需要做特性检测（`navigator.mediaDevices?.getDisplayMedia`）并优雅降级。

## RMS → dB

拿到 `MediaStream` 之后，接进 Web Audio 图，用定时器读振幅：

```ts
const ctx = new AudioContext();
const source = ctx.createMediaStreamSource(stream);
const analyser = ctx.createAnalyser();
analyser.fftSize = 2048;
source.connect(analyser);
// 注意：我们 *不* 把 analyser 连到 ctx.destination。
// 我们只想 *测量* 音频，不想把它回放到用户的扬声器里。

const buffer = new Float32Array(analyser.fftSize);

setInterval(() => {
  analyser.getFloatTimeDomainData(buffer);
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    sumSquares += buffer[i] ** 2;
  }
  const rms = Math.sqrt(sumSquares / buffer.length);
  const db = rms > 0 ? 20 * Math.log10(rms) : -100;
  // db 的范围大致是 [-100, 0]
}, 200);
```

几个要点：

- **不要连到 destination。** 这是整个项目里最容易踩的坑：如果你 `analyser.connect(ctx.destination)`，会议音频会被回放到用户的扬声器里，叠在他们已经听到的会议声音之上。`source → analyser` 就够了——`AnalyserNode` 不需要下游节点就能监测音频。
- **用 `getFloatTimeDomainData` 而不是 `getByteFrequencyData`。** 我们要的是音量表，不是频谱分析。`[-1, 1]` 范围的时域采样是计算 RMS 振幅最直接的路径。
- **dB 是对数尺度。** 振幅翻倍只增加 6 dB。普通电脑音量下的人声大约在 −30 到 −45 dB；低于 −60 dB 基本可以视为静音。
- **200 毫秒轮询。** 足够让音量表看起来流畅，又不至于打满 CPU。

## 后台标签页节流（以及为什么不影响我们）

当用户切到其它标签页时，`setInterval` 会被节流到最低 1 秒一次。这听起来对实时音频监控不利——但对我们这个场景不构成问题：

- 我们触发的是秒级（默认 30 秒，往往更长）的静音时长，1Hz 完全够用。
- `AudioContext` 本身在标签页可见性变化时仍然以音频线程优先级满速运行。采样照常算，只是我们读得少一点。
- 音频**输出**也不会被节流，所以警报音真要响的时候是立刻就响。

实际效果是：你可以让会议在一个标签页，让本工具在另一个标签页，再切到第三个标签页干别的，静音检测照常生效。

## 合成警报音

检测到静音后我们要**抓住用户注意力**。最低成本的办法是放一段警报音——但我们不想引入音频资源（多一次请求、多一份构建产物）。Web Audio API 可以免费合成一段：

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

880 Hz 的方波振荡器够亮，能穿透用户当前在做的其他事情。`GainNode` 给每一声鸣响套一个小小的 ADSR 包络，避免它听起来像一个卡住的连续音。用 `setInterval(beep, 600)` 循环这个包络，就得到了经典的"嘀—嘀—嘀"警报模式。

## 三重提醒

声音单独靠不住——用户的扬声器可能静音，或者输出设备不在听这个 tab。所以我们同时触发另外三个通道：

1. **页面内模态框** —— 全屏覆盖一切，必须显式关闭。
2. **`Notification`** —— 浏览器的原生系统通知，恰恰适合用户切到别处的场景。权限必须在用户手势上下文中请求，所以我们把它放在调用 `getDisplayMedia` 的同一个点击处理器里，和屏幕共享提示一起弹。
3. **标签页标题闪烁** —— 每 800 毫秒在原标题和 "⚠ 会议可能已经结束" 之间切换。即使页面在后台，浏览器标签栏里也能看到。

## 隐私姿态

值得停下来强调一下：**会议音频自始至终没有离开过浏览器。**

- 没有后端。
- 没有调用 `MediaRecorder` 或任何录音 API。
- 音频流走的是 `source → analyser`，只被读成数值化的振幅采样。
- 这些数值采样也不会离开页面——只用来更新音量表和触发提醒。

对用户来说这是比典型会议工具更强的隐私承诺：没有任何东西能丢失，因为本来就什么都没捕获。

它也让我们能把整站当作纯静态站点部署（我们这里用的是 Cloudflare Workers Static Assets），完全没有服务端运行时。

## 试一下

- 工具：[alarm.tokugai.com](https://alarm.tokugai.com/zh/) —— 三个 locale（EN / ZH / JA）。
- 源码：[github.com/lexluthor0304/boring_meeting_alarm](https://github.com/lexluthor0304/boring_meeting_alarm) —— MIT 协议，Astro + TypeScript。
- 关键代码在 `src/lib/silence-detector.ts`、`src/lib/alarm-sound.ts`、`src/components/MeetingAlarmApp.astro` 里。

如果你用这个模式做了类似的"X 停下来就叫醒我"小工具，欢迎在 [issue tracker](https://github.com/lexluthor0304/boring_meeting_alarm/issues) 告诉我一声。
