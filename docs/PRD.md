# Mumbai Local Train Game - Product Requirements Document

## Executive Summary

Mumbai Local Train Game is a turn-based strategy game that simulates the experience of finding a seat in a crowded Mumbai local train compartment. Players board at a station, compete with NPC passengers for limited seats, strategically gather information about when seats will vacate, and attempt to claim a seat before reaching their destination. It's a quick, casual game that captures the tension and strategy of Mumbai's iconic local train culture.

## Problem Statement

### The Problem

There's no casual game that captures the uniquely Mumbai experience of competing for seats on local trains. This relatable scenario offers natural strategic gameplay: limited resources (seats), imperfect information (NPC destinations), competition (other passengers wanting seats), and time pressure (reaching your destination).

### Goals

- Create a fun, replayable 2-5 minute game session with genuine challenge
- Capture the essence of Mumbai local train seat dynamics with real tension
- Provide clear win/lose conditions with strategic depth where losing is possible
- Create an immersive visual and audio experience that feels like a Mumbai local
- Achieve 90%+ test coverage with comprehensive quality gates

### Non-Goals

- Historical accuracy of train routes or schedules
- Simulation of actual train physics or timing
- Educational content about Mumbai's transit system

## User Personas

### The Mumbai Nostalgist

- **Who**: Someone who has ridden Mumbai local trains and remembers the seat-finding experience
- **Needs**: A quick, relatable game that brings back memories with authentic feel
- **Pain Points**: Most games don't capture this uniquely Indian experience

### The Casual Strategy Gamer

- **Who**: Anyone who enjoys quick turn-based games with simple rules
- **Needs**: Easy to learn, hard to master gameplay with real challenge
- **Pain Points**: Many strategy games are too complex or time-consuming

### The Mobile Commuter

- **Who**: Someone playing on their phone during actual commute
- **Needs**: Quick sessions, touch-friendly interface, works offline
- **Pain Points**: Many web games aren't optimized for mobile play

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
- Turn transition: < 200ms (with animations)
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
  - CSS animations or Tailwind animations (no external libraries)
- **Must not use**:
  - External state management libraries (Redux, Zustand)
  - Heavy animation libraries (Framer Motion, GSAP)
  - localStorage for game state (each game is fresh, except stats)

## MVP Definition

### Must Have (MVP - Completed)

- [x] Single train line: Churchgate → Dadar (6 stations)
- [x] 6 seats in compartment
- [x] 3-4 NPCs initially seated with predetermined destinations
- [x] Player selects boarding station and destination
- [x] Turn-based gameplay: "Next Station" advances the game
- [x] Player actions: Request (ask NPC destination), Claim (take empty seat)
- [x] Win condition: Sit before reaching destination
- [x] Lose condition: Arrive at destination while standing
- [x] Win/Lose screen with "Play Again" button

### Must Have (v2 - Critical Fixes)

- [ ] Increased difficulty: 5-6 NPCs (only 0-1 empty seats at start)
- [ ] Standing passenger competition: NPCs compete for empty seats
- [ ] Journey progress indicator showing all stations visually

### Should Have (v2 - Core Improvements)

- [ ] Difficulty level selection (Easy, Normal, Rush Hour)
- [ ] Visual train theme (compartment looks like actual train)
- [ ] Character designs (distinct passenger sprites instead of text labels)
- [ ] Enhanced win/lose screens with visual celebration/disappointment
- [ ] Station transition animations
- [ ] Sound effects (train sounds, announcements)
- [ ] Extended Western Line option (Churchgate to Borivali)

### Could Have (v3 - Polish)

- [ ] Mobile-first responsive design with touch gestures
- [ ] NPC behavior variety (aggressive, friendly, sleeping)
- [ ] Statistics tracking (win rate, games played, longest streak)
- [ ] Turn/action limits per station for additional challenge

### Won't Have (Out of Scope)

- Multiple train lines (Harbor, Central)
- Multiplayer functionality
- NPC negotiation or bribery mechanics
- Score tracking or leaderboards
- Persistence/save games mid-session
- Authentication or user accounts

---

## User Stories

### Phase 0: Infrastructure (Completed)

#### Story 0.1: Health Check Endpoint ✅

**As a** developer
**I want** a health check endpoint
**So that** I can verify the stack is working

**Status:** Completed

---

### Phase 1: Game Setup (Completed)

#### Story 1.1: Station Selection Screen ✅

**Status:** Completed

#### Story 1.2: Initial Game State Generation ✅

**Status:** Completed

---

### Phase 2: Core Gameplay (Completed)

#### Story 2.1: Compartment View Display ✅

**Status:** Completed

#### Story 2.2: Request NPC Destination Action ✅

**Status:** Completed

#### Story 2.3: Claim Empty Seat Action ✅

**Status:** Completed

#### Story 2.4: Advance to Next Station ✅

**Status:** Completed

---

### Phase 3: Win/Lose Conditions (Completed)

#### Story 3.1: Win Screen ✅

**Status:** Completed

#### Story 3.2: Lose Screen ✅

**Status:** Completed

---

### Phase 4: Difficulty Rebalancing (Critical)

#### Story 4.1: Increase Seat Scarcity

**As a** player
**I want** the game to start with most seats occupied
**So that** I have a genuine challenge finding a seat

**Acceptance Criteria:**

1. Given a game starts
   When the initial state is generated
   Then there are 5-6 NPCs in seats (randomly determined)
   And there are 0-1 empty seats at game start
   And the player MUST wait for NPCs to exit to find a seat

2. Given all seats are occupied at start
   When the game begins
   Then the "Request destination" mechanic becomes essential
   And the player must strategically identify which NPC leaves soonest

3. Given the difficulty is set to "Easy"
   When the game starts
   Then there are 3-4 NPCs (current behavior)
   And there are 2-3 empty seats

4. Given the difficulty is set to "Normal"
   When the game starts
   Then there are 5 NPCs
   And there is 1 empty seat

5. Given the difficulty is set to "Rush Hour"
   When the game starts
   Then there are 6 NPCs
   And there are 0 empty seats
   And player must wait for someone to exit

**Technical Notes:**

- Update `constants.ts`: Add difficulty configuration
- Modify `generateInitialState()` to accept difficulty parameter
- NPC count: Easy (3-4), Normal (5), Rush Hour (6)

**Testing Requirements:**

- Unit: Correct NPC count per difficulty level
- Unit: Rush Hour starts with 0 empty seats
- Integration: Full game playable on each difficulty

**Dependencies:** None (modifies existing code)
**Complexity:** M

---

#### Story 4.2: Standing Passenger Competition

**As a** player
**I want** other standing passengers to compete for empty seats
**So that** I feel urgency and tension when a seat opens

**Acceptance Criteria:**

1. Given the game starts
   When there are occupied seats
   Then there are 1-3 standing NPCs also waiting for seats
   And standing NPCs are visible in a "standing area"

2. Given an NPC vacates a seat
   When the station transition occurs
   Then standing NPCs have a chance to claim the seat first
   And the chance depends on difficulty (Easy: 20%, Normal: 50%, Rush Hour: 80%)

3. Given a standing NPC claims a seat
   When the seat becomes occupied
   Then the player sees "A passenger grabbed the seat!"
   And the seat shows the new NPC
   And the standing NPC count decreases

4. Given the player is faster than standing NPCs
   When a seat opens and player has "hovered" near it
   Then the player gets priority over standing NPCs
   And the player successfully claims the seat

5. Given multiple seats open at once
   When station transition occurs
   Then standing NPCs claim seats one at a time
   And player has opportunity to claim remaining seats

**Technical Notes:**

- Add `standingNPCs: NPC[]` to GameState
- Add "hover near seat" mechanic for player priority
- Standing NPCs rendered below the seat grid
- NPC claim probability configurable per difficulty

**Data Model Addition:**

```
StandingNPC
Field               | Type              | Description
--------------------|-------------------|------------------------
id                  | string            | Unique ID
targetSeatId        | number | null     | Seat they're watching
claimProbability    | number            | 0-1 chance to claim
```

**Testing Requirements:**

- Unit: Standing NPCs generated correctly
- Unit: Claim probability works as expected
- Unit: Player priority when hovering
- Integration: Full competition flow

**Dependencies:** Story 4.1
**Complexity:** L

---

#### Story 4.3: Journey Progress Indicator

**As a** player
**I want** to see a visual representation of my journey
**So that** I can understand how many stations remain and feel urgency

**Acceptance Criteria:**

1. Given I am in a game
   When I view the progress indicator
   Then I see all stations as dots/markers on a horizontal track
   And the current station is highlighted/animated
   And my destination station is marked differently (flag/target)
   And passed stations are dimmed/checked

2. Given the train advances
   When the station changes
   Then the progress indicator animates to show movement
   And the new current station becomes highlighted

3. Given I am 1 station from my destination
   When I view the progress indicator
   Then I see a visual urgency indicator (pulsing, color change)
   And I feel the tension of running out of time

4. Given I am viewing progress
   When I look at any station marker
   Then I see the station name (on hover for desktop, always visible for key stations)

**Technical Notes:**

- Horizontal track component above compartment
- Use CSS animations for train movement
- Stations as circles/diamonds on track
- Current position as train icon or highlighted node

**Testing Requirements:**

- Unit: All stations rendered
- Unit: Current station highlighted
- Unit: Destination marked
- Unit: Urgency state at penultimate station

**Dependencies:** None (visual enhancement)
**Complexity:** M

---

### Phase 5: Visual Theme

#### Story 5.1: Train Compartment Visual Design

**As a** player
**I want** the compartment to look like a real Mumbai local train
**So that** I feel immersed in the experience

**Acceptance Criteria:**

1. Given I view the compartment
   When the game renders
   Then I see seat shapes that look like train seats (not plain rectangles)
   And I see visual train elements (poles, handles, windows)
   And the color scheme matches Mumbai local trains (maroon/cream/silver)

2. Given I view the train window
   When the game is playing
   Then I see a simple background through the window
   And the background scrolls/changes slightly on station transitions

3. Given I view the overall layout
   When comparing to current design
   Then seats are arranged like actual train bench seats
   And there's a clear standing area (aisle)
   And visual hierarchy guides the eye to important elements

4. Given the theme is applied
   When I play the game
   Then all existing functionality still works
   And accessibility is maintained (sufficient contrast, focus states)

**Technical Notes:**

- Create themed seat component with train-seat SVG/CSS shape
- Add train interior background elements
- Mumbai local color palette: maroon (#800000), cream (#FFFDD0), metallic gray
- Maintain all existing interactions

**Testing Requirements:**

- Visual: Compare screenshots to design
- Accessibility: Run axe audit
- Integration: All interactions still work

**Dependencies:** None (visual only)
**Complexity:** L

---

#### Story 5.2: Character Designs for Passengers

**As a** player
**I want** to see distinct passenger characters instead of text labels
**So that** the game feels more alive and memorable

**Acceptance Criteria:**

1. Given I view an occupied seat
   When an NPC is sitting
   Then I see a simple character sprite/illustration (not just "Passenger" text)
   And different NPCs have visually distinct appearances

2. Given I view my own seat (when seated)
   When I am sitting
   Then I see a distinct "player" character
   And the player character is clearly different from NPCs

3. Given I view standing passengers
   When standing NPCs are present
   Then they also have character sprites
   And they're visually distinct from seated passengers (posture)

4. Given I view any character
   When looking at details
   Then characters have:
   - Simple, recognizable silhouettes
   - Appropriate Mumbai commuter attire variety
   - Gender and age diversity
   - No offensive stereotypes

5. Given an NPC's destination is revealed
   When I have asked their destination
   Then a speech bubble or badge shows the station name
   And the character remains visible (not replaced by text)

**Technical Notes:**

- Create 6-8 distinct passenger character designs
- SVG or PNG sprites with transparent backgrounds
- Simple illustration style (not photorealistic)
- Speech bubble component for revealed destinations

**Testing Requirements:**

- Visual: All character variants render correctly
- Accessibility: Alt text for character images
- Integration: Destination reveal works with characters

**Dependencies:** Story 5.1
**Complexity:** L

---

#### Story 5.3: Enhanced Win/Lose Screens

**As a** player
**I want** more celebratory/dramatic win/lose screens
**So that** the game ending feels impactful and satisfying

**Acceptance Criteria:**

1. Given I win the game
   When the win screen appears
   Then I see celebration animations (confetti, sparkles, or similar)
   And my seated character is shown looking relaxed/happy
   And there's a satisfying sound effect (if sound enabled)
   And the message is encouraging

2. Given I lose the game
   When the lose screen appears
   Then I see a disappointed character standing in crowded train
   And the visual tone is humorous/sympathetic (not punishing)
   And there's an appropriate sound effect (if sound enabled)
   And the message encourages retry

3. Given I see the end screen
   When viewing game statistics
   Then I see:
   - Stations I survived standing (if lost)
   - How close I was to my destination
   - "Play Again" / "Try Again" button prominently displayed

4. Given animations play
   When on slow devices
   Then animations don't block interaction
   And animations can be skipped by clicking
   And performance remains acceptable

**Technical Notes:**

- CSS animations for confetti/celebration (no external libs)
- Illustrated end-state scenes
- Keep modal structure, enhance contents

**Testing Requirements:**

- Unit: Win screen shows celebration
- Unit: Lose screen shows disappointment
- Visual: Animations render correctly
- Performance: < 100ms to interactive

**Dependencies:** Story 5.2
**Complexity:** M

---

### Phase 6: Game Feel

#### Story 6.1: Station Transition Animations

**As a** player
**I want** smooth animations when the train moves between stations
**So that** the game feels polished and alive

**Acceptance Criteria:**

1. Given I click "Next Station"
   When the station advances
   Then I see a brief train movement animation
   And the screen shakes subtly to simulate train motion
   And the transition takes ~500ms

2. Given NPCs exit at a station
   When the transition occurs
   Then departing NPCs animate out (slide/fade)
   And their seats visibly become empty
   And the transition is smooth, not jarring

3. Given standing NPCs claim seats
   When a seat is taken
   Then the standing NPC animates into the seat
   And there's a brief "seat taken" indicator

4. Given I claim a seat
   When I click "Claim Seat"
   Then my character animates into the seat
   And there's a satisfying "success" visual feedback

5. Given animations are playing
   When I try to interact
   Then interactions are queued, not lost
   And animations don't break game state

**Technical Notes:**

- CSS transitions for all movements
- Use Tailwind animation utilities
- Animation timing: 300-500ms
- Ensure game state updates after animations complete

**Testing Requirements:**

- Unit: Game state correct after animations
- Visual: Animations smooth at 60fps
- Integration: No interaction loss during animation

**Dependencies:** Story 5.1
**Complexity:** M

---

#### Story 6.2: Sound Effects

**As a** player
**I want** appropriate sound effects for game events
**So that** the game feels more immersive

**Acceptance Criteria:**

1. Given the game is in sound-enabled mode
   When the train advances
   Then I hear:
   - Train movement/wheel sounds
   - Station announcement ("Agla station: [name]") - text-to-speech or audio
   - Door closing sound

2. Given I interact with seats
   When I click on seats
   Then I hear subtle interaction sounds
   And sounds are not annoying or repetitive

3. Given game events occur
   When I win/lose
   Then I hear appropriate music/sounds
   - Win: Celebratory jingle
   - Lose: Sympathetic sound

4. Given I prefer no sound
   When I toggle sound off
   Then all sounds are muted
   And sound preference persists during session
   And there's a clear mute/unmute button

5. Given sound is enabled
   When sounds play
   Then sounds don't overlap annoyingly
   And sounds are appropriately volumed
   And sounds work on mobile

**Technical Notes:**

- Use Web Audio API or simple `<audio>` elements
- Preload short audio clips
- Audio sprite for multiple sounds
- Mute button in game header
- Consider royalty-free Mumbai local train sounds

**Testing Requirements:**

- Integration: Sounds play at correct times
- Unit: Mute toggle works
- Accessibility: Game fully playable without sound

**Dependencies:** None (can be independent)
**Complexity:** M

---

### Phase 7: Difficulty Options

#### Story 7.1: Difficulty Level Selection

**As a** player
**I want** to choose my difficulty level before starting
**So that** I can pick a challenge appropriate to my skill

**Acceptance Criteria:**

1. Given I am on the station selection screen
   When I view the form
   Then I see a difficulty selector with options:
   - Easy: "Plenty of seats, few competitors"
   - Normal: "One seat, some competition" (default)
   - Rush Hour: "No seats, fierce competition"

2. Given I select a difficulty
   When I start the game
   Then the game generates state according to that difficulty
   And the difficulty is shown during gameplay

3. Given I am a new player
   When I first visit
   Then "Normal" is pre-selected
   And I can easily change to "Easy" to learn

4. Given I have played before
   When I return
   Then my last selected difficulty is remembered (session only)

**Technical Notes:**

- Add difficulty to URL params: `/game?boarding=X&destination=Y&difficulty=normal`
- Difficulty configs:
  ```
  Easy: { npcCount: 3-4, standingNpcs: 0, claimChance: 0.2 }
  Normal: { npcCount: 5, standingNpcs: 1-2, claimChance: 0.5 }
  Rush Hour: { npcCount: 6, standingNpcs: 2-3, claimChance: 0.8 }
  ```
- Radio button or segmented control for selection

**Testing Requirements:**

- Unit: Difficulty configs applied correctly
- Integration: Full game on each difficulty
- E2E: Difficulty selection flow

**Dependencies:** Story 4.1, Story 4.2
**Complexity:** M

---

#### Story 7.2: Extended Journey Option

**As a** player
**I want** the option to play a longer journey
**So that** I can have a more challenging experience

**Acceptance Criteria:**

1. Given I am on the station selection screen
   When I view station options
   Then I see a toggle/selector for "Line":
   - "Short Line" (Churchgate → Dadar, 6 stations) - Default
   - "Full Line" (Churchgate → Borivali, 15 stations)

2. Given I select "Full Line"
   When I view boarding options
   Then I see all 15 stations as boarding options
   And destination options update accordingly

3. Given I play on "Full Line"
   When the game progresses
   Then more NPCs get on/off at intermediate stations
   And the game is significantly longer and more complex
   And the progress indicator scales to show all stations

4. Given I am on "Full Line"
   When station transitions occur
   Then new NPCs may board at some stations
   And seat dynamics change more throughout the journey

**Technical Notes:**

- Extended stations array:
  ```
  ["Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central",
   "Dadar", "Matunga Road", "Mahim", "Bandra", "Khar Road", "Santacruz",
   "Vile Parle", "Andheri", "Jogeshwari", "Borivali"]
  ```
- Add NPC boarding logic at intermediate stations
- Progress indicator must scale for longer journey

**Testing Requirements:**

- Unit: Extended stations array works
- Unit: NPC boarding at intermediate stations
- Integration: Full long journey playable

**Dependencies:** Story 4.3
**Complexity:** L

---

### Phase 8: Mobile & Polish

#### Story 8.1: Mobile-First Responsive Design

**As a** mobile user
**I want** the game to work well on my phone
**So that** I can play during my commute

**Acceptance Criteria:**

1. Given I am on a mobile device
   When I view the game
   Then the layout fits the screen width
   And touch targets are at least 44x44px
   And text is readable without zooming

2. Given I interact on mobile
   When I tap seats
   Then popovers appear in accessible positions (not off-screen)
   And tapping outside closes popovers
   And there's clear visual feedback for taps

3. Given I want to advance stations
   When playing on mobile
   Then the "Next Station" button is easily reachable (thumb zone)
   And I can optionally swipe left to advance

4. Given different screen sizes
   When playing on various devices
   Then the compartment scales appropriately
   And the progress indicator remains visible
   And no horizontal scrolling is needed

5. Given I am on a slow mobile connection
   When the game loads
   Then the initial load is < 5s on 3G
   And the game is playable offline after load

**Technical Notes:**

- Use Tailwind responsive classes
- Test on common viewport sizes: 375px, 414px, 768px
- Consider landscape mode for tablets
- Touch event handling for swipe gestures

**Testing Requirements:**

- Visual: Responsive across viewports
- Accessibility: Touch targets sized correctly
- Performance: Load time on throttled connection

**Dependencies:** None
**Complexity:** M

---

#### Story 8.2: NPC Behavior Variety

**As a** player
**I want** NPCs to have different personalities
**So that** the game feels more dynamic and unpredictable

**Acceptance Criteria:**

1. Given NPCs are generated
   When the game starts
   Then each NPC has a behavior type:
   - Normal: Standard behavior (most common)
   - Sleepy: Won't respond to destination questions (must observe their ticket/bag)
   - Aggressive: Higher priority claiming empty seats
   - Friendly: Might offer hints about when they're leaving

2. Given a "Sleepy" NPC
   When I try to ask their destination
   Then I see "They're sleeping..." message
   And I cannot learn their destination directly
   And I must wait and observe when they exit

3. Given a "Friendly" NPC
   When I ask their destination
   Then they might also mention another NPC's destination
   And this gives the player bonus information

4. Given an "Aggressive" standing NPC
   When a seat opens
   Then they have higher claim probability
   And they're visually distinct (standing closer to seats)

**Technical Notes:**

- Add `behaviorType` to NPC interface
- Behavior distribution: 60% Normal, 15% Sleepy, 15% Aggressive, 10% Friendly
- Visual indicators for each type (icons or poses)

**Testing Requirements:**

- Unit: Behavior types generated correctly
- Unit: Each behavior works as specified
- Integration: Game playable with mixed behaviors

**Dependencies:** Story 4.2, Story 5.2
**Complexity:** L

---

#### Story 8.3: Statistics Tracking

**As a** player
**I want** to see my game statistics
**So that** I can track my improvement over time

**Acceptance Criteria:**

1. Given I complete a game
   When the session ends
   Then my stats are updated:
   - Total games played
   - Games won / Games lost
   - Win rate percentage
   - Current win streak
   - Best win streak

2. Given I return to the home page
   When I view the form
   Then I see my stats summary
   And I can tap to see detailed stats

3. Given I am on the stats view
   When I want to reset
   Then I see a "Reset Stats" button
   And confirmation is required before reset

4. Given stats are tracked
   When I close and reopen the browser
   Then my stats persist
   And stats are stored in localStorage

**Technical Notes:**

- Use localStorage for stats persistence
- Stats object:
  ```
  {
    gamesPlayed: number,
    gamesWon: number,
    currentStreak: number,
    bestStreak: number,
    lastPlayed: ISO date
  }
  ```
- Stats component on home page

**Testing Requirements:**

- Unit: Stats update correctly on win/lose
- Unit: Streak calculation works
- Integration: localStorage persistence works
- Unit: Reset clears all stats

**Dependencies:** None (can be built independently)
**Complexity:** M

---

## Data Models

### GameState (Updated)

```
Field               | Type                  | Description
--------------------|-----------------------|------------------------
currentStation      | number                | Index in stations array
playerBoardingStation | number              | Index where player boarded
playerDestination   | number                | Index where player exits
playerSeated        | boolean               | Whether player has a seat
seatId              | number | null         | Which seat player is in
seats               | Seat[]                | Array of 6 seats
standingNPCs        | StandingNPC[]         | NPCs waiting for seats (NEW)
gameStatus          | 'playing'|'won'|'lost'| Current game status
difficulty          | 'easy'|'normal'|'rush'| Selected difficulty (NEW)
hoveredSeatId       | number | null         | Seat player is "hovering" near (NEW)
```

### Seat

```
Field               | Type              | Description
--------------------|-------------------|------------------------
id                  | number            | Seat ID (0-5)
occupant            | NPC | null        | NPC in seat, or null if empty
```

### NPC (Updated)

```
Field               | Type              | Description
--------------------|-------------------|------------------------
id                  | string            | Unique ID (e.g., "npc-1")
destination         | number            | Station index where NPC exits
destinationRevealed | boolean           | Whether player knows destination
behaviorType        | BehaviorType      | 'normal'|'sleepy'|'aggressive'|'friendly' (NEW)
characterSprite     | number            | Index of character design to use (NEW)
```

### StandingNPC (New)

```
Field               | Type              | Description
--------------------|-------------------|------------------------
id                  | string            | Unique ID
targetSeatId        | number | null     | Seat they're watching
claimPriority       | number            | 0-1 priority for claiming
behaviorType        | BehaviorType      | Affects claim behavior
characterSprite     | number            | Character design index
```

### DifficultyConfig (New)

```
Field               | Type              | Description
--------------------|-------------------|------------------------
name                | string            | 'easy' | 'normal' | 'rush'
displayName         | string            | 'Easy' | 'Normal' | 'Rush Hour'
seatedNpcCount      | [number, number]  | [min, max] NPCs at start
standingNpcCount    | [number, number]  | [min, max] standing NPCs
npcClaimChance      | number            | 0-1 probability
```

### PlayerStats (New - localStorage)

```
Field               | Type              | Description
--------------------|-------------------|------------------------
gamesPlayed         | number            | Total games
gamesWon            | number            | Wins
currentStreak       | number            | Current win streak
bestStreak          | number            | All-time best streak
lastPlayed          | string            | ISO date of last game
```

### Constants (Updated)

```
STATIONS_SHORT = ["Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central", "Dadar"]

STATIONS_LONG = ["Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central",
                 "Dadar", "Matunga Road", "Mahim", "Bandra", "Khar Road", "Santacruz",
                 "Vile Parle", "Andheri", "Jogeshwari", "Borivali"]

TOTAL_SEATS = 6

DIFFICULTY_CONFIGS = {
  easy: { seatedNpcs: [3, 4], standingNpcs: [0, 0], claimChance: 0.2 },
  normal: { seatedNpcs: [5, 5], standingNpcs: [1, 2], claimChance: 0.5 },
  rush: { seatedNpcs: [6, 6], standingNpcs: [2, 3], claimChance: 0.8 }
}

CHARACTER_SPRITES = 8  // Number of distinct character designs

BEHAVIOR_DISTRIBUTION = { normal: 0.6, sleepy: 0.15, aggressive: 0.15, friendly: 0.1 }
```

## API Specifications

No backend APIs required. All game logic runs client-side.

### Health Check (Infrastructure Only)

- **Method**: GET
- **Path**: /api/health
- **Auth**: Public
- **Response**: `{ "status": "ok", "timestamp": "2024-01-15T10:30:00.000Z" }`

## Success Metrics

| Metric               | Target           | How Measured           |
| -------------------- | ---------------- | ---------------------- |
| Test Coverage        | 90%+             | Vitest coverage report |
| Initial Load Time    | < 3s             | Lighthouse CI          |
| Quality Gates        | All pass         | `/validate` command    |
| Win Rate (Normal)    | 40-60%           | Manual playtesting     |
| Win Rate (Rush Hour) | 20-40%           | Manual playtesting     |
| Mobile Usability     | > 90 Lighthouse  | Lighthouse audit       |
| Accessibility        | 0 axe violations | E2E accessibility test |

## Risks and Mitigations

| Risk                        | Likelihood | Impact | Mitigation                                         |
| --------------------------- | ---------- | ------ | -------------------------------------------------- |
| Game still too easy         | Low        | High   | Tune NPC claim probability, add more standing NPCs |
| Game too frustrating        | Medium     | High   | Include Easy mode, provide clear feedback          |
| Animations cause jank       | Medium     | Medium | Use CSS transforms, test on low-end devices        |
| Sound annoying              | Low        | Low    | Default muted, make toggle prominent               |
| Scope creep                 | Medium     | Medium | Strict adherence to phase boundaries               |
| Character design takes long | Medium     | Medium | Use simple/abstract style, could use placeholders  |

---

## Implementation Priority

### Immediate Priority (v2.0 - Critical Fixes)

1. Story 4.1: Increase Seat Scarcity
2. Story 4.2: Standing Passenger Competition
3. Story 4.3: Journey Progress Indicator

### High Priority (v2.1 - Core Experience)

4. Story 7.1: Difficulty Level Selection
5. Story 5.1: Train Compartment Visual Design
6. Story 5.2: Character Designs
7. Story 5.3: Enhanced Win/Lose Screens

### Medium Priority (v2.2 - Polish)

8. Story 6.1: Station Transition Animations
9. Story 6.2: Sound Effects
10. Story 8.1: Mobile-First Responsive Design

### Lower Priority (v3.0 - Extended Features)

11. Story 7.2: Extended Journey Option
12. Story 8.2: NPC Behavior Variety
13. Story 8.3: Statistics Tracking

---

_PRD Version: 2.0_
_Last Updated: 2024-12-21_
_Status: Approved_
