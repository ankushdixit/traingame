/**
 * PlayerStatus component - displays whether player is standing or seated
 */

interface PlayerStatusProps {
  isSeated: boolean;
}

export function PlayerStatus({ isSeated }: PlayerStatusProps) {
  return (
    <div
      className={`rounded-lg p-4 text-center ${
        isSeated ? "bg-yellow-100 text-yellow-800" : "bg-orange-100 text-orange-800"
      }`}
      data-testid="player-status"
    >
      {isSeated ? (
        <p className="font-bold" data-testid="seated-status">
          You are seated!
        </p>
      ) : (
        <p className="font-bold" data-testid="standing-status">
          You are standing
        </p>
      )}
    </div>
  );
}
