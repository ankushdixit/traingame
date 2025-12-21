"use client";

/**
 * GameEndModal component - displays enhanced win/lose screen as an overlay
 * Matches single-shot design with celebratory styling
 */

import { useState, useCallback, useEffect } from "react";
import { WinScene } from "./WinScene";
import { LoseScene } from "./LoseScene";
import { Difficulty } from "@/lib/types";
import { useSound } from "@/contexts/SoundContext";

interface GameEndModalProps {
  status: "won" | "lost";
  destination: string;
  stationsStanding: number;
  totalStations: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
}

export function GameEndModal({
  status,
  destination,
  stationsStanding,
  totalStations,
  difficulty,
  onPlayAgain,
}: GameEndModalProps) {
  const [showAnimation, setShowAnimation] = useState(true);
  const { playSound } = useSound();
  const isWin = status === "won";

  // Play win/lose sound when modal appears
  useEffect(() => {
    if (isWin) {
      playSound("winJingle");
    } else {
      playSound("loseSound");
    }
  }, [isWin, playSound]);

  const handleSkipAnimation = useCallback(() => {
    setShowAnimation(false);
  }, []);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      data-testid="game-end-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-end-title"
      onClick={handleSkipAnimation}
    >
      <div
        className="animate-in fade-in zoom-in duration-300 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8"
        onClick={handleContentClick}
      >
        {isWin ? (
          <WinScene
            destination={destination}
            stationsStanding={stationsStanding}
            difficulty={difficulty}
            showConfetti={showAnimation}
          />
        ) : (
          <LoseScene
            destination={destination}
            stationsStanding={stationsStanding}
            totalStations={totalStations}
            difficulty={difficulty}
          />
        )}

        <button
          onClick={onPlayAgain}
          className={`mt-6 w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isWin
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-600"
              : "bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500"
          }`}
          data-testid="play-again-button"
        >
          {isWin ? "🎉 Play Again" : "🔄 Try Again"}
        </button>
      </div>
    </div>
  );
}
