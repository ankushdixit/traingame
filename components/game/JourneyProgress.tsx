/**
 * JourneyProgress component - visual representation of the player's journey
 * Shows all stations as markers on a horizontal track with the current station highlighted.
 * Matches single-shot design with emerald progress fill.
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
}

function getStationDotClasses(props: StationDotProps): string {
  const { isCurrent, isPassed, isDestination, isUrgent } = props;
  const base =
    "w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-[8px]";

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
  const { isCurrent, isPassed, isDestination } = props;
  const base = "mt-1 text-xs font-medium text-center max-w-[60px] leading-tight";

  if (isDestination) {
    return `${base} text-red-600 font-bold`;
  }
  if (isCurrent) {
    return `${base} text-blue-600 font-bold`;
  }
  if (isPassed) {
    return `${base} text-stone-400`;
  }
  return `${base} text-stone-600`;
}

function StationDot(props: StationDotProps) {
  const { index, station, isCurrent, isDestination, isBoarding } = props;

  return (
    <div className="flex flex-col items-center">
      <div className={getStationDotClasses(props)} data-testid={`station-dot-${index}`}>
        {isCurrent && <span>🚃</span>}
        {isDestination && !isCurrent && <span>🚩</span>}
      </div>
      <span className={getStationNameClasses(props)}>{station}</span>
      {isBoarding && <span className="text-[10px] text-emerald-600">📍 Start</span>}
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

  return (
    <div
      className="w-full px-4 py-3"
      data-testid="journey-progress"
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
          />
        ))}
      </div>
    </div>
  );
}
