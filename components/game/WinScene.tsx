"use client";

/**
 * WinScene component - celebration animation for win screen
 * Matches single-shot design with large emoji and minimal text
 */

import { Confetti } from "./Confetti";
import { PlayerCharacterHappy } from "./characters/PlayerCharacterHappy";
import { Difficulty, DIFFICULTY_OPTIONS } from "@/lib/types";

interface WinSceneProps {
  destination: string;
  stationsStanding: number;
  difficulty: Difficulty;
  showConfetti?: boolean;
}

export function WinScene({
  destination,
  stationsStanding,
  difficulty,
  showConfetti = true,
}: WinSceneProps) {
  const difficultyOption = DIFFICULTY_OPTIONS.find((o) => o.value === difficulty);

  return (
    <div className="text-center" data-testid="win-scene">
      {showConfetti && <Confetti isActive={true} />}

      {/* Celebration emoji */}
      <div className="text-7xl mb-4 animate-bounce">🎉</div>

      <h1
        id="game-end-title"
        className="text-3xl font-bold text-emerald-600 mb-2"
        data-testid="game-end-title"
      >
        You Found a Seat!
      </h1>

      <p className="text-stone-600 mb-4" data-testid="game-end-message">
        Now you can ride to {destination} in comfort!
      </p>

      {/* Character and stats */}
      <div className="flex items-center justify-center gap-4 bg-emerald-50 rounded-xl p-4">
        <div className="w-16 h-20" data-testid="win-character">
          <PlayerCharacterHappy />
        </div>
        <div className="text-left">
          <p className="text-sm text-stone-600">
            Stood for <span className="font-bold text-emerald-600">{stationsStanding}</span> station
            {stationsStanding !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-stone-500">
            {difficultyOption?.emoji} {difficultyOption?.label} mode
          </p>
        </div>
      </div>
    </div>
  );
}
