// Sounds synthesized with WebAudio: no files to download. Everything routes through one gain so a
// single toggle mutes the table. Audio starts on the first user gesture, as browsers require.
export type Sfx = 'deal' | 'flip' | 'chip' | 'chips' | 'fold' | 'allin' | 'win' | 'tick';

export class TableAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: AudioBufferSourceNode | null = null;
  private noise: AudioBuffer | null = null;
  enabled = true;

  constructor() {
    const unlock = () => {
      this.ensure();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (this.master) this.master.gain.setTargetAtTime(on ? 1 : 0, this.ctx!.currentTime, 0.05);
    if (on) this.startAmbient();
  }

  private ensure(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    }
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.enabled ? 1 : 0;
    this.master.connect(this.ctx.destination);
    const len = this.ctx.sampleRate * 2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    this.startAmbient();
    return this.ctx;
  }

  private startAmbient(): void {
    const ctx = this.ctx;
    if (!ctx || !this.noise || !this.master || this.ambient || !this.enabled) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;
    const gain = ctx.createGain();
    gain.gain.value = 0.035;
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    this.ambient = src;
  }

  play(sfx: Sfx, volume = 1): void {
    const ctx = this.ensure();
    if (!ctx || !this.master || !this.enabled) return;
    const t = ctx.currentTime;
    switch (sfx) {
      case 'deal':
        this.burst(t, 0.06, 1800, 0.25 * volume, 'bandpass');
        break;
      case 'flip':
        this.burst(t, 0.05, 2600, 0.18 * volume, 'bandpass');
        this.burst(t + 0.04, 0.08, 900, 0.12 * volume, 'lowpass');
        break;
      case 'fold':
        this.burst(t, 0.12, 700, 0.14 * volume, 'lowpass');
        break;
      case 'chip':
        this.ping(t, 2200 + Math.random() * 600, 0.08, 0.22 * volume);
        this.ping(t + 0.015, 3400 + Math.random() * 800, 0.05, 0.1 * volume);
        break;
      case 'chips':
        for (let i = 0; i < 6; i++) this.ping(t + i * 0.035 + Math.random() * 0.01, 1900 + Math.random() * 1500, 0.07, 0.14 * volume);
        this.burst(t, 0.25, 1200, 0.08 * volume, 'bandpass');
        break;
      case 'allin':
        for (let i = 0; i < 14; i++) this.ping(t + i * 0.03, 1800 + Math.random() * 1800, 0.08, 0.13 * volume);
        this.burst(t, 0.45, 1000, 0.1 * volume, 'bandpass');
        break;
      case 'win':
        for (let i = 0; i < 10; i++) this.ping(t + i * 0.04, 2000 + Math.random() * 1400, 0.09, 0.12 * volume);
        this.tone(t, 523, 0.18, 0.05 * volume);
        this.tone(t + 0.12, 659, 0.18, 0.05 * volume);
        this.tone(t + 0.24, 784, 0.3, 0.06 * volume);
        break;
      case 'tick':
        this.ping(t, 1200, 0.03, 0.08 * volume);
        break;
    }
  }

  private burst(t: number, dur: number, freq: number, vol: number, type: BiquadFilterType): void {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise!;
    src.playbackRate.value = 1 + Math.random() * 0.2;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(gain).connect(this.master!);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
  }

  private ping(t: number, freq: number, dur: number, vol: number): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private tone(t: number, freq: number, dur: number, vol: number): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }
}
