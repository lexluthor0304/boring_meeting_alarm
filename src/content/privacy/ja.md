---
title: プライバシーポリシー
locale: ja
lastUpdated: "2026-05-13"
---

## 要約

会議サイレントアラームは個人プロジェクトであり、すべての機能はブラウザ内で完結します。会議の音声を録音・アップロードすることはありません。アクセス計測には Google Analytics 4 を、広告配信には Google AdSense を利用しますが、いずれも Google Consent Mode v2 によりユーザーの明示的な同意後にのみ有効になります。

## 収集しないもの

**会議の音声。** 本ツールは Web Audio API を用いてブラウザ内で音量レベルのみを計算しています。音声ストリームがマシンを離れることはありません。バックエンドも、録音も、アップロードもありません。ソースコードは [GitHub](https://github.com/lexluthor0304/boring_meeting_alarm) で公開しており、ブラウザの DevTools の Network パネルでもご確認いただけます——音声データがページ外に出ることはありません。

## 収集するもの

### 機能データ — 常にブラウザ内に保存

- ツール設定（無音時間、閾値、アラーム音 ON/OFF、通知 ON/OFF）—— `localStorage` に保存され、セッションをまたいで保持されます
- Cookie 同意の選択 —— こちらも `localStorage` に保存

これらのデータはブラウザを離れません。

### アクセス計測 — 「許可する」をクリック後のみ

Google Analytics 4 は標準的なウェブ解析データ（ページビュー、匿名化された端末・ブラウザ情報、地域情報、リファラ）を収集します。同意バナーで「許可する」をクリックするまでは、Google Consent Mode v2 により Cookie レスモードで動作します——`_ga` Cookie もクライアント識別子も設定されません。

### 広告 — 「許可する」をクリック後のみ

Google AdSense は Cookie を使用してパーソナライズ広告を配信する場合があります。同意バナーで「許可する」をクリックするまでは、AdSense は非パーソナライズモードで動作します。

## 使用する Cookie

| Cookie | 設定者 | 用途 | 設定タイミング |
|---|---|---|---|
| `bma:settings`, `bma:consent` | 本サイト（`localStorage`） | 設定と同意選択の保存 | 常時 |
| `_ga`, `_ga_*` | Google Analytics | 匿名化アクセス解析 | 「許可する」クリック後のみ |
| AdSense / DoubleClick 関連 Cookie | Google AdSense | パーソナライズ広告 | 「許可する」クリック後のみ |

## ユーザーの選択

- **同意バナー：** 「拒否する」をクリックすれば、解析・パーソナライズ広告 Cookie は設定されません。
- **設定の変更：** ブラウザで `alarm.tokugai.com` のサイトデータを削除すると、再度バナーが表示されます。
- **ブラウザ設定：** 主要ブラウザの設定でサードパーティ Cookie をブロックできます。
- **Do Not Track：** Consent Mode v2 の対応範囲内でブラウザの DNT シグナルを尊重します。

## 第三者サービス

| サービス | 用途 | プライバシーポリシー |
|---|---|---|
| Google Analytics 4 | サイト解析 | [policies.google.com/privacy](https://policies.google.com/privacy) |
| Google AdSense | 広告配信 | [policies.google.com/technologies/ads](https://policies.google.com/technologies/ads) |
| GitHub（Star/Fork ボタン） | フッターのボタンが `buttons.github.io/buttons.js` を読み込み、github.com 経由で Cookie を設定する場合があります | [GitHub プライバシーに関する声明](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) |

## 未成年者

本サイトは 13 歳未満（より高い年齢が適用される国・地域では当該年齢未満）の方を対象としていません。意図的に未成年者のデータを収集することはありません。

## ポリシーの変更

本ポリシーは適宜更新する場合があります。最上部の「最終更新」日付が最新の変更日を示します。重要な変更があった場合は明示します。

## お問い合わせ

ご質問、訂正、データ削除のご依頼（注：当方が管理するいかなるサーバーにも個人を特定できるデータを保管していません）は、[github.com/lexluthor0304/boring_meeting_alarm/issues](https://github.com/lexluthor0304/boring_meeting_alarm/issues) から Issue を作成してください。
