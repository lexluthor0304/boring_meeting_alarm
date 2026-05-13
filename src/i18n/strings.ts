export const locales = ['en', 'zh', 'ja'] as const;
export type Locale = (typeof locales)[number];

export type FaqItem = { q: string; a: string };

type StringMap = {
  htmlLang: string;
  title: string;
  tagline: string;
  intro: string;
  startMonitoring: string;
  stopMonitoring: string;
  statusIdle: string;
  statusListening: string;
  statusAlerted: string;
  currentVolume: string;
  silenceDurationLabel: string;
  seconds: string;
  thresholdLabel: string;
  thresholdHint: string;
  playAlarmSound: string;
  enableNotification: string;
  instructionsTitle: string;
  instruction1: string;
  instruction2: string;
  instruction3: string;
  browserHint: string;
  alertTitle: string;
  alertBody: string;
  alertDismiss: string;
  tabFlashText: string;
  errorUnsupportedBrowser: string;
  errorNoAudioTrack: string;
  errorPermissionDenied: string;
  errorGeneric: string;
  languageSwitcherLabel: string;
  footerTip: string;
  metaDescription: string;
  consentMessage: string;
  consentAccept: string;
  consentReject: string;
  faqTitle: string;
  faq: ReadonlyArray<FaqItem>;
  footerBuilder: string;
  footerUpdatedPrefix: string;
  footerSource: string;
  privacyPageTitle: string;
  privacyPageMetaDescription: string;
  privacyLastUpdatedLabel: string;
  privacyBackToTool: string;
  footerPrivacyLink: string;
};

export const strings: Record<Locale, StringMap> = {
  en: {
    htmlLang: 'en',
    title: 'Boring Meeting Alarm',
    tagline: "Wakes you up when your meeting's silence drags on.",
    intro:
      "Boring Meeting Alarm is a free browser tool that monitors a meeting tab you share and alerts you the moment its audio stays silent for too long. Useful for video calls where the host wraps up while you've stepped away. Everything runs locally — no audio leaves your browser.",
    startMonitoring: 'Start Monitoring',
    stopMonitoring: 'Stop',
    statusIdle: 'Idle',
    statusListening: 'Listening',
    statusAlerted: 'Silence detected',
    currentVolume: 'Current volume',
    silenceDurationLabel: 'Alert after silence of',
    seconds: 'seconds',
    thresholdLabel: 'Silence threshold',
    thresholdHint:
      'Lower = more sensitive. Watch the volume bar while talking to pick a value just below your normal level.',
    playAlarmSound: 'Play alarm sound on trigger',
    enableNotification: 'Enable system notifications',
    instructionsTitle: 'How to use',
    instruction1: 'Click "Start Monitoring".',
    instruction2: 'In the screen-share dialog, choose the tab where your meeting is running.',
    instruction3: 'Make sure the "Share tab audio" checkbox is ticked, then click Share.',
    browserHint:
      'Works best in Chrome / Edge / Brave on desktop. Tab audio capture is unavailable in Firefox and limited on Safari.',
    alertTitle: 'Meeting may have ended',
    alertBody: 'No sound detected for the silence duration you set.',
    alertDismiss: 'Got it',
    tabFlashText: '⚠ Meeting may have ended',
    errorUnsupportedBrowser:
      'This browser does not support tab audio capture. Please use Chrome, Edge, or Brave.',
    errorNoAudioTrack:
      'No audio was captured. Please share again and make sure "Share tab audio" is checked.',
    errorPermissionDenied:
      'You cancelled the screen share. Click "Start Monitoring" to try again.',
    errorGeneric: 'Something went wrong while starting the monitor.',
    languageSwitcherLabel: 'Language',
    footerTip: 'Everything runs locally in your browser. No audio leaves your machine.',
    metaDescription:
      'A free browser tool that listens to a meeting tab you share and alerts you with sound, system notification, and a modal when the tab stays silent for too long.',
    consentMessage: 'We use cookies for analytics and to show ads. Allow optional cookies?',
    consentAccept: 'Allow',
    consentReject: 'Reject',
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        q: 'What is Boring Meeting Alarm?',
        a: "Boring Meeting Alarm is a free browser tool that listens to the audio of a meeting tab you select via the screen-share dialog. When the audio level stays below a threshold for longer than the duration you configure, it fires a modal, a system notification, an alarm sound, and a tab title flash. It's designed for video calls where the meeting wraps up but you've stepped away.",
      },
      {
        q: 'Does it work with Zoom, Google Meet, or Microsoft Teams?',
        a: 'It works with any meeting that runs in a browser tab — Google Meet, Microsoft Teams (web app), Zoom (web client), Whereby, Around, Discord (web), and any other browser-based call. Native desktop apps like the Zoom or Teams installer apps are not supported because their audio does not pass through a browser tab.',
      },
      {
        q: 'How does it detect silence?',
        a: 'When you share a tab, the page captures its audio stream via the getDisplayMedia Web API, routes it through an AnalyserNode from the Web Audio API, and computes the RMS volume in dB on a 200 ms loop. It triggers when the level stays below your threshold for the duration you set. Only volume is measured — nothing is recorded.',
      },
      {
        q: 'Is my meeting audio uploaded anywhere?',
        a: 'No. All audio analysis happens locally in your browser. There is no backend, no recording, no upload, and no third-party processing of the audio stream. You can verify by reading the source on GitHub or by checking your browser DevTools network panel — no audio data leaves the page.',
      },
      {
        q: 'Why does it not work in Firefox?',
        a: 'Firefox does not yet support audio capture from a tab via getDisplayMedia({ audio: true }). The "Share tab audio" checkbox does not appear in the Firefox screen-share dialog. Use a Chromium-based browser like Chrome, Edge, Brave, or Arc. Safari support is limited and not officially tested.',
      },
      {
        q: 'Does it keep working when the tab is in the background?',
        a: 'Yes. The AudioContext keeps running at audio-thread priority even when the page is backgrounded. The polling timer gets throttled by the browser to about once per second, but since silence durations are configured in seconds (30 by default), the precision is more than enough. You can leave the tool running in another tab and focus on your meeting.',
      },
    ],
    footerBuilder: 'Built by tokugai',
    footerUpdatedPrefix: 'Last updated ',
    footerSource: 'Source on GitHub',
    privacyPageTitle: 'Privacy Policy — Boring Meeting Alarm',
    privacyPageMetaDescription:
      'How Boring Meeting Alarm handles your data. No meeting audio is recorded or uploaded. Analytics and ads are gated behind your explicit consent.',
    privacyLastUpdatedLabel: 'Last updated',
    privacyBackToTool: '← Back to the tool',
    footerPrivacyLink: 'Privacy',
  },
  zh: {
    htmlLang: 'zh-CN',
    title: '会议静音提醒',
    tagline: '会议静音太久？让浏览器叫醒你。',
    intro:
      '会议静音提醒是一个免费的浏览器小工具：你共享一个会议标签页，它会监听音频，当连续静音超过设定时长时通过弹窗、系统通知、警报音三种方式提醒你。所有处理都在浏览器本地完成，音频不会上传任何服务器。',
    startMonitoring: '开始监听',
    stopMonitoring: '停止',
    statusIdle: '未监听',
    statusListening: '监听中',
    statusAlerted: '检测到静音',
    currentVolume: '当前音量',
    silenceDurationLabel: '静音持续超过',
    seconds: '秒后提醒',
    thresholdLabel: '静音阈值',
    thresholdHint: '数值越低越敏感。建议说话时一边看音量条一边调，选一个略低于正常说话音量的值。',
    playAlarmSound: '触发时播放警报音',
    enableNotification: '启用系统通知',
    instructionsTitle: '使用步骤',
    instruction1: '点击"开始监听"。',
    instruction2: '在弹出的屏幕共享对话框中选择会议所在的标签页。',
    instruction3: '务必勾选"共享标签页音频"复选框，然后点击共享。',
    browserHint: '推荐使用桌面版 Chrome / Edge / Brave。Firefox 不支持标签页音频捕获，Safari 支持有限。',
    alertTitle: '会议可能已经结束',
    alertBody: '在你设置的时长内未检测到任何声音。',
    alertDismiss: '我知道了',
    tabFlashText: '⚠ 会议可能已经结束',
    errorUnsupportedBrowser: '当前浏览器不支持标签页音频捕获，请使用 Chrome、Edge 或 Brave。',
    errorNoAudioTrack: '未捕获到音频流，请重新共享并勾选"共享标签页音频"。',
    errorPermissionDenied: '你取消了屏幕共享。点击"开始监听"可以重新尝试。',
    errorGeneric: '启动监听时出错。',
    languageSwitcherLabel: '语言',
    footerTip: '所有处理都在你本地浏览器完成，音频不会上传任何服务器。',
    metaDescription:
      '一个免费的浏览器小工具：监听你共享的会议标签页音频，长时间静音时通过弹窗、系统通知、警报音和标签页标题闪烁提醒你会议可能已结束。',
    consentMessage: '本站使用 cookies 进行匿名访问分析与广告投放，是否允许？',
    consentAccept: '允许',
    consentReject: '拒绝',
    faqTitle: '常见问题',
    faq: [
      {
        q: '什么是"会议静音提醒"？',
        a: '"会议静音提醒"是一个免费的浏览器小工具。你通过屏幕共享对话框选择一个会议标签页，工具就会监听该标签页的音频电平。当连续静音超过你设定的时长时，它会同时弹出页面模态框、发送系统通知、播放警报音并闪烁标签页标题。专为远程会议中"主持人散会了你却走开了"的场景设计。',
      },
      {
        q: '它支持 Zoom、Google Meet、Microsoft Teams 吗？',
        a: '支持任何运行在浏览器标签页里的会议——Google Meet、Microsoft Teams 网页版、Zoom 网页版、腾讯会议网页版、飞书会议网页版、Whereby、Around、Discord 网页版等。原生桌面客户端（如 Zoom / Teams 安装版）不支持，因为它们的音频不经过浏览器标签页。',
      },
      {
        q: '它是怎么检测静音的？',
        a: '共享标签页后，页面通过 getDisplayMedia Web API 捕获该标签页的音频流，连接到 Web Audio API 的 AnalyserNode，每 200 毫秒计算一次 RMS 音量（以 dB 为单位）。当音量低于你设定的阈值并持续达到设定时长时触发提醒。工具只读取音量，不录音、不解析内容。',
      },
      {
        q: '我的会议音频会被上传吗？',
        a: '不会。所有音频分析都在浏览器本地完成，没有后端、没有录音、没有上传、没有任何第三方处理音频流。你可以在 GitHub 上阅读源码，或在浏览器开发者工具的 Network 面板查看——不会有任何音频数据离开页面。',
      },
      {
        q: '为什么 Firefox 不能用？',
        a: 'Firefox 目前不支持通过 getDisplayMedia({ audio: true }) 从标签页捕获音频。Firefox 的屏幕共享对话框里没有"共享标签页音频"复选框。请使用 Chromium 系浏览器：Chrome、Edge、Brave、Arc 等。Safari 支持范围有限，未经过正式测试。',
      },
      {
        q: '切换到其它标签页后还能继续工作吗？',
        a: '可以。即使本工具的标签页被切到后台，AudioContext 仍然以音频线程优先级全速运行。轮询定时器会被浏览器节流到大约每秒 1 次，但你设定的静音时长以秒为单位（默认 30 秒），1Hz 精度完全够用。你可以让本工具在另一个标签页运行，自己专心开会。',
      },
    ],
    footerBuilder: '由 tokugai 构建',
    footerUpdatedPrefix: '最后更新于 ',
    footerSource: 'GitHub 源码',
    privacyPageTitle: '隐私政策 — 会议静音提醒',
    privacyPageMetaDescription:
      '会议静音提醒如何处理你的数据：不录制、不上传任何会议音频；分析与广告 cookies 仅在你明确同意后启用。',
    privacyLastUpdatedLabel: '最后更新',
    privacyBackToTool: '← 返回工具',
    footerPrivacyLink: '隐私政策',
  },
  ja: {
    htmlLang: 'ja',
    title: '会議サイレントアラーム',
    tagline: '会議の沈黙が長引いたら、ブラウザが知らせます。',
    intro:
      '会議サイレントアラームは、共有した会議タブの音声を監視し、設定した時間以上の無音を検出するとモーダル・通知・アラーム音で知らせる無料のブラウザツールです。すべての処理はブラウザ内で完結し、音声がサーバーに送信されることはありません。',
    startMonitoring: '監視を開始',
    stopMonitoring: '停止',
    statusIdle: '待機中',
    statusListening: '監視中',
    statusAlerted: '無音を検出',
    currentVolume: '現在の音量',
    silenceDurationLabel: '無音が続いて',
    seconds: '秒後に通知',
    thresholdLabel: '無音と判定する音量',
    thresholdHint:
      '値が低いほど敏感になります。話しながら音量バーを見て、通常の声量より少し下の値を選んでください。',
    playAlarmSound: 'トリガー時にアラーム音を鳴らす',
    enableNotification: 'システム通知を有効にする',
    instructionsTitle: '使い方',
    instruction1: '「監視を開始」をクリック。',
    instruction2: '画面共有のダイアログで会議が開いているタブを選択します。',
    instruction3: '「タブの音声を共有」のチェックを必ず入れて「共有」をクリック。',
    browserHint:
      'デスクトップ版の Chrome / Edge / Brave での利用を推奨します。Firefox はタブ音声キャプチャ非対応、Safari は対応範囲が限定的です。',
    alertTitle: '会議が終了した可能性があります',
    alertBody: '設定した時間以上、音声が検出されませんでした。',
    alertDismiss: '了解',
    tabFlashText: '⚠ 会議が終了したかも',
    errorUnsupportedBrowser:
      'このブラウザはタブ音声キャプチャに対応していません。Chrome / Edge / Brave をご利用ください。',
    errorNoAudioTrack:
      '音声を取得できませんでした。「タブの音声を共有」にチェックを入れて再度共有してください。',
    errorPermissionDenied: '画面共有がキャンセルされました。「監視を開始」からやり直してください。',
    errorGeneric: '監視の開始中にエラーが発生しました。',
    languageSwitcherLabel: '言語',
    footerTip: 'すべての処理はブラウザ内で完結し、音声がサーバーに送信されることはありません。',
    metaDescription:
      '共有した会議タブの音声を監視し、設定した時間以上の無音を検出するとモーダル・通知・アラーム音で知らせる無料のブラウザツール。',
    consentMessage: 'アクセス解析と広告表示のために Cookie を利用します。許可しますか？',
    consentAccept: '許可する',
    consentReject: '拒否する',
    faqTitle: 'よくある質問',
    faq: [
      {
        q: '「会議サイレントアラーム」とは？',
        a: '「会議サイレントアラーム」は無料のブラウザ用ツールです。画面共有のダイアログで会議が開いているタブを選ぶと、そのタブの音声レベルを監視し、設定した時間以上の無音が続いたらモーダル・システム通知・アラーム音・タブタイトル点滅でお知らせします。リモート会議で「ホストは終わったのに自分は席を外していた」というケース向けです。',
      },
      {
        q: 'Zoom、Google Meet、Microsoft Teams で使えますか？',
        a: 'ブラウザ上で動く会議なら基本的に使えます。Google Meet、Microsoft Teams の Web 版、Zoom の Web クライアント、Whereby、Around、Discord の Web 版など。Zoom や Teams のネイティブデスクトップアプリは音声がブラウザタブを経由しないため非対応です。',
      },
      {
        q: '無音はどうやって検出していますか？',
        a: 'タブを共有すると、ページが getDisplayMedia Web API で音声ストリームを受け取り、Web Audio API の AnalyserNode に接続して 200 ミリ秒ごとに RMS 音量を dB で算出します。設定した閾値を下回る状態が設定時間続いたら通知を発火します。音量だけを読み取り、録音や内容解析は一切行いません。',
      },
      {
        q: '会議の音声はどこかにアップロードされますか？',
        a: 'いいえ。すべての解析はブラウザ内で完結します。バックエンドも、録音も、アップロードも、第三者処理もありません。ソースコードは GitHub で公開しており、ブラウザの DevTools の Network パネルを開けば、音声データが外部に出ていないことを確認できます。',
      },
      {
        q: 'なぜ Firefox では動かないのですか？',
        a: 'Firefox は現在 getDisplayMedia({ audio: true }) でのタブ音声キャプチャに対応していません。Firefox の画面共有ダイアログには「タブの音声を共有」というチェックボックスが存在しません。Chrome、Edge、Brave、Arc など Chromium 系ブラウザをご利用ください。Safari は対応が限定的で公式テスト対象外です。',
      },
      {
        q: '他のタブに切り替えても動き続けますか？',
        a: '動き続けます。タブがバックグラウンドになっても、AudioContext はオーディオスレッド優先度で全速度で動作します。ポーリング用タイマーはブラウザによって 1 秒に 1 回ほどに制限されますが、無音時間は秒単位（デフォルト 30 秒）で設定するため、1Hz の精度で十分です。本ツールを別タブで開いたまま会議に集中できます。',
      },
    ],
    footerBuilder: 'tokugai 制作',
    footerUpdatedPrefix: '最終更新：',
    footerSource: 'GitHub ソース',
    privacyPageTitle: 'プライバシーポリシー — 会議サイレントアラーム',
    privacyPageMetaDescription:
      '会議サイレントアラームがデータをどう扱うか：会議音声の録音・アップロードは一切なし。解析と広告 Cookie は明示的な同意後にのみ有効。',
    privacyLastUpdatedLabel: '最終更新',
    privacyBackToTool: '← ツールに戻る',
    footerPrivacyLink: 'プライバシー',
  },
};
