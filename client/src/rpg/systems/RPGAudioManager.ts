const FADE_STEP_MS = 50;

export class RPGAudioManager {
  private currentBgmId: string | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmUrls: Map<string, string> = new Map();
  private volume = 0.7;
  private muted = false;

  registerBgmTrack(trackId: string, url: string): void {
    this.bgmUrls.set(trackId, url);
  }

  async playBgm(trackId: string, fadeInMs = 500): Promise<void> {
    if (this.currentBgmId === trackId) return;
    await this.stopBgm(200);
    const url = this.bgmUrls.get(trackId);
    if (!url) return;

    this.bgmAudio = new Audio(url);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0;
    this.currentBgmId = trackId;

    try {
      await this.bgmAudio.play();
      this.fadeVolume(this.bgmAudio, 0, this.muted ? 0 : this.volume, fadeInMs);
    } catch {
      // Autoplay blocked — user hasn't interacted yet; ignore silently
    }
  }

  async stopBgm(fadeOutMs = 300): Promise<void> {
    if (!this.bgmAudio) return;
    const audio = this.bgmAudio;
    this.bgmAudio = null;
    this.currentBgmId = null;
    await this.fadeVolume(audio, audio.volume, 0, fadeOutMs);
    audio.pause();
    audio.src = "";
  }

  async crossfadeBgm(newTrackId: string, durationMs = 400): Promise<void> {
    await this.playBgm(newTrackId, durationMs);
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.bgmAudio && !this.muted) {
      this.bgmAudio.volume = this.volume;
    }
  }

  mute(): void {
    this.muted = true;
    if (this.bgmAudio) this.bgmAudio.volume = 0;
  }

  unmute(): void {
    this.muted = false;
    if (this.bgmAudio) this.bgmAudio.volume = this.volume;
  }

  getCurrentTrack(): string | null {
    return this.currentBgmId;
  }

  private fadeVolume(
    audio: HTMLAudioElement,
    from: number,
    to: number,
    durationMs: number
  ): Promise<void> {
    return new Promise((resolve) => {
      if (durationMs <= 0) { audio.volume = to; resolve(); return; }
      const steps = Math.max(1, Math.floor(durationMs / FADE_STEP_MS));
      const stepDelta = (to - from) / steps;
      let step = 0;
      audio.volume = from;
      const interval = setInterval(() => {
        step++;
        audio.volume = Math.max(0, Math.min(1, from + stepDelta * step));
        if (step >= steps) { clearInterval(interval); resolve(); }
      }, FADE_STEP_MS);
    });
  }
}
