export class AlarmSound {
  private ctx: AudioContext | null = null;
  private timerId: number | null = null;
  private gainNode: GainNode | null = null;
  private oscillator: OscillatorNode | null = null;

  start(): void {
    if (this.ctx) return;
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    this.ctx = new AudioCtor();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0;
    this.gainNode.connect(this.ctx.destination);

    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = 'square';
    this.oscillator.frequency.value = 880;
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();

    const beep = () => {
      if (!this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;
      const g = this.gainNode.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(0, now);
      g.linearRampToValueAtTime(0.25, now + 0.02);
      g.setValueAtTime(0.25, now + 0.18);
      g.linearRampToValueAtTime(0, now + 0.22);
    };

    beep();
    this.timerId = window.setInterval(beep, 600);
  }

  stop(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    try {
      this.oscillator?.stop();
    } catch {
      // already stopped
    }
    this.oscillator?.disconnect();
    this.gainNode?.disconnect();
    this.ctx?.close().catch(() => {});
    this.oscillator = null;
    this.gainNode = null;
    this.ctx = null;
  }
}
