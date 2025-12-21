"use client";

/**
 * WinScene component - celebration animation and happy character for win screen
 */

import { Confetti } from "./Confetti";
import { GameStats } from "./GameStats";
import { PlayerCharacterHappy } from "./characters/PlayerCharacterHappy";
import { Difficulty } from "@/lib/types";

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
  return (
    <div className="text-center" data-testid="win-scene">
      {showConfetti && <Confetti isActive={true} />}

      {/* Happy character illustration */}
      <div className="mx-auto mb-4 h-32 w-32" data-testid="win-character">
        <PlayerCharacterHappy />
      </div>

      <h1
        id="game-end-title"
        className="animate-celebrate mb-4 text-4xl font-bold text-green-600"
        data-testid="game-end-title"
      >
        You Won!
      </h1>

      <p className="mb-4 text-lg text-gray-700" data-testid="game-end-message">
        You found a seat before reaching {destination}!
      </p>

      <GameStats stationsStanding={stationsStanding} difficulty={difficulty} isWin={true} />
    </div>
  );
}
