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
  isAnimating?: boolean;
}

export function JourneyProgress({
  stations,
  currentStation,
  destination,
  boardingStation,
  isAnimating = false,
}: JourneyProgressProps) {
  // Urgency indicator when 1 station away from destination
  const isUrgent = destination - currentStation === 1;

  // Calculate progress percentage
  const stationGap = 100 / (stations.length - 1);
  const baseProgress = (currentStation / (stations.length - 1)) * 100;
  // When animating, target the next station
  const targetProgress = isAnimating ? baseProgress + stationGap : baseProgress;

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
          className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-blue-400 ${
            isAnimating
              ? "transition-all duration-[3200ms] ease-linear"
              : "transition-all duration-300"
          }`}
          style={{
            width: `${targetProgress}%`,
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
