/**
 * NextStationButton component - advances the train to the next station
 * Matches single-shot design with blue gradient
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

  return (
    <button
      onClick={onAdvance}
      disabled={disabled}
      className={`mt-6 w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
        disabled
          ? "bg-stone-300 text-stone-500 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      }`}
      data-testid="next-station-button"
    >
      {disabled ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Moving...
        </span>
      ) : (
        <>🚃 Next Station: {nextStation}</>
      )}
    </button>
  );
}
