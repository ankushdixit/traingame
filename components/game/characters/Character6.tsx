/**
 * Character 6 - Working man in checkered shirt
 */

interface CharacterProps {
  isSeated?: boolean;
}

export function Character6({ isSeated = true }: CharacterProps) {
  return (
    <svg viewBox="0 0 60 80" className="w-full h-full" aria-label="Man wearing checkered shirt">
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#FDBF6F" />
      {/* Hair */}
      <path d="M16 14 Q30 6 44 14 L44 8 Q30 -2 16 8 Z" fill="#4B3621" />
      {/* Eyes */}
      <circle cx="24" cy="18" r="2" fill="#2C1810" />
      <circle cx="36" cy="18" r="2" fill="#2C1810" />
      {/* Stubble */}
      <rect x="22" y="26" width="16" height="4" rx="2" fill="#6B5344" opacity="0.3" />
      {/* Smile */}
      <path
        d="M25 24 Q30 27 35 24"
        fill="none"
        stroke="#8B4513"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Body - Checkered shirt */}
      {isSeated ? (
        <>
          <rect x="14" y="34" width="32" height="30" rx="4" fill="#DC2626" />
          {/* Checkered pattern */}
          <line x1="22" y1="34" x2="22" y2="64" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="30" y1="34" x2="30" y2="64" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="38" y1="34" x2="38" y2="64" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="14" y1="42" x2="46" y2="42" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="14" y1="50" x2="46" y2="50" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="14" y1="58" x2="46" y2="58" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          {/* Collar */}
          <path
            d="M24 34 L28 40 L30 38 L32 40 L36 34"
            fill="#DC2626"
            stroke="#B91C1C"
            strokeWidth="1"
          />
        </>
      ) : (
        <>
          <rect x="16" y="34" width="28" height="40" rx="4" fill="#DC2626" />
          {/* Checkered pattern */}
          <line x1="22" y1="34" x2="22" y2="74" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="30" y1="34" x2="30" y2="74" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="38" y1="34" x2="38" y2="74" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="16" y1="44" x2="44" y2="44" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="16" y1="54" x2="44" y2="54" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          <line x1="16" y1="64" x2="44" y2="64" stroke="#1F2937" strokeWidth="1" opacity="0.3" />
          {/* Pants */}
          <rect x="18" y="74" width="10" height="6" rx="1" fill="#374151" />
          <rect x="32" y="74" width="10" height="6" rx="1" fill="#374151" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="10" cy="48" rx="5" ry="10" fill="#FDBF6F" />
      <ellipse cx="50" cy="48" rx="5" ry="10" fill="#FDBF6F" />
    </svg>
  );
}
