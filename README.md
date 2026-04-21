# TamaGatcha

[![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=FFD62E)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Store-7C5CFC)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A Tamagotchi-style virtual pet game built with React, Vite, and React Router.

TamaGatcha is a local-first virtual pet game where players hatch, care for, and eventually lose pets over time. The current build focuses on the core gameplay loop, route structure, and early auth foundations for future progression systems.

## Preview

> TODO: Will add a screenshot or GIF here once the UI is stable.

## Features

- Hatch a pet from an egg selection screen
- Track live pet stats:
  - Hunger
  - Happiness
  - Energy
  - Health
  - Cleanliness
- Perform care actions:
  - Feed
  - Play
  - Sleep
  - Clean
- Automatic stat decay over time
- Game over flow with restart
- Route-based navigation with React Router
- Local auth foundation using Zustand

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- Zustand

## Routes

- `/` — Home / egg selection
- `/play` — Active pet gameplay
- `/game-over` — Game over summary
- `/register` — Registration page
- `/account` — Account page

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/   Shared UI components
  pages/        Route-level page components
  routes/       Route definitions and path constants
  store/        Zustand stores
  usePetActions.js
```

## Current Status

The current app supports the core single-pet gameplay loop and early account/routing work. It is still in active development and some route-level pages are placeholders while broader progression systems are being designed.

## Roadmap

MVP+

- Auth-aware home experience
- Hatchery page
- Collection page for active pets
- Graveyard page for deceased pets
- Store page for food, toys, and decorations
- Expanded account page

Future

- Contests
- Outings and trips
- Trading and crossbreeding
- Trophy case and achievements
- Longer-term persistence layer with stronger data ownership

Notes

- Current auth is local-only
- Current persistence is local-first
- Backend architecture is planned, but not finalized
