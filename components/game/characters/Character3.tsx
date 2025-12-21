/**
 * Character 3 - Elderly man (uncle) with white hair and simple attire
 */

interface CharacterProps {
  isSeated?: boolean;
}

export function Character3({ isSeated = true }: CharacterProps) {
  return (
    <svg
      viewBox="0 0 60 80"
      className="w-full h-full"
      aria-label="Elderly uncle with white hair wearing white shirt"
    >
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#E0AC69" />
      {/* White/Gray hair */}
      <path d="M16 12 Q30 2 44 12 L44 8 Q30 -2 16 8 Z" fill="#E5E7EB" />
      <ellipse cx="18" cy="14" rx="3" ry="5" fill="#E5E7EB" />
      <ellipse cx="42" cy="14" rx="3" ry="5" fill="#E5E7EB" />
      {/* Wrinkles */}
      <path d="M20 14 L24 14" stroke="#B8860B" strokeWidth="0.5" />
      <path d="M36 14 L40 14" stroke="#B8860B" strokeWidth="0.5" />
      {/* Eyes */}
      <circle cx="24" cy="18" r="1.5" fill="#4B3621" />
      <circle cx="36" cy="18" r="1.5" fill="#4B3621" />
      {/* Mustache */}
      <path d="M24 24 Q30 26 36 24" fill="#9CA3AF" />
      {/* Body - Simple white shirt */}
      {isSeated ? (
        <>
          <rect x="15" y="34" width="30" height="30" rx="4" fill="#F9FAFB" />
          {/* Shirt buttons */}
          <circle cx="30" cy="40" r="1.5" fill="#9CA3AF" />
          <circle cx="30" cy="48" r="1.5" fill="#9CA3AF" />
          <circle cx="30" cy="56" r="1.5" fill="#9CA3AF" />
        </>
      ) : (
        <>
          <rect x="17" y="34" width="26" height="40" rx="4" fill="#F9FAFB" />
          {/* Shirt buttons */}
          <circle cx="30" cy="40" r="1.5" fill="#9CA3AF" />
          <circle cx="30" cy="50" r="1.5" fill="#9CA3AF" />
          <circle cx="30" cy="60" r="1.5" fill="#9CA3AF" />
          {/* Legs - dhoti/pants */}
          <rect x="18" y="74" width="10" height="6" rx="1" fill="#D1D5DB" />
          <rect x="32" y="74" width="10" height="6" rx="1" fill="#D1D5DB" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="11" cy="48" rx="5" ry="10" fill="#E0AC69" />
      <ellipse cx="49" cy="48" rx="5" ry="10" fill="#E0AC69" />
    </svg>
  );
}
