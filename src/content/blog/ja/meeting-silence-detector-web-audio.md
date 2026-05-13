---
title: "Web Audio API 80 行で作る会議サイレント検出ツール"
description: "getDisplayMedia でタブ音声を取得し、AnalyserNode で RMS レベルを計算し、会議が沈黙したらマルチチャネルで通知を発火させる仕組みを解説。すべてブラウザ内、バックエンドなし。"
slug: meeting-silence-detector-web-audio
locale: ja
datePublished: "2026-05-13"
tags: ["web-audio", "getDisplayMedia", "astro", "cloudflare-workers"]
---

長いリモート会議に出ていて、終わってから 5 分後にようやく「あ、もうみんないなかった」と気づいた経験はありませんか。会議用タイマー拡張は色々ありますが、ホストが早めに切り上げたり長引いたりすると固定時間のタイマーは役に立ちません。ほしいのは **「会話が一定時間沈黙したら教えてほしい」** という機能です。

[会議サイレントアラーム](https://alarm.tokugai.com/ja/) はまさにそれをやる小さなブラウザツールです。

1. 会議タブをページに共有する。
2. ページがそのタブの音声を監視し、音量を継続的に読み取る。
3. 音量が閾値を下回った状態が設定時間続いたら、4 つのチャネル（モーダル、システム通知、合成アラーム音、タブタイトル点滅）で同時に通知する。

肝心の処理は TypeScript で約 80 行。すべてクライアントサイドで動き、音声はブラウザ外に出ません。本記事では中身がどう動いているかを順に説明します。

## 使う 2 つのブラウザ API

必要なのはたった 2 つです。

- **`navigator.mediaDevices.getDisplayMedia({ audio: true })`** —— 画面共有 API。名前に "Display" とありますが、共有ピッカーで「タブの音声を共有」にチェックさえ入れれば、ブラウザタブの音声も取得できます。
- **Web Audio API**、具体的には `AudioContext` + `AnalyserNode` —— 音声波形をレンダリングしたり録音したりせずにリアルタイムで読み取れます。

外部ライブラリも、バックエンドも、録音もなしです。

## タブ音声の取得

```ts
const stream = await navigator.mediaDevices.getDisplayMedia({
  video: { displaySurface: 'browser' },
  audio: true,
  // 非標準だが Chromium 系で広くサポート——
  // Chrome のピッカーをデフォルトで「タブ」セクションにする。
  selfBrowserSurface: 'exclude',
  systemAudio: 'include',
});
```

ぱっと見ではわからない注意点がいくつかあります。

**`audio: true` 単独はダメ。** 仕様上、`video` も同時に指定する必要があります（実際には映像はいらないのに）。両方取得し、映像トラックはすぐに停止してリソースを解放します。

```ts
stream.getVideoTracks().forEach((track) => track.stop());
```

**音声取得はオプトイン。** Chrome のピッカー下部に「タブの音声を共有」というチェックボックスがあります。ユーザーがチェックを入れないと `getAudioTracks().length === 0` のストリームが返ります。検出して再共有を促すべきです。

```ts
const audioTracks = stream.getAudioTracks();
if (audioTracks.length === 0) {
  stream.getTracks().forEach((track) => track.stop());
  throw new Error('音声を取得できませんでした。「タブの音声を共有」にチェックを入れてください。');
}
```

**Firefox は非対応。** Firefox の画面共有ダイアログには「タブの音声を共有」というチェックボックス自体が存在しません。`navigator.mediaDevices?.getDisplayMedia` で特性検出して優雅にフォールバックする必要があります。

## RMS → dB

`MediaStream` を取得できたら、Web Audio グラフに繋いでタイマーで振幅を読み取ります。

```ts
const ctx = new AudioContext();
const source = ctx.createMediaStreamSource(stream);
const analyser = ctx.createAnalyser();
analyser.fftSize = 2048;
source.connect(analyser);
// 注意：analyser を ctx.destination には繋がない。
// 音声を *測定* したいだけで、ユーザーのスピーカーに *再生* したいわけではない。

const buffer = new Float32Array(analyser.fftSize);

setInterval(() => {
  analyser.getFloatTimeDomainData(buffer);
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    sumSquares += buffer[i] ** 2;
  }
  const rms = Math.sqrt(sumSquares / buffer.length);
  const db = rms > 0 ? 20 * Math.log10(rms) : -100;
  // db は概ね [-100, 0] の範囲に収まる
}, 200);
```

ポイント：

- **destination に繋がない。** このプロジェクトで唯一の落とし穴です。`analyser.connect(ctx.destination)` をしてしまうと、会議音声がユーザーのスピーカーから再生され、本人が既に聞いている会議音声と重複します。`source → analyser` だけで OK。`AnalyserNode` は下流ノードがなくても監視できます。
- **`getFloatTimeDomainData` を使う。** ほしいのは音量計でスペクトラムアナライザではありません。`[-1, 1]` の時間領域サンプルが RMS 振幅への最短ルートです。
- **dB は対数スケール。** 振幅が 2 倍でも +6 dB しか増えません。通常の PC 音量での人声は概ね −30 〜 −45 dB あたり。−60 dB を下回ったら無音と見て差し支えありません。
- **200 ミリ秒ごとのポーリング。** 音量メーターを滑らかに動かせる頻度で、CPU を食い潰さない程度。

## バックグラウンドタブのスロットリング（影響なし）

ユーザーが別タブに切り替えると、`setInterval` は最低 1 秒に 1 回までスロットリングされます。リアルタイム音声監視には不利に聞こえますが、本ユースケースでは問題になりません。

- 無音判定の時間は秒単位（既定 30 秒、もっと長いことも多い）。1 Hz で十分。
- `AudioContext` 自体はタブの可視性に関係なくオーディオスレッド優先度でフルスピードで動き続けます。サンプリングは継続していて、読み取り頻度だけが落ちます。
- 音声**出力**もスロットルされないので、アラーム音は鳴るタイミングで即座に鳴ります。

実際の使用感としては、会議を別タブ、本ツールをもう一つ別タブで動かし、自分は 3 つ目のタブで別作業——という状況でも無音検出はちゃんと発火します。

## アラーム音の合成

無音を検出したら、**ユーザーの注意を惹く**必要があります。アラーム音を鳴らすのが一番ハードルが低い手段ですが、音声アセットは載せたくありません（リクエストもビルド成果物も増える）。Web Audio API なら無料で合成できます。

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

880 Hz の方形波オシレーターは、ユーザーが他のことをしていても十分突き抜けて聞こえます。`GainNode` で各ビープに小さな ADSR エンベロープをかけることで、連続音が貼り付いたような不快な音にならないようにしています。`setInterval(beep, 600)` でエンベロープをループさせると、定番の「ピッ—ピッ—ピッ」のアラームパターンが得られます。

## 3 重通知

音声だけだと取りこぼします——スピーカーがミュートかもしれないし、出力デバイスがそのタブを聞いていないかもしれない。なので 3 つの追加チャネルを並行して発火させます。

1. **ページ内モーダル** —— フルスクリーンで全てを覆い、明示的に閉じるまで残る。
2. **`Notification`** —— ブラウザのネイティブシステム通知。ユーザーがタブを離れている前提の本ユースケースに最適。権限はユーザージェスチャーコンテキスト内でしか要求できないので、`getDisplayMedia` を呼ぶ同じクリックハンドラ内で要求し、画面共有のプロンプトと並べて出します。
3. **タブタイトル点滅** —— 800 ミリ秒ごとに元のタイトルと "⚠ 会議が終了したかも" を入れ替え。ページがバックグラウンドでもタブストリップで見えます。

## プライバシー設計

これは強調しておきたいポイントです：**会議音声は最初から最後までブラウザ外に出ません。**

- バックエンドなし。
- `MediaRecorder` や録音 API は一切呼ばない。
- 音声ストリームは `source → analyser` を通り、振幅サンプルとして数値で読み取られるだけ。
- その数値サンプルもページ外には出ない——音量メーター更新と通知発火にしか使わない。

ユーザーから見ると、これは典型的な会議ツールよりも強いプライバシー保証です。**そもそも何も取得していないので、漏らしようがない。**

おかげで、純粋な静的サイト（私たちの場合は Cloudflare Workers Static Assets）として、サーバーサイドランタイムゼロでデプロイできています。

## 試してみる

- ツール：[alarm.tokugai.com](https://alarm.tokugai.com/ja/) —— 3 ロケール（EN / ZH / JA）対応。
- ソース：[github.com/lexluthor0304/boring_meeting_alarm](https://github.com/lexluthor0304/boring_meeting_alarm) —— MIT ライセンスの Astro + TypeScript。
- 主要なコードは `src/lib/silence-detector.ts`、`src/lib/alarm-sound.ts`、`src/components/MeetingAlarmApp.astro` にあります。

同じパターン（「X が止まったら起こして」型のツール）で何か作ったら、ぜひ [issue tracker](https://github.com/lexluthor0304/boring_meeting_alarm/issues) で教えてください。気になります。
