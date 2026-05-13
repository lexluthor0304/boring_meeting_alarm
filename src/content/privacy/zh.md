---
title: 隐私政策
locale: zh
lastUpdated: "2026-05-13"
---

## 一句话总结

会议静音提醒是一个个人项目，所有功能都在你的浏览器内完成。我们不录制也不上传你的会议音频。我们使用 Google Analytics 4 进行访问统计、Google AdSense 投放广告，两者都通过 Google Consent Mode v2 在你明确同意后才生效。

## 我们不收集的东西

**你的会议音频。** 本工具使用 Web Audio API 在你的浏览器本地计算音量。音频流不会离开你的电脑。没有后端、没有录音、没有上传。你可以在 [GitHub](https://github.com/lexluthor0304/boring_meeting_alarm) 上阅读源码核实，或者打开浏览器 DevTools 的 Network 面板观察——不会有任何音频数据离开页面。

## 我们收集的东西

### 功能性数据——始终保存在你的浏览器内

- 你的工具设置（静音时长、阈值、警报音开关、通知开关）—— 存放在 `localStorage` 中，跨会话保留
- 你的 cookie 同意决定 —— 也在 `localStorage` 中

这些数据永远不离开你的浏览器。

### 访问统计——仅在你点击"允许"后

Google Analytics 4 收集标准的网站分析数据：页面访问、匿名化设备/浏览器信息、地理区域、来源链接。在你点击同意横幅中的"允许"之前，Google Consent Mode v2 让它运行在无 cookie 模式下——没有 `_ga` cookies，没有客户端标识符。

### 广告——仅在你点击"允许"后

Google AdSense 可能使用 cookies 投放个性化广告。在你点击同意横幅中的"允许"之前，AdSense 运行在非个性化模式下。

## 使用的 Cookies

| Cookie | 设置方 | 用途 | 何时设置 |
|---|---|---|---|
| `bma:settings`、`bma:consent` | 本站（`localStorage`） | 记住你的设置和同意决定 | 始终 |
| `_ga`、`_ga_*` | Google Analytics | 匿名化访问分析 | 仅在你点击"允许"后 |
| AdSense / DoubleClick 系列 cookies | Google AdSense | 个性化广告 | 仅在你点击"允许"后 |

## 你的选择

- **同意横幅：** 点击"拒绝"可以让分析和个性化广告 cookies 不被设置。
- **改变主意：** 在浏览器中清除 `alarm.tokugai.com` 的站点数据，可以再次触发横幅。
- **浏览器控制：** 所有现代浏览器都支持在设置中阻止第三方 cookies。
- **Do Not Track：** 我们在 Consent Mode v2 支持的范围内尊重浏览器的"请勿追踪"信号。

## 第三方

| 服务 | 用途 | 隐私政策 |
|---|---|---|
| Google Analytics 4 | 站点分析 | [policies.google.com/privacy](https://policies.google.com/privacy) |
| Google AdSense | 广告投放 | [policies.google.com/technologies/ads](https://policies.google.com/technologies/ads) |
| GitHub（Star/Fork 按钮） | 页脚按钮加载 `buttons.github.io/buttons.js`，可能通过 github.com 设置 cookies | [GitHub 隐私声明](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) |

## 未成年人

本站点不面向 13 岁以下儿童（或在适用更高年龄的司法辖区内未达到该年龄的人）。我们不会有意收集未成年人的数据。

## 政策变更

我们可能不定期更新本政策。顶部的"最后更新"日期反映最近一次变更。重大变更会被高亮标注。

## 联系方式

如有问题、更正或数据删除请求（注意：我们不在任何受我们控制的服务器上存储可识别个人身份的数据），请在 [github.com/lexluthor0304/boring_meeting_alarm/issues](https://github.com/lexluthor0304/boring_meeting_alarm/issues) 提交 issue。
