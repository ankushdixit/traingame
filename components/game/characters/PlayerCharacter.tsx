/**
 * PlayerCharacter - Distinct character representing the player
 * Uses a bright highlight color to stand out from NPCs
 */

interface PlayerCharacterProps {
  isSeated?: boolean;
}

export function PlayerCharacter({ isSeated = true }: PlayerCharacterProps) {
  return (
    <svg viewBox="0 0 60 80" className="w-full h-full" aria-label="You - the player character">
      {/* Glow effect for player distinction */}
      <defs>
        <filter id="playerGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#E8B98D" filter="url(#playerGlow)" />
      {/* Hair */}
      <path d="M16 12 Q30 2 44 12 L44 6 Q30 -4 16 6 Z" fill="#2D1B0E" />
      {/* Eyes - Friendly and bright */}
      <circle cx="24" cy="17" r="2.5" fill="#1A1A1A" />
      <circle cx="36" cy="17" r="2.5" fill="#1A1A1A" />
      {/* Eye sparkle */}
      <circle cx="25" cy="16" r="1" fill="white" />
      <circle cx="37" cy="16" r="1" fill="white" />
      {/* Happy smile */}
      <path
        d="M23 24 Q30 30 37 24"
        fill="none"
        stroke="#8B4513"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Rosy cheeks */}
      <circle cx="19" cy="22" r="3" fill="#FBBF24" opacity="0.3" />
      <circle cx="41" cy="22" r="3" fill="#FBBF24" opacity="0.3" />

      {/* Body - Distinctive orange hoodie */}
      {isSeated ? (
        <>
          <rect x="14" y="34" width="32" height="30" rx="4" fill="#F97316" />
          {/* Hood */}
          <ellipse cx="30" cy="36" rx="12" ry="6" fill="#EA580C" />
          {/* Hoodie string */}
          <line x1="24" y1="38" x2="24" y2="46" stroke="white" strokeWidth="1" />
          <line x1="36" y1="38" x2="36" y2="46" stroke="white" strokeWidth="1" />
          {/* Pocket */}
          <rect x="20" y="52" width="20" height="8" rx="2" fill="#EA580C" />
        </>
      ) : (
        <>
          <rect x="16" y="34" width="28" height="40" rx="4" fill="#F97316" />
          {/* Hood */}
          <ellipse cx="30" cy="36" rx="11" ry="5" fill="#EA580C" />
          {/* Hoodie string */}
          <line x1="24" y1="38" x2="24" y2="46" stroke="white" strokeWidth="1" />
          <line x1="36" y1="38" x2="36" y2="46" stroke="white" strokeWidth="1" />
          {/* Pocket */}
          <rect x="20" y="56" width="20" height="8" rx="2" fill="#EA580C" />
          {/* Jeans */}
          <rect x="18" y="74" width="10" height="6" rx="1" fill="#1E40AF" />
          <rect x="32" y="74" width="10" height="6" rx="1" fill="#1E40AF" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="10" cy="48" rx="5" ry="10" fill="#F97316" />
      <ellipse cx="50" cy="48" rx="5" ry="10" fill="#F97316" />
      {/* Hands */}
      <circle cx="10" cy="58" r="4" fill="#E8B98D" />
      <circle cx="50" cy="58" r="4" fill="#E8B98D" />
    </svg>
  );
}
