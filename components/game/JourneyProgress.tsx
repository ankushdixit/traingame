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
    ? "mt-1 text-[10px] font-medium text-center max-w-[45px] leading-tight truncate"
    : "mt-1 text-xs font-medium text-center max-w-[60px] leading-tight";

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

function StationDot(props: StationDotProps) {
  const { index, station, isCurrent, isDestination, isBoarding, compact } = props;
  const showLabel = !compact || isCurrent || isDestination || isBoarding;
  const icon = getStationIcon(isCurrent, isDestination && !isCurrent, compact);

  return (
    <div className="flex flex-col items-center">
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
}: JourneyProgressProps) {
  const isUrgent = destination - currentStation === 1;
  const progressPercent = (currentStation / (stations.length - 1)) * 100;

  // Use compact mode for more than 8 stations
  const isCompact = stations.length > 8;

  return (
    <div
      className="w-full px-4 py-3 overflow-x-auto"
      data-testid="journey-progress"
      data-compact={isCompact}
      aria-label="Journey progress indicator"
    >
      <div className="relative h-2 bg-stone-300 rounded-full">
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full ${
            isAnimating
              ? "transition-all duration-[3200ms] ease-linear"
              : "transition-all duration-500"
          }`}
          style={{ width: `${progressPercent}%` }}
          data-testid="progress-line"
          aria-hidden="true"
        />
      </div>

      <div className={`relative mt-2 flex justify-between ${isCompact ? "min-w-max" : ""}`}>
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
  );
}
