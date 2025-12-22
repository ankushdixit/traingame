# Mumbai Local Train Game

A strategy game where you compete for a seat on a Mumbai local train before reaching your destination.

**Play Now:** https://traingame.ankushdixit.com

## The Game

You're standing in a crowded Mumbai local train compartment. All 6 seats are taken. Your mission: get a seat before you reach your destination — or arrive standing (and lose).

### How to Play

1. **Choose your journey** — Select boarding and destination stations
2. **Pick difficulty** — Easy, Normal, or Rush Hour
3. **Use your actions** — You get 2 actions per turn:
   - **Ask** — Find out which station an NPC is getting off
   - **Watch** — Mark a seat for a grab speed bonus
   - **Move** — Reposition in the aisle (6 standing spots)
4. **Advance** — Click "Next Station" to progress
5. **Grab seats** — When NPCs exit, race to claim their seat
6. **Win** — Get seated before your destination

### Strategy Tips

- Use **Ask** to discover who's leaving soon
- **Watch** a seat for a 300ms speed advantage when grabbing
- Position yourself **adjacent** to seats likely to open (-150ms bonus)
- On Rush Hour, NPCs are faster — plan ahead!

## Features

- **Two game modes** — Short Line (6 stations) or Full Line (15 stations)
- **3 difficulty levels** — Easy, Normal, Rush Hour
- **8 unique NPC characters** — Each with distinct appearances
- **Turn-based strategy** — Plan your moves carefully
- **Grab competition** — Real-time seat claiming with speed bonuses
- **Sound effects** — Train sounds, announcements, win/lose jingles
- **Mobile responsive** — Works on desktop and mobile

## Tech Stack

| Component     | Technology                   |
| ------------- | ---------------------------- |
| **Framework** | Next.js 16.0.10              |
| **Language**  | TypeScript 5.9.3             |
| **UI**        | React 19.2.1                 |
| **Styling**   | Tailwind CSS 4.1.17          |
| **Testing**   | Jest + React Testing Library |
| **E2E**       | Playwright                   |

## Quality

| Metric            | Result              |
| ----------------- | ------------------- |
| **Test Coverage** | 89%                 |
| **Tests**         | 704 passing         |
| **Components**    | 53 React components |
| **Type Checking** | TypeScript strict   |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/ankushdixit/traingame.git
cd traingame

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

## Testing

```bash
# Run all tests
npm test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Linting
npm run lint

# Type checking
npm run type-check
```

## Project Structure

```
traingame/
├── app/                  # Next.js App Router
│   ├── game/            # Main game page
│   └── api/             # API routes
├── components/          # React components (53 total)
│   ├── game/            # Game UI components
│   └── characters/      # NPC sprite components
├── lib/                 # Core game logic
│   ├── gameLogic.ts     # State management
│   ├── grabCompetition.ts # Seat claiming mechanics
│   └── constants.ts     # Stations, difficulty configs
├── hooks/               # Custom React hooks
├── contexts/            # React Context (sound management)
└── tests/               # Test files (44 total)
```

## Game Mechanics

### Difficulty Levels

| Difficulty | Standing NPCs | NPC Speed          | Boarding Rate |
| ---------- | ------------- | ------------------ | ------------- |
| Easy       | 2-3           | Slow (300-600ms)   | 30%           |
| Normal     | 3-4           | Medium (250-550ms) | 50%           |
| Rush Hour  | 5-6           | Fast (200-500ms)   | 70%           |

### Speed Bonuses

| Action           | Bonus  |
| ---------------- | ------ |
| Watching a seat  | -300ms |
| Adjacent to seat | -150ms |
| Far from seat    | +150ms |

## Background

This project was built live during [The Anti-Vibe-Coding Challenge](https://antivibecode.ankushdixit.com) on December 20, 2024 — a public experiment in structured AI development using Claude Code and Solokit.

The goal: build a production-ready app with 90%+ test coverage, live, from an audience-submitted idea.

**Result:** 89% coverage, 704 tests, fully playable game.

## License

MIT

---

Built with [Solokit](https://github.com/anthropics/solokit) + [Claude Code](https://claude.com/claude-code)
