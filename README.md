# Bomb Squad

A modern Minesweeper game built with React and deployed as an iOS app using Capacitor.

## Features

- 4 difficulty levels: 10x10, 20x20, 30x30, and 50x50 grids
- Custom mine count configuration
- Victory and game over animations with fireworks and confetti
- Stats tracking system
- Marking mode for flagging suspected mines
- Mobile-optimized UI designed for iPhone
- Custom blue gradient app icon

## Tech Stack

- React + Vite for the web app
- Capacitor for iOS deployment
- CSS animations for visual effects
- LocalStorage for stats persistence

## Development

### Web Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### iOS Development
```bash
npm run build
npx cap sync ios
npx cap open ios
```

Then build and run from Xcode.

## App Store Information

- **App Name**: Bomb Squad
- **Bundle ID**: com.minefinder.app
- **Version**: 1.0
- **Build**: 1
- **iOS Version**: 14.0+

## Project Structure

```
src/
├── components/
│   ├── Menu.jsx      # Main menu with difficulty selection
│   ├── Game.jsx      # Game board and logic
│   ├── Cell.jsx      # Individual cell component
│   └── Stats.jsx     # Statistics display
├── utils/
│   ├── gameLogic.js      # Minesweeper game logic
│   └── statsManager.js   # Stats tracking
└── App.jsx           # Main app component

ios/
└── App/              # iOS Capacitor project
```
