/**
 * Character 7 - Elderly woman (aunty) in saree
 */

interface CharacterProps {
  isSeated?: boolean;
}

export function Character7({ isSeated = true }: CharacterProps) {
  return (
    <svg
      viewBox="0 0 60 80"
      className="w-full h-full"
      aria-label="Elderly aunty wearing green saree"
    >
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#D4A574" />
      {/* Gray hair with bun */}
      <ellipse cx="30" cy="10" rx="12" ry="8" fill="#9CA3AF" />
      <circle cx="30" cy="4" r="6" fill="#9CA3AF" />
      <ellipse cx="18" cy="16" rx="3" ry="6" fill="#9CA3AF" />
      <ellipse cx="42" cy="16" rx="3" ry="6" fill="#9CA3AF" />
      {/* Bindi */}
      <circle cx="30" cy="11" r="2.5" fill="#DC2626" />
      {/* Wrinkles */}
      <path d="M22 22 L26 22" stroke="#B8860B" strokeWidth="0.5" />
      <path d="M34 22 L38 22" stroke="#B8860B" strokeWidth="0.5" />
      {/* Eyes */}
      <ellipse cx="24" cy="18" rx="1.5" ry="1" fill="#4B3621" />
      <ellipse cx="36" cy="18" rx="1.5" ry="1" fill="#4B3621" />
      {/* Gentle smile */}
      <path
        d="M26 25 Q30 28 34 25"
        fill="none"
        stroke="#8B4513"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Body - Saree */}
      {isSeated ? (
        <>
          <rect x="14" y="34" width="32" height="30" rx="4" fill="#059669" />
          {/* Saree pallu */}
          <path d="M12 36 Q8 48 14 60 L20 60 Q14 48 18 36 Z" fill="#047857" />
          {/* Saree border */}
          <rect x="14" y="60" width="32" height="4" fill="#FBBF24" />
          {/* Blouse */}
          <rect x="20" y="34" width="20" height="10" fill="#10B981" />
        </>
      ) : (
        <>
          <rect x="16" y="34" width="28" height="42" rx="4" fill="#059669" />
          {/* Saree pallu */}
          <path d="M12 36 Q6 54 14 72 L22 72 Q14 54 18 36 Z" fill="#047857" />
          {/* Saree border */}
          <rect x="16" y="72" width="28" height="4" fill="#FBBF24" />
          {/* Blouse */}
          <rect x="20" y="34" width="20" height="12" fill="#10B981" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="10" cy="48" rx="5" ry="10" fill="#D4A574" />
      <ellipse cx="50" cy="48" rx="5" ry="10" fill="#D4A574" />
      {/* Bangles */}
      <circle cx="10" cy="52" r="3" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
      <circle cx="10" cy="56" r="3" fill="none" stroke="#22C55E" strokeWidth="1.5" />
      <circle cx="50" cy="52" r="3" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
      <circle cx="50" cy="56" r="3" fill="none" stroke="#22C55E" strokeWidth="1.5" />
    </svg>
  );
}
