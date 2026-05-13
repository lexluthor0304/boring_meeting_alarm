export const locales = ['en', 'zh', 'ja'] as const;
export type Locale = (typeof locales)[number];

type StringMap = {
  htmlLang: string;
  title: string;
  tagline: string;
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
};

export const strings: Record<Locale, StringMap> = {
  en: {
    htmlLang: 'en',
    title: 'Boring Meeting Alarm',
    tagline: "Wakes you up when your meeting's silence drags on.",
    startMonitoring: 'Start Monitoring',
    stopMonitoring: 'Stop',
    statusIdle: 'Idle',
    statusListening: 'Listening',
    statusAlerted: 'Silence detected',
    currentVolume: 'Current volume',
    silenceDurationLabel: 'Alert after silence of',
    seconds: 'seconds',
    thresholdLabel: 'Silence threshold',
    thresholdHint: 'Lower = more sensitive. Watch the volume bar while talking to pick a value just below your normal level.',
    playAlarmSound: 'Play alarm sound on trigger',
    enableNotification: 'Enable system notifications',
    instructionsTitle: 'How to use',
    instruction1: 'Click "Start Monitoring".',
    instruction2: 'In the screen-share dialog, choose the tab where your meeting is running.',
    instruction3: 'Make sure the "Share tab audio" checkbox is ticked, then click Share.',
    browserHint: 'Works best in Chrome / Edge / Brave on desktop. Tab audio capture is unavailable in Firefox and limited on Safari.',
    alertTitle: 'Meeting may have ended',
    alertBody: 'No sound detected for the silence duration you set.',
    alertDismiss: 'Got it',
    tabFlashText: '⚠ Meeting may have ended',
    errorUnsupportedBrowser: 'This browser does not support tab audio capture. Please use Chrome, Edge, or Brave.',
    errorNoAudioTrack: 'No audio was captured. Please share again and make sure "Share tab audio" is checked.',
    errorPermissionDenied: 'You cancelled the screen share. Click "Start Monitoring" to try again.',
    errorGeneric: 'Something went wrong while starting the monitor.',
    languageSwitcherLabel: 'Language',
    footerTip: 'Everything runs locally in your browser. No audio leaves your machine.',
    metaDescription: 'A simple browser tool that listens to your meeting tab and alerts you when the silence drags on.',
  },
  zh: {
    htmlLang: 'zh-CN',
    title: '会议静音提醒',
    tagline: '会议静音太久？让浏览器叫醒你。',
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
    metaDescription: '一个在浏览器里监听会议标签页音频的小工具，长时间静音时提醒你会议可能已结束。',
  },
  ja: {
    htmlLang: 'ja',
    title: '会議サイレントアラーム',
    tagline: '会議の沈黙が長引いたら、ブラウザが知らせます。',
    startMonitoring: '監視を開始',
    stopMonitoring: '停止',
    statusIdle: '待機中',
    statusListening: '監視中',
    statusAlerted: '無音を検出',
    currentVolume: '現在の音量',
    silenceDurationLabel: '無音が続いて',
    seconds: '秒後に通知',
    thresholdLabel: '無音と判定する音量',
    thresholdHint: '値が低いほど敏感になります。話しながら音量バーを見て、通常の声量より少し下の値を選んでください。',
    playAlarmSound: 'トリガー時にアラーム音を鳴らす',
    enableNotification: 'システム通知を有効にする',
    instructionsTitle: '使い方',
    instruction1: '「監視を開始」をクリック。',
    instruction2: '画面共有のダイアログで会議が開いているタブを選択します。',
    instruction3: '「タブの音声を共有」のチェックを必ず入れて「共有」をクリック。',
    browserHint: 'デスクトップ版の Chrome / Edge / Brave での利用を推奨します。Firefox はタブ音声キャプチャ非対応、Safari は対応範囲が限定的です。',
    alertTitle: '会議が終了した可能性があります',
    alertBody: '設定した時間以上、音声が検出されませんでした。',
    alertDismiss: '了解',
    tabFlashText: '⚠ 会議が終了したかも',
    errorUnsupportedBrowser: 'このブラウザはタブ音声キャプチャに対応していません。Chrome / Edge / Brave をご利用ください。',
    errorNoAudioTrack: '音声を取得できませんでした。「タブの音声を共有」にチェックを入れて再度共有してください。',
    errorPermissionDenied: '画面共有がキャンセルされました。「監視を開始」からやり直してください。',
    errorGeneric: '監視の開始中にエラーが発生しました。',
    languageSwitcherLabel: '言語',
    footerTip: 'すべての処理はブラウザ内で完結し、音声がサーバーに送信されることはありません。',
    metaDescription: '会議タブの音声をブラウザだけで監視し、長い無音が続いたら通知してくれる小さなツール。',
  },
};
