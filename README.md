<span style="text-align: center;">

[![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=FFD62E)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Spring](https://img.shields.io/badge/React_Spring-10-6DB33F)](https://www.react-spring.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-7C5CFC)](https://zustand-demo.pmnd.rs/)

# TamaGatcha

<img width="300" height="68" src="https://github.com/mizziness/tamagatcha/blob/main/public/images/egg_previews.png?raw=true" style="margin: 2rem auto; display: block;" />

A Tamagotchi-style virtual pet browser game built with React, Vite, and React Router.

TamaGatcha is a local-first virtual pet game where players hatch, care for, and eventually lose pets over time. Data is persisted in localStorage (accounts, active session, pets, eggs, and per-pet events).

</span>

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
- Local auth with Zustand (register/login)

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- React Spring
- Zustand
- Jest

## Routes

- `/` — Home
- `/hatchery` — Egg selection and naming
- `/play` — Active pet gameplay
- `/game-over` — Game over summary
- `/register` — Login/register page
- `/account` — Account page
- `/collection` — Collection page

## Getting Started

```bash
npm install
npm run dev
npm test
```

## Project Structure

```
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
  helpers/      Gameplay and utility helpers
    eggSelection.utils.js
    gameTiming.js
    petRules.js
    usePetActions.js
```

## Current Status

The current app supports:

- Core pet loop (actions, stat decay, death checks)
- Persistent active pet updates while navigating routes
- Egg hatch flow with reroll UX and rarity labeling
- Local auth/session handling
- Pet activity/event log on the Play screen
- Unit test setup with Jest

In progress:

- Account and collection UX polish
- Graveyard view for deceased pets

## Roadmap

Near-term

- Inline validation feedback (replace alert-based errors)
- Account page improvements (logout, active pet summary)
- Collection + graveyard polish
- Better route guards and auth gating
- Automated tests (unit + integration smoke coverage)

Future

- Contests
- Outings and trips
- Trading and crossbreeding
- Trophy case and achievements
- Longer-term persistence layer with stronger data ownership

Notes

- Auth is local-only for now
- Persistence is local-first (localStorage)
- Backend architecture is planned but not finalized
