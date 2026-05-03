<span style="text-align: center;">

[![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=FFD62E)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Spring](https://img.shields.io/badge/React_Spring-10-6DB33F)](https://www.react-spring.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-7C5CFC)](https://zustand-demo.pmnd.rs/)
[![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

# TamaGatcha

<img width="300" height="68" src="https://github.com/mizziness/tamagatcha/blob/main/public/images/egg_previews.png?raw=true" style="margin: 2rem auto; display: block;" />

A Tamagotchi-style virtual pet browser game built with React, Vite, and React Router.

TamaGatcha is a local-first, state-heavy frontend game focused on maintainable architecture and reliable persistence.

</span>

## What Is Under the Hood

- A feature-rich SPA with clear domain boundaries
- Persistent client-side state with Zustand
- Route-driven user flows with guardrails
- Safe handling of unreliable persisted data
- Iterative hardening with linting, tests, and audit tracking

## Features

- Hatch a pet from a randomized egg selection screen
- Track live pet stats:
  - Hunger
  - Happiness
  - Energy
  - Health
  - Cleanliness
  - Age and life stage
- Perform care actions:
  - Feed
  - Play
  - Sleep
  - Clean
- Automatic stat decay over time with stage-based aging
- Egg animation system (idle wiggle, hover bounce, reroll fade transitions)
- Per-user pet persistence in localStorage
- Activity/event log for each pet (hatch, actions, stage changes, death)
- Game-over flow with restart from hatchery
- Route-based navigation with React Router
- Local auth/session handling via Zustand

## Why I Built It

This started as a fun side project to get me back up to speed on modern React tooling and actually ship a playable game.

As it grew, it also became a strong showcase of what I can build end-to-end, including gameplay systems, UI/UX, visual design, and engineering quality work.

Also, yes, your pet can die if ignored or when it reaches max lifespan. That part is intentional.

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- React Spring 10
- Zustand 5
- Jest
- ESLint

## Architecture Snapshot

- `src/pages`: Route-level views and navigation flow
- `src/components`: Reusable UI components
- `src/store`: Domain state and persistence handling
- `src/helpers`: Gameplay logic and utility functions
- `src/routes`: Route constants and app route definitions

This structure helps keep UI, state, and business rules separate enough for fast iteration without (too much) chaos.

## Routes

- `/`: Home
- `/hatchery`: Egg selection and naming
- `/play`: Active pet gameplay
- `/game-over`: End-of-life summary
- `/register`: Login/register
- `/account`: Account page
- `/collection`: Pet collection page

## Quality, Security, and Performance

This project uses an active audit and hardening checklist documented in `.github/context/AUDIT.md`.

Recent improvements include:

- Safe session parsing centralized through helper utilities
- Play page session source moved to auth store (single source of truth)
- Defensive parsing tests added for utility functions
- Lint rules and workspace formatting standardized

The audit summary in `.github/context/AUDIT.md` is updated as findings are resolved.

## Getting Started

```bash
npm install
npm run dev
npm test
npm run lint
```

## Project Structure

```text
gameConfig.js
src/
  components/   Shared UI components
    EventLog.jsx
    ProtectedRoute.jsx
  pages/        Route-level page components
    Play.jsx
  routes/       Route definitions and path constants
  store/        Zustand stores
    authStore.js
    eggStore.js
    petStore.js
    settingsStore.js
  helpers/      Gameplay and utility helpers
    eggSelection.js
    gameTiming.js
    petRules.js
    usePetActions.js
    utilities.js
```

## Current Status

What works now:

- Core pet loop (actions, stat decay, death checks)
- Persistent active pet updates while navigating routes
- Egg hatch flow with reroll UX and rarity labeling
- Local auth/session handling
- Pet activity/event log on the Play screen
- Unit test setup and utility safety tests

In progress:

- Account and collection UX polish
- Graveyard view for deceased pets
- Additional performance cleanup from open audit findings

## Roadmap

Near-term:

- Inline validation feedback (replace alert-based errors)
- Improve selector and memoization usage in remaining hot paths
- Expand unit coverage around store initialization and malformed storage

Future:

- Contests
- Outings and trips
- Trading and crossbreeding
- Trophy case and achievements
- Optional backend persistence path

## Notes

- Auth is local-only for now
- Persistence is intentionally local-first
- Backend architecture is a planned expansion path, not a current dependency

## License

MIT
