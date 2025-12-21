"use client";

/**
 * GameEndModal component - displays enhanced win/lose screen as an overlay
 */

import { useState, useCallback } from "react";
import { WinScene } from "./WinScene";
import { LoseScene } from "./LoseScene";
import { Difficulty } from "@/lib/types";

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
  const isWin = status === "won";

  const handleSkipAnimation = useCallback(() => {
    setShowAnimation(false);
  }, []);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      data-testid="game-end-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-end-title"
      onClick={handleSkipAnimation}
    >
      <div
        className="animate-fade-in-up max-w-md rounded-lg bg-white p-8"
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
          className="mt-4 w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white hover:bg-blue-600"
          data-testid="play-again-button"
        >
          {isWin ? "Play Again" : "Try Again"}
        </button>
      </div>
    </div>
  );
}
