/**
 * ActionBar component - displays remaining actions for the current turn
 * Shows 2 action dots that dim as actions are used
 */

interface ActionBarProps {
  actionsRemaining: number;
  maxActions?: number;
}

export function ActionBar({ actionsRemaining, maxActions = 2 }: ActionBarProps) {
  return (
    <div
      className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md"
      data-testid="action-bar"
    >
      <span className="text-xs font-medium text-stone-600">Actions:</span>
      <div className="flex gap-1">
        {Array.from({ length: maxActions }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < actionsRemaining ? "bg-amber-400 shadow-sm" : "bg-stone-300"
            }`}
            data-testid={`action-dot-${i}`}
            aria-label={i < actionsRemaining ? "Action available" : "Action used"}
          />
        ))}
      </div>
      {actionsRemaining === 0 && <span className="text-xs text-stone-500 ml-1">Ready!</span>}
    </div>
  );
}
