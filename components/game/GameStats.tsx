/**
 * GameStats component - displays game statistics on win/lose screens
 */

import { Difficulty } from "@/lib/types";
import { DIFFICULTY_CONFIGS } from "@/lib/constants";

interface GameStatsProps {
  stationsStanding: number;
  difficulty: Difficulty;
  isWin: boolean;
}

export function GameStats({ stationsStanding, difficulty, isWin }: GameStatsProps) {
  const difficultyDisplay = DIFFICULTY_CONFIGS[difficulty].displayName;

  return (
    <div className="mb-4 rounded-lg bg-gray-100 p-3 text-sm" data-testid="game-stats">
      <div className="flex justify-between" data-testid="stats-difficulty">
        <span className="text-gray-600">Difficulty:</span>
        <span className="font-medium capitalize">{difficultyDisplay}</span>
      </div>
      <div className="flex justify-between" data-testid="stats-stations">
        <span className="text-gray-600">Stations Standing:</span>
        <span className="font-medium">{stationsStanding}</span>
      </div>
      {isWin && (
        <div className="flex justify-between text-green-600" data-testid="stats-status">
          <span>Status:</span>
          <span className="font-medium">Seated!</span>
        </div>
      )}
    </div>
  );
}
