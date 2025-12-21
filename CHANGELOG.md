# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Difficulty level selection UI on station selection screen
- DifficultySelector component with segmented control for Easy/Normal/Rush Hour
- Difficulty badge display in game header with color-coded styling
- Session storage persistence for last selected difficulty
- DifficultyOption type and DIFFICULTY_OPTIONS constant for selector UI

- Sound effects system with SoundManager class for game audio
- SoundContext and SoundProvider for React-based sound state management
- Mute/unmute toggle button in game header with accessible icons
- Train movement sounds (moving, stopping, door close) on station advance
- Station announcement sound effect
- Seat interaction sounds (click, claim)
- Win/lose game sound effects (celebratory jingle, sympathetic sound)
- NPC grab sound when standing passengers claim seats
- Configurable volume levels per sound type
- Concurrent sound limiting (max 3 simultaneous sounds)
- Graceful error handling for browser autoplay restrictions

- Initial project setup with Session-Driven Development
- Health check API endpoint at `/api/health` returning `{ status: "ok", timestamp: "<ISO date>" }`
- Station selection screen with boarding/destination dropdowns and dynamic filtering
- Game state generation with `generateInitialState(boardingStation, destination)` function
- NPC, Seat, and GameState TypeScript interfaces for game logic
- Game configuration constants (TOTAL_SEATS, DIFFICULTY_CONFIGS, DEFAULT_DIFFICULTY)
- Difficulty system with three levels: Easy (3-4 NPCs), Normal (5 NPCs), Rush Hour (6 NPCs)
- `Difficulty` type and `DifficultyConfig` interface for game difficulty configuration
- Difficulty parameter support in `generateInitialState()` function (defaults to 'normal')
- URL parameter `?difficulty=easy|normal|rush` for selecting game difficulty
- Compartment view display with 2x3 seat grid layout
- Game page at `/game` with URL-based state management
- GameHeader component showing current station, next station, destination, and remaining stations
- Seat component with 4 display states (empty, occupied, occupied-known, player)
- PlayerStatus component showing standing/seated status
- Request NPC destination action: click occupied seats to ask where NPCs are getting off
- SeatPopover component for seat interactions (claim seat, ask destination)
- `revealDestination()` function for immutable game state updates
- Clickable seats with keyboard accessibility support
- Claim empty seat action: click empty seats to claim and become seated
- `claimSeat()` function for claiming seats with immutable state updates
- Seated player cannot interact with other seats (game simplification for win state)
- Advance to next station: "Next Station" button to progress the train journey
- `advanceStation()` function for turn-based station progression
- NextStationButton component showing "Next: [station]" or "Arrive at [station]"
- NPC exit mechanic: NPCs leave when train reaches their destination, freeing seats
- Win/lose conditions: player wins if seated at destination, loses if standing
- Game result display with "You Won!" or "You Lost!" messages
- GameEndModal component: modal overlay for win/lose screens with destination message
- "Play Again" / "Try Again" buttons to restart game from station selection
- Standing passenger competition: standing NPCs compete with player for newly emptied seats
- StandingNPC type with id, targetSeatId, claimPriority, and characterSprite fields
- StandingArea component displaying standing passengers with claim message alerts
- "Hover Near" seat action: player can hover near occupied seats to gain claim priority
- `generateStandingNPCs()` function generating NPCs based on difficulty settings
- `processStandingNPCClaims()` function handling NPC seat claims with probability
- `setHoveredSeat()` function for player hover state management
- Difficulty-based standing NPC counts: Easy (0), Normal (1-2), Rush Hour (2-3)
- Difficulty-based claim chance: Easy (20%), Normal (50%), Rush Hour (80%)
- Journey progress indicator: visual track showing all stations with current position
- JourneyProgress component displaying station markers on horizontal track
- StationMarker component with styling for current, destination, passed, and future stations
- Train emoji (🚂) on current station, flag emoji (🚩) on destination
- Blue progress line showing journey completion percentage
- Urgency indicator with pulsing animation when 1 station from destination
- Station labels visible for current, destination, and boarding stations
- Hover tooltips showing station names on desktop
- Custom `animate-urgent` CSS animation for destination warning
- Mumbai local train themed compartment visual design
- TrainCompartment wrapper component with cream background and maroon border
- TrainInterior component with ceiling handles, vertical poles, and window with scenery
- TrainSeat component with train bench styling and state-based coloring
- Mumbai train color palette: maroon (#800000), cream (#FFFDD0), metallic gray
- Window scenery animation that scrolls on station transitions
- Aisle between seat rows for train interior authenticity
- Passenger emoji icons (🧑) instead of text for occupied seats
- Player emoji (😊) for player seat visualization
- Character designs for passengers: 8 distinct NPC character illustrations
  - Character1: Young professional man with glasses and blue shirt
  - Character2: Middle-aged woman in maroon kurta with bindi
  - Character3: Elderly uncle with white hair and white shirt
  - Character4: Young college student with earphones and green t-shirt
  - Character5: Business woman with handbag in formal blazer
  - Character6: Working man in red checkered shirt
  - Character7: Elderly aunty in green saree with bangles
  - Character8: Young woman with ponytail in yellow top
- PlayerCharacter component: distinct player character in orange hoodie with glow effect
- SpeechBubble component: displays revealed destinations as speech bubble overlay
- Character registry with getCharacterComponent() and renderCharacter() utilities
- characterSprite field added to NPC interface for visual representation
- Unique character assignment: no duplicate characters when fewer than 6 NPCs

### Changed

- Default game difficulty changed to 'normal' (5 NPCs, 1 empty seat) for increased challenge
- Game page now uses useState for mutable state management
- Seat component displays revealed destination directly on the seat
- ESLint config updated to properly handle TypeScript type annotations
- Game result now displays as modal overlay instead of inline message
- Mutation tests disabled in CI (takes too long)
- GameState interface extended with standingNPCs, hoveredSeatId, difficulty, and lastClaimMessage fields
- Seat component now supports "hovered" display state with purple styling
- Seat component now uses character SVG illustrations instead of emoji icons
- StandingArea component now uses character illustrations with standing posture
- Destination reveal now shows as speech bubble overlay instead of replacing character
- SeatPopover shows "Hover Near" button for occupied seats
- advanceStation() now processes standing NPC claims for newly emptied seats
- Enhanced win/lose screens with celebration animations and game statistics
  - Confetti component: CSS-only confetti animation with 50 colorful pieces on win
  - GameStats component: displays difficulty, stations standing, and seated status
  - WinScene: celebratory win screen with confetti, happy character, bounce animation
  - LoseScene: sympathetic lose screen with tired character and "how close" message
  - PlayerCharacterHappy: happy player with raised arms celebrating victory
  - PlayerCharacterSad: disappointed player looking tired from standing
  - Animation skip: click overlay to skip confetti animation
  - New CSS animations: confettiFall, celebrateBounce, fadeInUp
- Station transition animations for smooth train movement experience
  - useTransitionController hook: manages animation phases (shaking → departing → claiming → settling)
  - Train shake animation (500ms) when advancing stations
  - NPC departure animation: slide-out-right when leaving at their destination
  - Seat claim animation: pop-in effect when standing NPC claims seat
  - "Claimed!" indicator badge when NPC takes a seat
  - Player claim success animation: green pulse effect
  - Standing NPC move-to-seat animation
  - Interaction queuing: clicks during animation are queued and executed after
  - previewStationAdvance() function for animation coordination
  - New CSS animations: trainShake, slideOutRight, seatClaim, successPulse, npcClaimIndicator, moveToSeat

### Fixed

### Removed
