# Run a Business

A React + TypeScript + Vite runner-style decision game for CSE 312.

Players automatically move toward a sequence of options. At each option, they choose left or right using keyboard controls, touch buttons, or swipe gestures. Each choice changes hidden system stats like profit, visibility, platform dependence, and worker strain.

The project explores how short-term business decisions can create long-term dependence, pressure, and loss of autonomy inside platform-driven systems.

## Features

- Mobile-first runner gameplay
- Keyboard, button, and swipe controls
- Swipe-up speed boost
- Dynamic endings and takeaways
- Generated comparison stats after each run
- Firebase Realtime Database run saving
- Desktop-only host dashboard with averages and class interpretation
- QR code support for phone play during presentations
- Stony Brook themed branding and Wolfie-style runner sprite

## Tech Stack

- React
- TypeScript
- Vite
- Firebase Realtime Database
- CSS

## Local Setup

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Notes

The host dashboard is designed for desktop/laptop presentation use. The player-facing game is designed to work best on phones, while still being playable on desktop.
