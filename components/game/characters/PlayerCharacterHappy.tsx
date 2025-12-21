/**
 * PlayerCharacterHappy - Happy seated player for win screen
 * Shows the player with a big celebratory smile and arms raised
 */

export function PlayerCharacterHappy() {
  return (
    <svg
      viewBox="0 0 80 100"
      className="h-full w-full"
      aria-label="You - celebrating victory!"
      data-testid="player-character-happy"
    >
      {/* Glow effect for celebration */}
      <defs>
        <filter id="celebrateGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="happyAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Happy aura behind character */}
      <circle cx="40" cy="50" r="45" fill="url(#happyAura)" />

      {/* Head */}
      <circle cx="40" cy="22" r="16" fill="#E8B98D" filter="url(#celebrateGlow)" />
      {/* Hair */}
      <path d="M24 16 Q40 4 56 16 L56 8 Q40 -6 24 8 Z" fill="#2D1B0E" />

      {/* Eyes - Closed happy squint */}
      <path
        d="M30 20 Q34 17 38 20"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M42 20 Q46 17 50 20"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Big happy smile */}
      <path
        d="M30 28 Q40 38 50 28"
        fill="none"
        stroke="#8B4513"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Rosy cheeks - extra rosy when happy */}
      <circle cx="26" cy="26" r="4" fill="#FBBF24" opacity="0.4" />
      <circle cx="54" cy="26" r="4" fill="#FBBF24" opacity="0.4" />

      {/* Body - Seated with orange hoodie */}
      <rect x="22" y="40" width="36" height="35" rx="4" fill="#F97316" />
      {/* Hood */}
      <ellipse cx="40" cy="42" rx="14" ry="6" fill="#EA580C" />
      {/* Hoodie strings */}
      <line x1="32" y1="44" x2="32" y2="54" stroke="white" strokeWidth="1.5" />
      <line x1="48" y1="44" x2="48" y2="54" stroke="white" strokeWidth="1.5" />
      {/* Pocket */}
      <rect x="28" y="60" width="24" height="10" rx="2" fill="#EA580C" />

      {/* Arms - Raised in celebration */}
      <ellipse cx="12" cy="38" rx="6" ry="12" fill="#F97316" transform="rotate(-30 12 38)" />
      <ellipse cx="68" cy="38" rx="6" ry="12" fill="#F97316" transform="rotate(30 68 38)" />

      {/* Hands - Raised */}
      <circle cx="6" cy="28" r="5" fill="#E8B98D" />
      <circle cx="74" cy="28" r="5" fill="#E8B98D" />
    </svg>
  );
}
