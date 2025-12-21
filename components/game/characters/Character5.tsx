/**
 * Character 5 - Business woman with handbag
 */

interface CharacterProps {
  isSeated?: boolean;
}

export function Character5({ isSeated = true }: CharacterProps) {
  return (
    <svg
      viewBox="0 0 60 80"
      className="w-full h-full"
      aria-label="Business woman with handbag wearing formal attire"
    >
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#C19A6B" />
      {/* Hair - tied back */}
      <ellipse cx="30" cy="12" rx="13" ry="9" fill="#3D2314" />
      <circle cx="30" cy="6" r="5" fill="#3D2314" />
      {/* Earrings */}
      <circle cx="16" cy="22" r="2" fill="#FBBF24" />
      <circle cx="44" cy="22" r="2" fill="#FBBF24" />
      {/* Eyes */}
      <ellipse cx="24" cy="18" rx="2" ry="1.5" fill="#2C1810" />
      <ellipse cx="36" cy="18" rx="2" ry="1.5" fill="#2C1810" />
      {/* Lipstick */}
      <ellipse cx="30" cy="25" rx="4" ry="2" fill="#DC2626" />
      {/* Body - Formal blazer */}
      {isSeated ? (
        <>
          <rect x="14" y="34" width="32" height="30" rx="4" fill="#1F2937" />
          {/* Inner shirt */}
          <rect x="24" y="34" width="12" height="15" fill="#F3F4F6" />
          {/* Blazer lapels */}
          <path d="M24 34 L20 44 L24 44 Z" fill="#111827" />
          <path d="M36 34 L40 44 L36 44 Z" fill="#111827" />
          {/* Handbag */}
          <rect x="44" y="50" width="10" height="12" rx="2" fill="#7C2D12" />
          <path d="M46 50 Q49 46 52 50" fill="none" stroke="#7C2D12" strokeWidth="2" />
        </>
      ) : (
        <>
          <rect x="16" y="34" width="28" height="40" rx="4" fill="#1F2937" />
          {/* Inner shirt */}
          <rect x="24" y="34" width="12" height="18" fill="#F3F4F6" />
          {/* Blazer lapels */}
          <path d="M24 34 L20 46 L24 46 Z" fill="#111827" />
          <path d="M36 34 L40 46 L36 46 Z" fill="#111827" />
          {/* Handbag */}
          <rect x="46" y="55" width="10" height="14" rx="2" fill="#7C2D12" />
          <path d="M48 55 Q51 50 54 55" fill="none" stroke="#7C2D12" strokeWidth="2" />
          {/* Heels */}
          <rect x="20" y="74" width="8" height="6" rx="1" fill="#1F2937" />
          <rect x="32" y="74" width="8" height="6" rx="1" fill="#1F2937" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="10" cy="48" rx="5" ry="10" fill="#C19A6B" />
      <ellipse cx="50" cy="48" rx="5" ry="10" fill="#C19A6B" />
    </svg>
  );
}
