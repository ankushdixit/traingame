/**
 * GameHeader component - displays station info and journey progress
 */

import { STATIONS } from "@/lib/constants";

interface GameHeaderProps {
  currentStation: number;
  playerDestination: number;
}

export function GameHeader({ currentStation, playerDestination }: GameHeaderProps) {
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
  );
}
