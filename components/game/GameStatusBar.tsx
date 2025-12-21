/**
 * GameStatusBar component - displays seat availability and journey status
 * Shows empty seats count, waiting passengers, and stops remaining
 */

interface GameStatusBarProps {
  emptySeatsCount: number;
  standingNPCsCount: number;
  stopsRemaining: number;
}

export function GameStatusBar({
  emptySeatsCount,
  standingNPCsCount,
  stopsRemaining,
}: GameStatusBarProps) {
  return (
    <div className="mt-4 flex justify-between items-center text-sm" data-testid="game-status-bar">
      <div className="flex gap-4">
        <span
          className={`px-3 py-1 rounded-full font-medium ${
            emptySeatsCount > 0 ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"
          }`}
          data-testid="empty-seats-count"
        >
          {emptySeatsCount} empty seat{emptySeatsCount !== 1 ? "s" : ""}
        </span>
        <span
          className="px-3 py-1 rounded-full bg-stone-200 text-stone-700 font-medium"
          data-testid="standing-count"
        >
          {standingNPCsCount} waiting
        </span>
      </div>
      <span className="text-stone-600" data-testid="stops-remaining">
        {stopsRemaining} stop{stopsRemaining !== 1 ? "s" : ""} left
      </span>
    </div>
  );
}
