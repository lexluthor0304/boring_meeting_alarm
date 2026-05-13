export type SilenceDetectorOptions = {
  stream: MediaStream;
  thresholdDb: number;
  durationSec: number;
  onLevel: (db: number) => void;
  onSilenceDetected: () => void;
};

const CHECK_INTERVAL_MS = 200;
const MIN_DB = -100;

export class SilenceDetector {
  private readonly ctx: AudioContext;
  private readonly source: MediaStreamAudioSourceNode;
  private readonly analyser: AnalyserNode;
  private readonly buffer: Float32Array<ArrayBuffer>;
  private readonly opts: SilenceDetectorOptions;

  private timerId: number | null = null;
  private silenceStartedAt: number | null = null;
  private fired = false;

  constructor(opts: SilenceDetectorOptions) {
    this.opts = opts;
    this.ctx = new AudioContext();
    this.source = this.ctx.createMediaStreamSource(opts.stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.4;
    this.source.connect(this.analyser);
    // Intentionally NOT connecting to destination — we don't want to echo
    // the meeting audio back through the user's speakers.
    this.buffer = new Float32Array(new ArrayBuffer(this.analyser.fftSize * Float32Array.BYTES_PER_ELEMENT));
  }

  start(): void {
    if (this.timerId !== null) return;
    this.timerId = window.setInterval(() => this.tick(), CHECK_INTERVAL_MS);
  }

  stop(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    try {
      this.source.disconnect();
      this.analyser.disconnect();
    } catch {
      // ignore
    }
    this.ctx.close().catch(() => {});
  }

  private tick(): void {
    this.analyser.getFloatTimeDomainData(this.buffer);
    let sumSquares = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      const v = this.buffer[i] ?? 0;
      sumSquares += v * v;
    }
    const rms = Math.sqrt(sumSquares / this.buffer.length);
    const db = rms > 0 ? 20 * Math.log10(rms) : MIN_DB;
    this.opts.onLevel(db);

    if (this.fired) return;

    const now = Date.now();
    if (db < this.opts.thresholdDb) {
      if (this.silenceStartedAt === null) this.silenceStartedAt = now;
      if (now - this.silenceStartedAt >= this.opts.durationSec * 1000) {
        this.fired = true;
        this.opts.onSilenceDetected();
      }
    } else {
      this.silenceStartedAt = null;
    }
  }
}
