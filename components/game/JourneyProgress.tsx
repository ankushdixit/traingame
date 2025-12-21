/**
 * JourneyProgress component - visual representation of the player's journey
 * Shows all stations as markers on a horizontal track with the current station highlighted.
 */

import { StationMarker } from "./StationMarker";

export interface JourneyProgressProps {
  stations: readonly string[];
  currentStation: number;
  destination: number;
  boardingStation: number;
}

export function JourneyProgress({
  stations,
  currentStation,
  destination,
  boardingStation,
}: JourneyProgressProps) {
  // Urgency indicator when 1 station away from destination
  const isUrgent = destination - currentStation === 1;

  return (
    <div
      className="w-full max-w-2xl px-4 py-3"
      data-testid="journey-progress"
      aria-label="Journey progress indicator"
    >
      <div className="relative flex items-center justify-between">
        {/* Track line - runs behind all station markers */}
        <div
          className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 bg-gray-300"
          data-testid="track-line"
          aria-hidden="true"
        />

        {/* Progress line - shows completed portion of journey */}
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-blue-400 transition-all duration-500"
          style={{
            width: `${(currentStation / (stations.length - 1)) * 100}%`,
          }}
          data-testid="progress-line"
          aria-hidden="true"
        />

        {/* Station markers */}
        {stations.map((station, index) => (
          <StationMarker
            key={station}
            name={station}
            isCurrent={index === currentStation}
            isDestination={index === destination}
            isPassed={index < currentStation}
            isBoarding={index === boardingStation}
            isUrgent={isUrgent && index === destination}
          />
        ))}
      </div>

      {/* Urgency message */}
      {isUrgent && (
        <p
          className="mt-2 text-center text-sm font-medium text-red-600 animate-pulse"
          data-testid="urgency-message"
        >
          ⚠️ Next stop is your destination!
        </p>
      )}
    </div>
  );
}
