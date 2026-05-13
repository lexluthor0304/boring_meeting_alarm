export type EventName =
  | 'start_monitoring'
  | 'stop_monitoring'
  | 'silence_detected'
  | 'silence_alert_dismissed'
  | 'no_audio_track'
  | 'screen_share_cancelled'
  | 'screen_share_track_ended';

type EventParams = Record<string, string | number | boolean>;

export function track(name: EventName, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;
  const gtag = window.gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', name, params);
}
