"use client";

/**
 * Sound Context - provides sound controls and playback functions to the app
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { getSoundManager, SoundName } from "@/lib/soundManager";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (name: SoundName) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

interface SoundProviderProps {
  children: ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps) {
  const [isMuted, setIsMuted] = useState(false);

  // Initialize sound manager on mount
  useEffect(() => {
    const manager = getSoundManager();
    manager.setMuted(isMuted);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev;
      const manager = getSoundManager();
      manager.setMuted(newValue);
      return newValue;
    });
  }, []);

  const playSound = useCallback((name: SoundName) => {
    const manager = getSoundManager();
    manager.play(name);
  }, []);

  const value = useMemo(
    () => ({
      isMuted,
      toggleMute,
      playSound,
    }),
    [isMuted, toggleMute, playSound]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextType {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}

// Re-export SoundName for convenience
export type { SoundName };
