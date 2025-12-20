/**
 * NextStationButton component - advances the train to the next station
 */

import { STATIONS } from "@/lib/constants";

interface NextStationButtonProps {
  currentStation: number;
  onAdvance: () => void;
  disabled: boolean;
}

export function NextStationButton({ currentStation, onAdvance, disabled }: NextStationButtonProps) {
  const nextStationIndex = currentStation + 1;
  const nextStation = STATIONS[nextStationIndex];
  const isFinalStation = nextStationIndex >= STATIONS.length - 1;

  return (
    <button
      onClick={onAdvance}
      disabled={disabled}
      className={`rounded-lg px-6 py-3 font-medium transition-colors ${
        disabled
          ? "cursor-not-allowed bg-gray-300 text-gray-500"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
      data-testid="next-station-button"
    >
      {isFinalStation ? `Arrive at ${nextStation}` : `Next: ${nextStation}`}
    </button>
  );
}
