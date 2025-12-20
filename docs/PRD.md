# Mumbai Local Train Game - Product Requirements Document

## Executive Summary

Mumbai Local Train Game is a turn-based strategy game that simulates the experience of finding a seat in a crowded Mumbai local train compartment. Players board at a station, observe NPC passengers occupying seats, strategically gather information about when seats will vacate, and attempt to claim a seat before reaching their destination. It's a quick, casual game for anyone who has experienced (or is curious about) the Mumbai local train culture.

## Problem Statement

### The Problem

There's no casual game that captures the uniquely Mumbai experience of competing for seats on local trains. This relatable scenario offers natural strategic gameplay: limited resources (seats), imperfect information (NPC destinations), and time pressure (reaching your destination).

### Goals

- Create a fun, replayable 2-5 minute game session
- Capture the essence of Mumbai local train seat dynamics
- Provide clear win/lose conditions with strategic depth
- Achieve 90%+ test coverage with comprehensive quality gates

### Non-Goals

- Historical accuracy of train routes or schedules
- Simulation of actual train physics or timing
- Educational content about Mumbai's transit system

## User Personas

### The Mumbai Nostalgist

- **Who**: Someone who has ridden Mumbai local trains and remembers the seat-finding experience
- **Needs**: A quick, relatable game that brings back memories
- **Pain Points**: Most games don't capture this uniquely Indian experience

### The Casual Strategy Gamer

- **Who**: Anyone who enjoys quick turn-based games with simple rules
- **Needs**: Easy to learn, hard to master gameplay
- **Pain Points**: Many strategy games are too complex or time-consuming

## Technical Constraints

### Stack

- **Framework**: fullstack_nextjs (Next.js + React + Prisma)
- **State Management**: React useState/useReducer (no external state library)
- **Styling**: Tailwind CSS
- **Testing**: Vitest with React Testing Library
- **Deployment**: Vercel (connected to GitHub)

### External Dependencies

None required for MVP. Game is entirely client-side with no external API calls.

### Performance Requirements

- Initial page load: < 3 seconds
- Turn transition: Instant (< 100ms)
- No network requests during gameplay

### Security Requirements

- No user data collection
- No authentication required
- No sensitive data handling

### Technical Rules

- **Must use**:
  - React Server Components for initial page render
  - Client Components for game interactivity
  - Zod for any input validation
  - TypeScript strict mode
- **Must not use**:
  - External state management libraries (Redux, Zustand)
  - External animation libraries
  - localStorage for game state (each game is fresh)

## MVP Definition

### Must Have

- [x] Single train line: Churchgate → Marine Lines → Charni Road → Grant Road → Mumbai Central → Dadar (6 stations)
- [x] 6 seats in compartment
- [x] 3-4 NPCs initially seated with predetermined destinations
- [x] Player selects boarding station and destination
- [x] Turn-based gameplay: "Next Station" advances the game
- [x] Player actions: Stand (wait), Request (ask NPC destination), Claim (take empty seat)
- [x] Win condition: Sit before reaching destination
- [x] Lose condition: Arrive at destination while standing
- [x] Win/Lose screen with "Play Again" button

### Should Have (Post-MVP)

- [ ] Multiple difficulty levels (more NPCs, faster trains)
- [ ] Sound effects for train announcements
- [ ] Simple animations for station transitions
- [ ] Statistics tracking (win rate, games played)

### Won't Have (Out of Scope)

- Multiple train lines or realistic routes
- Multiplayer functionality
- NPC negotiation or bribery mechanics
- Standing passenger competition (other players/NPCs competing)
- Difficulty levels
- Sound effects or animations
- Score tracking or leaderboards
- Mobile-specific optimizations
- Persistence/save games

## User Stories

### Phase 0: Infrastructure

#### Story 0.1: Health Check Endpoint

**As a** developer
**I want** a health check endpoint
**So that** I can verify the stack is working

**Acceptance Criteria:**

1. Given the server is running
   When I call GET /api/health
   Then I receive `{ "status": "ok", "timestamp": "<ISO date>" }`
   And response time is < 100ms

**Dependencies:** None
**Complexity:** S

---

### Phase 1: Game Setup

#### Story 1.1: Station Selection Screen

**As a** player
**I want to** select my boarding station and destination
**So that** I can start a new game

**Acceptance Criteria:**

1. Given I visit the home page
   When the page loads
   Then I see a title "Mumbai Local Train Game"
   And I see a dropdown labeled "Board at" with 5 stations (Churchgate through Mumbai Central)
   And I see a dropdown labeled "Get off at" with stations after my boarding station
   And I see a "Start Game" button (disabled until both selections made)

2. Given I have selected a boarding station
   When I click the destination dropdown
   Then I only see stations after my boarding station
   And I cannot select my boarding station as destination

3. Given I have selected both boarding and destination
   When I click "Start Game"
   Then I see the game compartment view
   And the current station shows my boarding station

4. Given I visit the home page
   When I don't select both stations
   Then the "Start Game" button remains disabled

**Technical Notes:**

- Stations array: `["Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central", "Dadar"]`
- No database required - static station list
- Use React useState for form state
- Destination options filter dynamically based on boarding selection

**Testing Requirements:**

- Unit: Station filtering logic
- Unit: Button disabled state logic
- Integration: Form submission navigates to game view

**Dependencies:** Story 0.1
**Complexity:** M

---

#### Story 1.2: Initial Game State Generation

**As a** game system
**I want to** generate a valid starting game state
**So that** the game begins with a fair, playable configuration

**Acceptance Criteria:**

1. Given a game starts
   When the initial state is generated
   Then there are exactly 6 seats in the compartment
   And 3-4 seats are occupied by NPCs (randomly determined)
   And 2-3 seats are empty
   And each NPC has a destination station after the current station
   And no NPC's destination is before the player's destination

2. Given an NPC is generated
   When their destination is assigned
   Then their destination is at least 1 station ahead
   And their destination is at most the last station (Dadar)
   And destinations are distributed (not all NPCs leaving at same station)

3. Given the player boards
   When the game starts
   Then the player is standing (not seated)
   And the player's remaining stations count is calculated correctly

**Technical Notes:**

- Game state type: `{ currentStation: number, playerSeated: boolean, seats: Seat[], playerDestination: number, playerBoardingStation: number }`
- Seat type: `{ id: number, occupant: NPC | null }`
- NPC type: `{ id: string, destination: number, destinationRevealed: boolean }`
- Use a seeded random or Math.random() for NPC generation
- Implement as a pure function: `generateInitialState(boardingStation, destination) => GameState`

**Testing Requirements:**

- Unit: Always generates 6 seats
- Unit: 3-4 NPCs generated (test multiple runs)
- Unit: All NPC destinations valid (after current, before or at Dadar)
- Unit: At least 2 empty seats initially
- Unit: Player starts standing

**Dependencies:** Story 1.1
**Complexity:** M

---

### Phase 2: Core Gameplay

#### Story 2.1: Compartment View Display

**As a** player
**I want to** see the train compartment layout
**So that** I can understand the current game state

**Acceptance Criteria:**

1. Given I am in a game
   When I view the compartment
   Then I see 6 seats arranged in a 2x3 grid (2 rows, 3 columns)
   And occupied seats show a passenger icon or indicator
   And empty seats show an "Empty" indicator
   And I see my current status (standing/seated)

2. Given I am viewing the compartment
   When I look at the header
   Then I see the current station name
   And I see "Next: [station name]" or "Final: Dadar" if at Mumbai Central
   And I see "Your destination: [station name]"
   And I see stations remaining count

3. Given I am standing
   When I view my status
   Then I see "You are standing"
   And I see a visual indicator in the standing area

4. Given I am seated
   When I view my status
   Then I see "You are seated!"
   And my seat is highlighted differently

**Technical Notes:**

- Compartment layout: CSS Grid 3 columns x 2 rows
- Use Tailwind for styling
- Seat component shows: occupied (with unknown/known destination) or empty
- Standing area below seats grid

**Testing Requirements:**

- Unit: Compartment renders 6 seats
- Unit: Header shows correct station info
- Unit: Standing/seated status displays correctly
- Snapshot: Compartment layout matches design

**Dependencies:** Story 1.2
**Complexity:** M

---

#### Story 2.2: Request NPC Destination Action

**As a** player
**I want to** ask an NPC where they're getting off
**So that** I can plan when to claim their seat

**Acceptance Criteria:**

1. Given I am standing
   When I click on an occupied seat
   Then I see a tooltip/popover with "Ask destination?" button

2. Given I click "Ask destination?"
   When the NPC responds
   Then the seat shows "Getting off at: [station name]"
   And this information persists for the rest of the game
   And the popover closes

3. Given I have already asked an NPC their destination
   When I click on their seat again
   Then I see their destination (already revealed)
   And I do not see the "Ask destination?" button

4. Given I am seated
   When I try to click on any seat
   Then nothing happens (no interaction)

5. Given I click on an empty seat while standing
   When the popover appears
   Then I see "Claim Seat" button (not "Ask destination?")

**Technical Notes:**

- Use a simple popover/tooltip component (can be custom or headless UI)
- NPC `destinationRevealed` boolean tracks if info is known
- Revealing destination is instant (no turn cost in MVP)

**Testing Requirements:**

- Unit: Clicking occupied seat shows ask option
- Unit: Revealing destination updates NPC state
- Unit: Already-revealed NPCs show destination directly
- Unit: Seated player cannot interact with seats
- Integration: Full reveal flow works

**Dependencies:** Story 2.1
**Complexity:** M

---

#### Story 2.3: Claim Empty Seat Action

**As a** player
**I want to** claim an empty seat
**So that** I can sit down and win the game

**Acceptance Criteria:**

1. Given I am standing
   When I click on an empty seat
   Then I see a popover with "Claim Seat" button

2. Given I click "Claim Seat"
   When the action completes
   Then I am now seated in that seat
   And my status changes to "You are seated!"
   And the seat shows as "You" or player indicator
   And I cannot interact with other seats

3. Given I am already seated
   When the game continues
   Then I remain seated for the rest of the game
   And I have effectively won (just need to reach destination)

4. Given all seats are occupied (no empty seats)
   When I try to claim a seat
   Then there is no "Claim Seat" option (only occupied seats visible)

**Technical Notes:**

- Claiming is instant (no turn cost - happens between stations)
- Once seated, player.seated = true
- Seated player ignores all seat interactions

**Testing Requirements:**

- Unit: Clicking empty seat shows claim option
- Unit: Claiming seat updates player state to seated
- Unit: Seated player has no seat interactions
- Integration: Full claim flow works

**Dependencies:** Story 2.2
**Complexity:** S

---

#### Story 2.4: Advance to Next Station

**As a** player
**I want to** advance the train to the next station
**So that** the game progresses

**Acceptance Criteria:**

1. Given I am in a game (not at win/lose screen)
   When I view the game
   Then I see a "Next Station" button

2. Given I click "Next Station"
   When the turn advances
   Then the current station increments by 1
   And the station display updates
   And NPCs whose destination matches the NEW current station leave (their seats become empty)
   And remaining stations count decreases

3. Given NPCs leave at a station
   When the station transition completes
   Then those seats show as "Empty"
   And I can now claim those seats
   And the revealed destination info is cleared (seat is empty)

4. Given I am at Mumbai Central (station index 4)
   When I click "Next Station"
   Then the train arrives at Dadar
   And the game ends (win or lose check)

5. Given I reach my destination station
   When the station transition completes
   Then the game checks win/lose condition
   And either win or lose screen shows

**Technical Notes:**

- Station transitions: Check NPC destinations against new current station
- NPCs with destination <= currentStation leave
- Order of operations: Advance station → Remove departing NPCs → Check game end
- Game end condition: currentStation >= playerDestination

**Testing Requirements:**

- Unit: Station advances correctly
- Unit: NPCs leave at correct stations
- Unit: Empty seats appear when NPCs leave
- Unit: Game end triggers at player destination
- Integration: Full turn flow

**Dependencies:** Story 2.3
**Complexity:** M

---

### Phase 3: Win/Lose Conditions

#### Story 3.1: Win Screen

**As a** player
**I want to** see a win screen when I sit before my destination
**So that** I know I've won and can play again

**Acceptance Criteria:**

1. Given I am seated
   When I reach my destination station
   Then I see a win screen overlay
   And the screen shows "You Won!"
   And the screen shows "You found a seat before reaching [destination]!"
   And I see a "Play Again" button

2. Given I click "Play Again"
   When the action completes
   Then I return to the station selection screen
   And all game state is reset

3. Given I am on the win screen
   When I view the screen
   Then I cannot interact with the game behind it
   And the compartment is still visible but dimmed

**Technical Notes:**

- Win condition: `playerSeated && currentStation >= playerDestination`
- Modal/overlay component with backdrop
- Play Again resets to initial state (station selection)

**Testing Requirements:**

- Unit: Win condition logic correct
- Unit: Win screen renders with correct message
- Unit: Play Again resets state
- Integration: Full win flow

**Dependencies:** Story 2.4
**Complexity:** S

---

#### Story 3.2: Lose Screen

**As a** player
**I want to** see a lose screen when I arrive standing
**So that** I know I've lost and can try again

**Acceptance Criteria:**

1. Given I am standing (not seated)
   When I reach my destination station
   Then I see a lose screen overlay
   And the screen shows "You Lost!"
   And the screen shows "You arrived at [destination] still standing!"
   And I see a "Try Again" button

2. Given I click "Try Again"
   When the action completes
   Then I return to the station selection screen
   And all game state is reset

3. Given I am on the lose screen
   When I view the screen
   Then I cannot interact with the game behind it
   And the compartment is still visible but dimmed

**Technical Notes:**

- Lose condition: `!playerSeated && currentStation >= playerDestination`
- Same modal pattern as win screen
- Try Again has same behavior as Play Again

**Testing Requirements:**

- Unit: Lose condition logic correct
- Unit: Lose screen renders with correct message
- Unit: Try Again resets state
- Integration: Full lose flow

**Dependencies:** Story 2.4
**Complexity:** S

---

## Data Models

### GameState (Client-Side Only)

```
Field               | Type              | Description
--------------------|-------------------|------------------------
currentStation      | number            | Index 0-5 in stations array
playerBoardingStation | number          | Index where player boarded
playerDestination   | number            | Index where player exits
playerSeated        | boolean           | Whether player has a seat
seatId              | number | null     | Which seat player is in (if seated)
seats               | Seat[]            | Array of 6 seats
gameStatus          | 'playing'|'won'|'lost' | Current game status
```

### Seat

```
Field               | Type              | Description
--------------------|-------------------|------------------------
id                  | number            | Seat ID (0-5)
occupant            | NPC | null        | NPC in seat, or null if empty
```

### NPC

```
Field               | Type              | Description
--------------------|-------------------|------------------------
id                  | string            | Unique ID (e.g., "npc-1")
destination         | number            | Station index where NPC exits
destinationRevealed | boolean           | Whether player knows destination
```

### Constants

```
STATIONS = ["Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central", "Dadar"]
TOTAL_SEATS = 6
MIN_NPCS = 3
MAX_NPCS = 4
```

## API Specifications

No backend APIs required for MVP. All game logic runs client-side.

### Health Check (Infrastructure Only)

- **Method**: GET
- **Path**: /api/health
- **Auth**: Public
- **Response**: `{ "status": "ok", "timestamp": "2024-01-15T10:30:00.000Z" }`

## Success Metrics

| Metric            | Target              | How Measured           |
| ----------------- | ------------------- | ---------------------- |
| Test Coverage     | 90%+                | Vitest coverage report |
| Initial Load Time | < 3s                | Lighthouse CI          |
| Quality Gates     | All pass            | `/validate` command    |
| Playable Game     | Complete flow works | E2E test               |

## Risks and Mitigations

| Risk                       | Likelihood | Impact | Mitigation                                  |
| -------------------------- | ---------- | ------ | ------------------------------------------- |
| Game too easy (always win) | Medium     | High   | Tune NPC count and destination distribution |
| Game too hard (never win)  | Medium     | High   | Ensure at least 2 empty seats at start      |
| Confusing UI               | Low        | Medium | Clear visual indicators, test with users    |
| Scope creep                | Medium     | Medium | Strict adherence to Out of Scope list       |

---

_PRD Version: 1.0_
_Last Updated: 2024-12-20_
_Status: Draft_
