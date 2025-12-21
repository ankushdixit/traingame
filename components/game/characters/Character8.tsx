/**
 * Character 8 - Young woman with ponytail in casual wear
 */

interface CharacterProps {
  isSeated?: boolean;
}

export function Character8({ isSeated = true }: CharacterProps) {
  return (
    <svg
      viewBox="0 0 60 80"
      className="w-full h-full"
      aria-label="Young woman with ponytail wearing yellow top"
    >
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#B68968" />
      {/* Hair with ponytail */}
      <ellipse cx="30" cy="12" rx="13" ry="9" fill="#1A1A1A" />
      {/* Ponytail */}
      <ellipse cx="44" cy="14" rx="4" ry="10" fill="#1A1A1A" />
      <circle cx="46" cy="22" r="3" fill="#1A1A1A" />
      {/* Eyes */}
      <ellipse cx="24" cy="18" rx="2" ry="2" fill="#2C1810" />
      <ellipse cx="36" cy="18" rx="2" ry="2" fill="#2C1810" />
      {/* Eye highlights */}
      <circle cx="24.5" cy="17" r="0.8" fill="white" />
      <circle cx="36.5" cy="17" r="0.8" fill="white" />
      {/* Smile */}
      <path
        d="M25 24 Q30 28 35 24"
        fill="none"
        stroke="#8B4513"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Body - Casual top */}
      {isSeated ? (
        <>
          <rect x="14" y="34" width="32" height="30" rx="4" fill="#FBBF24" />
          {/* Neckline */}
          <ellipse cx="30" cy="36" rx="8" ry="4" fill="#B68968" />
          {/* Simple pattern */}
          <circle cx="30" cy="50" r="4" fill="#F59E0B" opacity="0.5" />
        </>
      ) : (
        <>
          <rect x="16" y="34" width="28" height="40" rx="4" fill="#FBBF24" />
          {/* Neckline */}
          <ellipse cx="30" cy="36" rx="7" ry="4" fill="#B68968" />
          {/* Simple pattern */}
          <circle cx="30" cy="52" r="4" fill="#F59E0B" opacity="0.5" />
          {/* Jeans */}
          <rect x="18" y="74" width="10" height="6" rx="1" fill="#3B82F6" />
          <rect x="32" y="74" width="10" height="6" rx="1" fill="#3B82F6" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="10" cy="48" rx="5" ry="10" fill="#B68968" />
      <ellipse cx="50" cy="48" rx="5" ry="10" fill="#B68968" />
      {/* Watch */}
      <rect x="48" y="52" width="4" height="5" rx="1" fill="#374151" />
    </svg>
  );
}
