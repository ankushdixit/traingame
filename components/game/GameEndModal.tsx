"use client";

/**
 * GameEndModal component - displays win/lose screen as an overlay
 */

interface GameEndModalProps {
  status: "won" | "lost";
  destination: string;
  onPlayAgain: () => void;
}

export function GameEndModal({ status, destination, onPlayAgain }: GameEndModalProps) {
  const isWin = status === "won";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      data-testid="game-end-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-end-title"
    >
      <div className="max-w-md rounded-lg bg-white p-8 text-center">
        <h1
          id="game-end-title"
          className={`mb-4 text-4xl font-bold ${isWin ? "text-green-600" : "text-red-600"}`}
          data-testid="game-end-title"
        >
          {isWin ? "You Won!" : "You Lost!"}
        </h1>
        <p className="mb-6 text-lg" data-testid="game-end-message">
          {isWin
            ? `You found a seat before reaching ${destination}!`
            : `You arrived at ${destination} still standing!`}
        </p>
        <button
          onClick={onPlayAgain}
          className="rounded-lg bg-blue-500 px-6 py-3 font-bold text-white hover:bg-blue-600"
          data-testid="play-again-button"
        >
          {isWin ? "Play Again" : "Try Again"}
        </button>
      </div>
    </div>
  );
}
