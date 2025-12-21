/**
 * Tests for SoundManager
 */

import { SoundManager, SoundName, SOUND_CONFIG, getSoundManager } from "../soundManager";

// Mock HTMLAudioElement
class MockAudio {
  src: string = "";
  volume: number = 1;
  preload: string = "auto";
  currentTime: number = 0;
  onended: (() => void) | null = null;
  paused: boolean = true;

  constructor(src?: string) {
    if (src) {
      this.src = src;
    }
  }

  play(): Promise<void> {
    this.paused = false;
    return Promise.resolve();
  }

  pause(): void {
    this.paused = true;
  }

  cloneNode(): MockAudio {
    const clone = new MockAudio(this.src);
    clone.volume = this.volume;
    return clone;
  }
}

// Setup global Audio mock
const originalAudio = global.Audio;

beforeAll(() => {
  global.Audio = jest
    .fn()
    .mockImplementation((src?: string) => new MockAudio(src)) as unknown as typeof Audio;
});

afterAll(() => {
  global.Audio = originalAudio;
});

describe("SoundManager", () => {
  let soundManager: SoundManager;

  beforeEach(() => {
    soundManager = new SoundManager();
  });

  describe("initialization", () => {
    it("preloads all sounds on creation", () => {
      expect(soundManager.isInitialized()).toBe(true);
    });

    it("starts unmuted", () => {
      expect(soundManager.isMuted()).toBe(false);
    });

    it("starts with zero sounds playing", () => {
      expect(soundManager.getCurrentlyPlayingCount()).toBe(0);
    });

    it("has a max concurrent sound limit of 3", () => {
      expect(soundManager.getMaxConcurrent()).toBe(3);
    });
  });

  describe("play", () => {
    it("plays a sound when not muted", () => {
      const playSpy = jest.spyOn(MockAudio.prototype, "play");
      soundManager.play("seatClick");
      expect(playSpy).toHaveBeenCalled();
      playSpy.mockRestore();
    });

    it("does not play sound when muted", () => {
      const playSpy = jest.spyOn(MockAudio.prototype, "play");
      soundManager.setMuted(true);
      soundManager.play("seatClick");
      expect(playSpy).not.toHaveBeenCalled();
      playSpy.mockRestore();
    });

    it("tracks currently playing sounds", () => {
      soundManager.play("seatClick");
      expect(soundManager.getCurrentlyPlayingCount()).toBe(1);
    });

    it("handles play errors gracefully", async () => {
      const playSpy = jest
        .spyOn(MockAudio.prototype, "play")
        .mockRejectedValue(new Error("Autoplay blocked"));

      // Should not throw
      expect(() => soundManager.play("seatClick")).not.toThrow();

      // Wait for the rejected promise
      await Promise.resolve();

      playSpy.mockRestore();
    });
  });

  describe("muting", () => {
    it("can be muted", () => {
      soundManager.setMuted(true);
      expect(soundManager.isMuted()).toBe(true);
    });

    it("can be unmuted", () => {
      soundManager.setMuted(true);
      soundManager.setMuted(false);
      expect(soundManager.isMuted()).toBe(false);
    });

    it("stops all sounds when muted", () => {
      const pauseSpy = jest.spyOn(MockAudio.prototype, "pause");
      soundManager.play("seatClick");
      soundManager.setMuted(true);
      expect(pauseSpy).toHaveBeenCalled();
      pauseSpy.mockRestore();
    });

    it("clears currently playing count when muted", () => {
      soundManager.play("seatClick");
      soundManager.setMuted(true);
      expect(soundManager.getCurrentlyPlayingCount()).toBe(0);
    });
  });

  describe("concurrent sound limit", () => {
    it("allows up to max concurrent sounds", () => {
      soundManager.play("seatClick");
      soundManager.play("doorClose");
      soundManager.play("announcement");
      expect(soundManager.getCurrentlyPlayingCount()).toBe(3);
    });

    it("blocks additional sounds when limit reached", () => {
      const playSpy = jest.spyOn(MockAudio.prototype, "play");

      soundManager.play("seatClick");
      soundManager.play("doorClose");
      soundManager.play("announcement");

      const callCount = playSpy.mock.calls.length;

      soundManager.play("winJingle");

      // Should not have called play again
      expect(playSpy.mock.calls.length).toBe(callCount);

      playSpy.mockRestore();
    });
  });
});

describe("SOUND_CONFIG", () => {
  it("has configuration for all sound names", () => {
    const expectedSounds: SoundName[] = [
      "trainMoving",
      "trainStopping",
      "doorClose",
      "announcement",
      "seatClick",
      "seatClaim",
      "winJingle",
      "loseSound",
      "npcGrab",
    ];

    expectedSounds.forEach((sound) => {
      expect(SOUND_CONFIG[sound]).toBeDefined();
      expect(SOUND_CONFIG[sound].src).toBeTruthy();
      expect(typeof SOUND_CONFIG[sound].volume).toBe("number");
    });
  });

  it("has valid volume levels (0-1) for all sounds", () => {
    Object.values(SOUND_CONFIG).forEach((config) => {
      expect(config.volume).toBeGreaterThanOrEqual(0);
      expect(config.volume).toBeLessThanOrEqual(1);
    });
  });

  it("has valid file paths for all sounds", () => {
    Object.values(SOUND_CONFIG).forEach((config) => {
      expect(config.src).toMatch(/^\/sounds\/.+\.mp3$/);
    });
  });
});

describe("getSoundManager", () => {
  it("returns a SoundManager instance", () => {
    const manager = getSoundManager();
    expect(manager).toBeInstanceOf(SoundManager);
  });

  it("returns the same instance on multiple calls (singleton)", () => {
    const manager1 = getSoundManager();
    const manager2 = getSoundManager();
    expect(manager1).toBe(manager2);
  });
});
