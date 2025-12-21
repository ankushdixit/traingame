/**
 * GameHeader component - displays station info and game status
 * Rose gradient bar matching single-shot design
 */

import { STATIONS } from "@/lib/constants";
import { Difficulty, DIFFICULTY_OPTIONS } from "@/lib/types";
import { SoundToggle } from "./SoundToggle";

interface GameHeaderProps {
  currentStation: number;
  playerDestination: number;
  playerSeated: boolean;
  difficulty: Difficulty;
}

export function GameHeader({
  currentStation,
  playerDestination: _playerDestination,
  playerSeated,
  difficulty,
}: GameHeaderProps) {
  const currentStationName = STATIONS[currentStation];
  const difficultyOption = DIFFICULTY_OPTIONS.find((o) => o.value === difficulty);

  return (
    <div
      className="bg-gradient-to-r from-rose-700 to-rose-800 text-white py-4 px-4 shadow-lg"
      data-testid="game-header"
    >
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold" data-testid="game-title">
            Mumbai Local
          </h1>
          <p className="text-rose-200 text-sm" data-testid="difficulty-display">
            {difficultyOption?.emoji} {difficultyOption?.label}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold" data-testid="current-station">
              {currentStationName}
            </div>
            <div className="text-rose-200 text-sm" data-testid="player-status">
              {playerSeated ? "✅ Seated" : "🧍 Standing"}
            </div>
          </div>
          <SoundToggle />
        </div>
      </div>
    </div>
  );
}
