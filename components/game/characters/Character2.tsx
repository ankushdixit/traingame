/**
 * Character 2 - Middle-aged woman in traditional kurta
 */

interface CharacterProps {
  isSeated?: boolean;
}

export function Character2({ isSeated = true }: CharacterProps) {
  return (
    <svg
      viewBox="0 0 60 80"
      className="w-full h-full"
      aria-label="Woman wearing maroon kurta with bindi"
    >
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#C68642" />
      {/* Hair */}
      <ellipse cx="30" cy="12" rx="14" ry="10" fill="#1A1A1A" />
      <ellipse cx="18" cy="18" rx="4" ry="8" fill="#1A1A1A" />
      <ellipse cx="42" cy="18" rx="4" ry="8" fill="#1A1A1A" />
      {/* Bindi */}
      <circle cx="30" cy="12" r="2" fill="#DC2626" />
      {/* Eyes */}
      <ellipse cx="24" cy="18" rx="2" ry="1.5" fill="#2C1810" />
      <ellipse cx="36" cy="18" rx="2" ry="1.5" fill="#2C1810" />
      {/* Nose */}
      <path d="M30 20 L28 24 L30 24" fill="none" stroke="#A0522D" strokeWidth="1" />
      {/* Smile */}
      <path
        d="M25 26 Q30 29 35 26"
        fill="none"
        stroke="#8B4513"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Body - Kurta */}
      {isSeated ? (
        <>
          <rect x="14" y="34" width="32" height="30" rx="4" fill="#991B1B" />
          {/* Kurta pattern */}
          <line x1="30" y1="34" x2="30" y2="64" stroke="#7F1D1D" strokeWidth="2" />
          {/* Dupatta */}
          <path d="M12 40 Q8 50 12 60" fill="none" stroke="#FBBF24" strokeWidth="4" />
        </>
      ) : (
        <>
          <rect x="16" y="34" width="28" height="42" rx="4" fill="#991B1B" />
          {/* Kurta pattern */}
          <line x1="30" y1="34" x2="30" y2="76" stroke="#7F1D1D" strokeWidth="2" />
          {/* Dupatta */}
          <path d="M12 40 Q6 55 12 70" fill="none" stroke="#FBBF24" strokeWidth="4" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="10" cy="48" rx="5" ry="10" fill="#C68642" />
      <ellipse cx="50" cy="48" rx="5" ry="10" fill="#C68642" />
      {/* Bangles */}
      <circle cx="10" cy="54" r="3" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
      <circle cx="50" cy="54" r="3" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
    </svg>
  );
}
