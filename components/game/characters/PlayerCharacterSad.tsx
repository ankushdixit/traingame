/**
 * PlayerCharacterSad - Disappointed player for lose screen
 * Shows the player looking tired and disappointed, still standing
 */

export function PlayerCharacterSad() {
  return (
    <svg
      viewBox="0 0 60 100"
      className="h-full w-full"
      aria-label="You - tired from standing"
      data-testid="player-character-sad"
    >
      {/* Head - slightly drooped */}
      <circle cx="30" cy="20" r="14" fill="#E8B98D" />
      {/* Hair */}
      <path d="M16 14 Q30 2 44 14 L44 6 Q30 -6 16 6 Z" fill="#2D1B0E" />

      {/* Tired eyes - half-lidded */}
      <ellipse cx="24" cy="19" rx="2.5" ry="1.5" fill="#1A1A1A" />
      <ellipse cx="36" cy="19" rx="2.5" ry="1.5" fill="#1A1A1A" />
      {/* Tired eyelids */}
      <path d="M21 17 L27 17" stroke="#E8B98D" strokeWidth="3" />
      <path d="M33 17 L39 17" stroke="#E8B98D" strokeWidth="3" />

      {/* Sad frown */}
      <path
        d="M24 28 Q30 24 36 28"
        fill="none"
        stroke="#8B4513"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Sweat drop */}
      <path d="M46 14 Q48 18 46 22 Q44 18 46 14" fill="#87CEEB" opacity="0.7" />

      {/* Body - Standing, slightly slouched */}
      <rect x="16" y="36" width="28" height="46" rx="4" fill="#F97316" />
      {/* Hood */}
      <ellipse cx="30" cy="38" rx="11" ry="5" fill="#EA580C" />
      {/* Hoodie strings - drooping */}
      <path d="M24 40 Q22 50 24 52" stroke="white" strokeWidth="1" fill="none" />
      <path d="M36 40 Q38 50 36 52" stroke="white" strokeWidth="1" fill="none" />
      {/* Pocket */}
      <rect x="20" y="62" width="20" height="8" rx="2" fill="#EA580C" />

      {/* Jeans */}
      <rect x="18" y="82" width="10" height="14" rx="1" fill="#1E40AF" />
      <rect x="32" y="82" width="10" height="14" rx="1" fill="#1E40AF" />

      {/* Shoes */}
      <rect x="16" y="96" width="12" height="4" rx="1" fill="#4A4A4A" />
      <rect x="32" y="96" width="12" height="4" rx="1" fill="#4A4A4A" />

      {/* Arms - hanging down tiredly */}
      <ellipse cx="10" cy="56" rx="5" ry="14" fill="#F97316" />
      <ellipse cx="50" cy="56" rx="5" ry="14" fill="#F97316" />

      {/* Hands - at sides */}
      <circle cx="10" cy="70" r="4" fill="#E8B98D" />
      <circle cx="50" cy="70" r="4" fill="#E8B98D" />
    </svg>
  );
}
