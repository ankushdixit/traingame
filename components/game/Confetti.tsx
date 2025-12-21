"use client";

/**
 * Confetti component - CSS-only celebration animation for win screen
 */

const CONFETTI_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
];

interface ConfettiProps {
  isActive?: boolean;
}

export function Confetti({ isActive = true }: ConfettiProps) {
  if (!isActive) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      data-testid="confetti-container"
      aria-hidden="true"
    >
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="animate-confetti absolute h-3 w-3"
          data-testid="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
