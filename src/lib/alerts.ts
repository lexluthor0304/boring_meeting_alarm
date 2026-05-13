import { AlarmSound } from './alarm-sound';

const TITLE_FLASH_INTERVAL_MS = 800;

export type AlertOptions = {
  modal: HTMLElement;
  modalTitle: HTMLElement;
  modalBody: HTMLElement;
  notificationEnabled: boolean;
  alarmSoundEnabled: boolean;
};

export class AlertManager {
  private originalTitle: string = '';
  private titleFlashTimer: number | null = null;
  private flashOn = false;
  private alarmSound: AlarmSound | null = null;
  private activeNotification: Notification | null = null;
  private active = false;

  trigger(opts: AlertOptions): void {
    if (this.active) return;
    this.active = true;
    const t = window.__BMA__.t;

    opts.modalTitle.textContent = t.alertTitle;
    opts.modalBody.textContent = t.alertBody;
    opts.modal.hidden = false;
    opts.modal.classList.add('is-open');

    if (opts.alarmSoundEnabled) {
      this.alarmSound = new AlarmSound();
      this.alarmSound.start();
    }

    if (opts.notificationEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        this.activeNotification = new Notification(t.alertTitle, {
          body: t.alertBody,
          requireInteraction: true,
          tag: 'bma-silence-alert',
        });
        this.activeNotification.onclick = () => {
          window.focus();
          this.activeNotification?.close();
        };
      } catch {
        // Some browsers throw when constructing Notification outside a SW.
      }
    }

    this.startTitleFlash(t.tabFlashText);
  }

  dismiss(opts: Pick<AlertOptions, 'modal'>): void {
    if (!this.active) return;
    this.active = false;

    opts.modal.hidden = true;
    opts.modal.classList.remove('is-open');

    this.alarmSound?.stop();
    this.alarmSound = null;

    this.activeNotification?.close();
    this.activeNotification = null;

    this.stopTitleFlash();
  }

  isActive(): boolean {
    return this.active;
  }

  private startTitleFlash(flashText: string): void {
    this.originalTitle = document.title;
    this.flashOn = false;
    this.titleFlashTimer = window.setInterval(() => {
      this.flashOn = !this.flashOn;
      document.title = this.flashOn ? flashText : this.originalTitle;
    }, TITLE_FLASH_INTERVAL_MS);
  }

  private stopTitleFlash(): void {
    if (this.titleFlashTimer !== null) {
      window.clearInterval(this.titleFlashTimer);
      this.titleFlashTimer = null;
    }
    if (this.originalTitle) {
      document.title = this.originalTitle;
    }
  }
}

export async function requestNotificationPermissionIfNeeded(enabled: boolean): Promise<boolean> {
  if (!enabled) return false;
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch {
    return false;
  }
}
