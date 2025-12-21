/**
 * GameHeader component - displays station info and journey progress
 */

import { STATIONS } from "@/lib/constants";
import { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SoundToggle } from "./SoundToggle";

interface GameHeaderProps {
  currentStation: number;
  playerDestination: number;
  difficulty: Difficulty;
}

const DIFFICULTY_BADGE_STYLES: Record<Difficulty, string> = {
  easy: "bg-green-100 text-green-800",
  normal: "bg-blue-100 text-blue-800",
  rush: "bg-red-100 text-red-800",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  normal: "Normal",
  rush: "Rush Hour",
};

export function GameHeader({ currentStation, playerDestination, difficulty }: GameHeaderProps) {
  const currentStationName = STATIONS[currentStation];
  const destinationName = STATIONS[playerDestination];
  const remainingStations = playerDestination - currentStation;

  // Determine next station display
  const isAtMumbaiCentral = currentStation === STATIONS.length - 2;
  const nextStationText = isAtMumbaiCentral
    ? "Final: Dadar"
    : `Next: ${STATIONS[currentStation + 1]}`;

  return (
    <div className="rounded-lg bg-slate-100 p-4" data-testid="game-header">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800" data-testid="current-station">
            {currentStationName}
          </h1>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p data-testid="next-station">{nextStationText}</p>
            <p data-testid="destination">Your destination: {destinationName}</p>
            <p data-testid="remaining-stations">
              {remainingStations} station{remainingStations !== 1 ? "s" : ""} remaining
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            data-testid="difficulty-badge"
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              DIFFICULTY_BADGE_STYLES[difficulty]
            )}
          >
            {DIFFICULTY_LABELS[difficulty]}
          </span>
          <SoundToggle />
        </div>
      </div>
    </div>
  );
}
