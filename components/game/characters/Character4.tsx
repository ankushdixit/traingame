/**
 * Character 4 - Young college student with earphones
 */

interface CharacterProps {
  isSeated?: boolean;
}

export function Character4({ isSeated = true }: CharacterProps) {
  return (
    <svg
      viewBox="0 0 60 80"
      className="w-full h-full"
      aria-label="Young student with earphones wearing t-shirt"
    >
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#8D5524" />
      {/* Hair - messy style */}
      <ellipse cx="30" cy="10" rx="12" ry="8" fill="#1A1A1A" />
      <circle cx="20" cy="8" r="3" fill="#1A1A1A" />
      <circle cx="38" cy="9" r="4" fill="#1A1A1A" />
      {/* Earphones */}
      <circle cx="16" cy="20" r="3" fill="#374151" />
      <circle cx="44" cy="20" r="3" fill="#374151" />
      <path d="M16 17 Q16 10 20 8" fill="none" stroke="#374151" strokeWidth="1.5" />
      <path d="M44 17 Q44 10 40 8" fill="none" stroke="#374151" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="24" cy="18" r="2" fill="#1A1A1A" />
      <circle cx="36" cy="18" r="2" fill="#1A1A1A" />
      {/* Casual smile */}
      <path d="M26 25 L34 25" stroke="#5D3A1A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Body - Graphic T-shirt */}
      {isSeated ? (
        <>
          <rect x="14" y="34" width="32" height="30" rx="4" fill="#059669" />
          {/* T-shirt graphic */}
          <circle cx="30" cy="48" r="6" fill="#10B981" />
          <text x="30" y="51" textAnchor="middle" fontSize="8" fill="#ECFDF5">
            M
          </text>
        </>
      ) : (
        <>
          <rect x="16" y="34" width="28" height="40" rx="4" fill="#059669" />
          {/* T-shirt graphic */}
          <circle cx="30" cy="50" r="6" fill="#10B981" />
          <text x="30" y="53" textAnchor="middle" fontSize="8" fill="#ECFDF5">
            M
          </text>
          {/* Jeans */}
          <rect x="18" y="74" width="10" height="6" rx="1" fill="#1E40AF" />
          <rect x="32" y="74" width="10" height="6" rx="1" fill="#1E40AF" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="10" cy="48" rx="5" ry="10" fill="#8D5524" />
      <ellipse cx="50" cy="48" rx="5" ry="10" fill="#8D5524" />
    </svg>
  );
}
