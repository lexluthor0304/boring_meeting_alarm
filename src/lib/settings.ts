import type { AppSettings } from './types';

const STORAGE_KEY = 'bma:settings';

export const DEFAULT_SETTINGS: AppSettings = {
  silenceDurationSec: 30,
  silenceThresholdDb: -50,
  alarmSoundEnabled: true,
  notificationEnabled: true,
};

const LIMITS = {
  silenceDurationSec: { min: 5, max: 3600 },
  silenceThresholdDb: { min: -80, max: -20 },
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      silenceDurationSec: clamp(
        Number(parsed.silenceDurationSec) || DEFAULT_SETTINGS.silenceDurationSec,
        LIMITS.silenceDurationSec.min,
        LIMITS.silenceDurationSec.max,
      ),
      silenceThresholdDb: clamp(
        Number(parsed.silenceThresholdDb) || DEFAULT_SETTINGS.silenceThresholdDb,
        LIMITS.silenceThresholdDb.min,
        LIMITS.silenceThresholdDb.max,
      ),
      alarmSoundEnabled: parsed.alarmSoundEnabled ?? DEFAULT_SETTINGS.alarmSoundEnabled,
      notificationEnabled: parsed.notificationEnabled ?? DEFAULT_SETTINGS.notificationEnabled,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Out of quota / private mode — silently ignore.
  }
}

export { LIMITS as SETTINGS_LIMITS };
