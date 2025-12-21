/**
 * Character 1 - Young professional man with glasses and blue shirt
 */

interface CharacterProps {
  isSeated?: boolean;
}

export function Character1({ isSeated = true }: CharacterProps) {
  return (
    <svg
      viewBox="0 0 60 80"
      className="w-full h-full"
      aria-label="Young man with glasses wearing blue shirt"
    >
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#D4A574" />
      {/* Hair */}
      <path d="M16 14 Q30 4 44 14 L44 10 Q30 0 16 10 Z" fill="#2C1810" />
      {/* Glasses */}
      <rect
        x="20"
        y="15"
        width="7"
        height="5"
        rx="1"
        fill="none"
        stroke="#4B5563"
        strokeWidth="1.5"
      />
      <rect
        x="33"
        y="15"
        width="7"
        height="5"
        rx="1"
        fill="none"
        stroke="#4B5563"
        strokeWidth="1.5"
      />
      <line x1="27" y1="17" x2="33" y2="17" stroke="#4B5563" strokeWidth="1" />
      {/* Eyes */}
      <circle cx="23.5" cy="17.5" r="1.5" fill="#2C1810" />
      <circle cx="36.5" cy="17.5" r="1.5" fill="#2C1810" />
      {/* Smile */}
      <path
        d="M25 24 Q30 28 35 24"
        fill="none"
        stroke="#8B4513"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Body */}
      {isSeated ? (
        <>
          <rect x="15" y="34" width="30" height="30" rx="4" fill="#3B82F6" />
          {/* Collar */}
          <path d="M24 34 L30 40 L36 34" fill="none" stroke="#1E40AF" strokeWidth="2" />
        </>
      ) : (
        <>
          <rect x="18" y="34" width="24" height="40" rx="4" fill="#3B82F6" />
          {/* Collar */}
          <path d="M24 34 L30 40 L36 34" fill="none" stroke="#1E40AF" strokeWidth="2" />
          {/* Legs */}
          <rect x="20" y="74" width="8" height="6" rx="1" fill="#4B5563" />
          <rect x="32" y="74" width="8" height="6" rx="1" fill="#4B5563" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="11" cy="48" rx="5" ry="10" fill="#D4A574" />
      <ellipse cx="49" cy="48" rx="5" ry="10" fill="#D4A574" />
    </svg>
  );
}
