import type { Locale, strings } from '../i18n/strings';

export type StringMap = (typeof strings)[Locale];

export type AppSettings = {
  silenceDurationSec: number;
  silenceThresholdDb: number;
  alarmSoundEnabled: boolean;
  notificationEnabled: boolean;
};

declare global {
  interface Window {
    __BMA__: {
      t: StringMap;
      locale: Locale;
    };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}

export {};
