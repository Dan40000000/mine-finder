import { useState } from 'react'
import Game from './components/Game'
import Stats from './components/Stats'
import Menu from './components/Menu'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('menu') // 'menu', 'game', 'stats'
  const [gameConfig, setGameConfig] = useState(null)

  const startGame = (config) => {
    setGameConfig(config)
    setCurrentView('game')
  }

  const backToMenu = () => {
    setCurrentView('menu')
    setGameConfig(null)
  }

  return (
    <div className="app">
      {currentView === 'menu' && (
        <Menu onStartGame={startGame} onViewStats={() => setCurrentView('stats')} />
      )}
      {currentView === 'game' && gameConfig && (
        <Game config={gameConfig} onBack={backToMenu} />
      )}
      {currentView === 'stats' && (
        <Stats onBack={() => setCurrentView('menu')} />
      )}
    </div>
  )
}

export default App
