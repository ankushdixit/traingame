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
- Game configuration constants (TOTAL_SEATS, MIN_NPCS, MAX_NPCS)
- Compartment view display with 2x3 seat grid layout
- Game page at `/game` with URL-based state management
- GameHeader component showing current station, next station, destination, and remaining stations
- Seat component with 4 display states (empty, occupied, occupied-known, player)
- PlayerStatus component showing standing/seated status

### Changed

### Fixed

### Removed
