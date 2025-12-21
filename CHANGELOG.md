# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

### Changed

- Default game difficulty changed to 'normal' (5 NPCs, 1 empty seat) for increased challenge
- Game page now uses useState for mutable state management
- Seat component displays revealed destination directly on the seat
- ESLint config updated to properly handle TypeScript type annotations
- Game result now displays as modal overlay instead of inline message
- Mutation tests disabled in CI (takes too long)
- GameState interface extended with standingNPCs, hoveredSeatId, difficulty, and lastClaimMessage fields
- Seat component now supports "hovered" display state with purple styling
- SeatPopover shows "Hover Near" button for occupied seats
- advanceStation() now processes standing NPC claims for newly emptied seats

### Fixed

### Removed
