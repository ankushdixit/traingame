/**
 * StationMarker component - individual station dot/marker on journey track
 */

import { cn } from "@/lib/utils";

export interface StationMarkerProps {
  name: string;
  isCurrent: boolean;
  isDestination: boolean;
  isPassed: boolean;
  isBoarding: boolean;
  isUrgent: boolean;
}

/**
 * Returns the appropriate color classes based on marker state.
 * Priority: current > destination > passed > future
 */
function getMarkerColorClasses(
  isCurrent: boolean,
  isDestination: boolean,
  isPassed: boolean
): string {
  if (isCurrent) {
    return "border-blue-600 bg-blue-500 shadow-lg";
  }
  if (isDestination) {
    return "border-green-600 bg-green-500";
  }
  if (isPassed) {
    return "border-gray-400 bg-gray-300";
  }
  return "border-gray-400 bg-white";
}

export function StationMarker({
  name,
  isCurrent,
  isDestination,
  isPassed,
  isBoarding,
  isUrgent,
}: StationMarkerProps) {
  const baseClasses = "relative z-10 flex flex-col items-center";

  const markerClasses = cn(
    "flex items-center justify-center rounded-full border-2 transition-all",
    isCurrent ? "h-8 w-8" : "h-4 w-4",
    getMarkerColorClasses(isCurrent, isDestination, isPassed),
    isUrgent && "animate-urgent ring-2 ring-red-400"
  );

  const showLabel = isCurrent || isDestination || isBoarding;
  const showFlag = isDestination && !isCurrent;

  return (
    <div className={baseClasses} title={name} data-testid="station-marker">
      <div
        className={markerClasses}
        data-testid="marker-dot"
        data-current={isCurrent}
        data-destination={isDestination}
        data-passed={isPassed}
        data-urgent={isUrgent}
      >
        {showFlag && (
          <span className="text-xs" role="img" aria-label="destination flag">
            🚩
          </span>
        )}
        {isCurrent && (
          <span className="text-sm" role="img" aria-label="train">
            🚂
          </span>
        )}
      </div>
      {showLabel && (
        <span
          className="mt-1 max-w-16 truncate text-center text-xs whitespace-nowrap"
          data-testid="station-label"
        >
          {name}
        </span>
      )}
    </div>
  );
}
