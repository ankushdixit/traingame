/**
 * JourneyProgress component - visual representation of the player's journey
 * Shows all stations as markers on a horizontal track with the current station highlighted.
 * Matches single-shot design with emerald progress fill.
 * Scales for variable station counts (6 for short, 15 for full line).
 */

export interface JourneyProgressProps {
  stations: readonly string[];
  currentStation: number;
  destination: number;
  boardingStation: number;
  isAnimating?: boolean;
  /** Target station to animate towards (used during transition) */
  targetStation?: number;
}

interface StationDotProps {
  index: number;
  station: string;
  isCurrent: boolean;
  isPassed: boolean;
  isDestination: boolean;
  isBoarding: boolean;
  isUrgent: boolean;
  compact: boolean;
}

function getStationDotClasses(props: StationDotProps): string {
  const { isCurrent, isPassed, isDestination, isUrgent, compact } = props;
  const size = compact ? "w-3 h-3" : "w-4 h-4";
  const base = `${size} rounded-full transition-all duration-300 flex items-center justify-center text-[8px]`;

  if (isCurrent) {
    return `${base} bg-blue-500 ring-4 ring-blue-200 ${isUrgent ? "animate-pulse ring-red-200" : ""}`;
  }
  if (isPassed) {
    return `${base} bg-emerald-500`;
  }
  if (isDestination) {
    return `${base} bg-red-500 ring-2 ring-red-200`;
  }
  return `${base} bg-stone-300`;
}

function getStationNameClasses(props: StationDotProps): string {
  const { isCurrent, isPassed, isDestination, compact } = props;
  const base = compact
    ? "mt-1 text-[10px] font-medium text-center max-w-[50px] leading-tight break-words"
    : "mt-1 text-xs font-medium text-center max-w-[70px] leading-tight break-words";

  if (isDestination) return `${base} text-red-600 font-bold`;
  if (isCurrent) return `${base} text-blue-600 font-bold`;
  if (isPassed) return `${base} text-stone-400`;
  return `${base} text-stone-600`;
}

function getStationIcon(isCurrent: boolean, isDestination: boolean, compact: boolean): string {
  if (compact) return "";
  if (isCurrent) return "🚃";
  if (isDestination) return "🚩";
  return "";
}

// eslint-disable-next-line complexity
function StationDot(props: StationDotProps) {
  const { index, station, isCurrent, isDestination, isBoarding, compact } = props;
  const showLabel = !compact || isCurrent || isDestination || isBoarding;
  const icon = getStationIcon(isCurrent, isDestination && !isCurrent, compact);

  return (
    <div className="flex flex-col items-center group relative">
      {/* Tooltip positioned ABOVE the dot for compact stations */}
      {!showLabel && (
        <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 pointer-events-none">
          <div className="bg-stone-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
            {station}
          </div>
        </div>
      )}
      <div className={getStationDotClasses(props)} data-testid={`station-dot-${index}`}>
        {icon && <span>{icon}</span>}
      </div>
      {showLabel && <span className={getStationNameClasses(props)}>{station}</span>}
      {isBoarding && showLabel && (
        <span className="text-[10px] text-emerald-600">{compact ? "📍" : "📍 Start"}</span>
      )}
    </div>
  );
}

export function JourneyProgress({
  stations,
  currentStation,
  destination,
  boardingStation,
  isAnimating = false,
  targetStation,
}: JourneyProgressProps) {
  const isUrgent = destination - currentStation === 1;

  // When animating, progress towards target station; otherwise show current
  const displayStation =
    isAnimating && targetStation !== undefined ? targetStation : currentStation;
  const progressPercent = (displayStation / (stations.length - 1)) * 100;

  // Use compact mode for more than 8 stations
  const isCompact = stations.length > 8;

  return (
    <div
      className="w-full px-4 py-3 overflow-x-auto"
      data-testid="journey-progress"
      data-compact={isCompact}
      aria-label="Journey progress indicator"
    >
      {/* Container for both progress bar and dots to ensure alignment */}
      <div className={isCompact ? "min-w-max" : ""}>
        {/* Progress bar - positioned to align with dot centers */}
        <div className="relative h-2 bg-stone-300 rounded-full mx-1.5">
          <div
            className={`absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full ${
              isAnimating
                ? "transition-all duration-[1800ms] ease-out"
                : "transition-all duration-500"
            }`}
            style={{ width: `${progressPercent}%` }}
            data-testid="progress-line"
            aria-hidden="true"
          />
        </div>

        {/* Station dots */}
        <div className="relative mt-2 flex justify-between">
          {stations.map((station, index) => (
            <StationDot
              key={station}
              index={index}
              station={station}
              isCurrent={index === currentStation}
              isPassed={index < currentStation}
              isDestination={index === destination}
              isBoarding={index === boardingStation}
              isUrgent={isUrgent}
              compact={isCompact}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
