/**
 * Sound Manager - handles audio playback for game events
 */

export type SoundName =
  | "trainMoving"
  | "trainStopping"
  | "doorClose"
  | "announcement"
  | "seatClick"
  | "seatClaim"
  | "winJingle"
  | "loseSound"
  | "npcGrab";

interface SoundConfig {
  src: string;
  volume: number;
}

const SOUND_CONFIG: Record<SoundName, SoundConfig> = {
  trainMoving: { src: "/sounds/train-moving.mp3", volume: 0.3 },
  trainStopping: { src: "/sounds/train-stopping.mp3", volume: 0.4 },
  doorClose: { src: "/sounds/door-close.mp3", volume: 0.5 },
  announcement: { src: "/sounds/announcement.mp3", volume: 0.6 },
  seatClick: { src: "/sounds/seat-click.mp3", volume: 0.2 },
  seatClaim: { src: "/sounds/seat-claim.mp3", volume: 0.5 },
  winJingle: { src: "/sounds/win-jingle.mp3", volume: 0.6 },
  loseSound: { src: "/sounds/lose-sound.mp3", volume: 0.5 },
  npcGrab: { src: "/sounds/npc-grab.mp3", volume: 0.4 },
};

export class SoundManager {
  private sounds: Map<SoundName, HTMLAudioElement> = new Map();
  private muted: boolean = false;
  private currentlyPlaying: Set<SoundName> = new Set();
  private maxConcurrent: number = 3;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.preloadSounds();
    }
  }

  private preloadSounds(): void {
    Object.entries(SOUND_CONFIG).forEach(([name, config]) => {
      const audio = new Audio(config.src);
      audio.volume = config.volume;
      audio.preload = "auto";
      this.sounds.set(name as SoundName, audio);
    });
    this.initialized = true;
  }

  play(name: SoundName): void {
    if (this.muted) return;
    if (!this.initialized) return;
    if (this.currentlyPlaying.size >= this.maxConcurrent) return;

    const sound = this.sounds.get(name);
    if (!sound) return;

    // Clone for overlapping plays of same sound
    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = SOUND_CONFIG[name].volume;

    this.currentlyPlaying.add(name);
    clone.play().catch(() => {
      // Ignore autoplay errors - browser may block until user interaction
      this.currentlyPlaying.delete(name);
    });

    clone.onended = () => {
      this.currentlyPlaying.delete(name);
    };
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      // Stop all currently playing sounds
      this.sounds.forEach((sound) => {
        sound.pause();
        sound.currentTime = 0;
      });
      this.currentlyPlaying.clear();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getCurrentlyPlayingCount(): number {
    return this.currentlyPlaying.size;
  }

  getMaxConcurrent(): number {
    return this.maxConcurrent;
  }
}

// Singleton instance for use throughout the app
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (typeof window === "undefined") {
    // Return a no-op instance for SSR
    return new SoundManager();
  }
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

// Export for testing purposes
export { SOUND_CONFIG };
