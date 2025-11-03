import { useState } from 'react'

const SIZES = [
  { label: '10x10', size: 10, defaultMines: 15, maxMines: 80 },
  { label: '20x20', size: 20, defaultMines: 60, maxMines: 320 },
  { label: '30x30', size: 30, defaultMines: 150, maxMines: 720 },
  { label: '50x50', size: 50, defaultMines: 400, maxMines: 2000 }
]

function Menu({ onStartGame, onViewStats }) {
  const [selectedSize, setSelectedSize] = useState(SIZES[0])
  const [mineCount, setMineCount] = useState(SIZES[0].defaultMines)
  const [error, setError] = useState('')

  const handleSizeChange = (sizeOption) => {
    setSelectedSize(sizeOption)
    setMineCount(sizeOption.defaultMines)
    setError('')
  }

  const handleMineCountChange = (e) => {
    const value = parseInt(e.target.value)
    setMineCount(value)

    if (value < 1) {
      setError('Must have at least 1 mine')
    } else if (value > selectedSize.maxMines) {
      setError(`Max ${selectedSize.maxMines} mines for ${selectedSize.label}`)
    } else {
      setError('')
    }
  }

  const handleStart = () => {
    if (error || mineCount < 1 || mineCount > selectedSize.maxMines) {
      return
    }

    onStartGame({
      size: selectedSize.size,
      mineCount: mineCount
    })
  }

  return (
    <div className="menu">
      <h1 className="title">Mine Finder</h1>
      <p className="subtitle">Find all the safe cells without hitting a mine!</p>

      <div className="size-selector">
        <h2>Select Grid Size</h2>
        <div className="size-buttons">
          {SIZES.map((sizeOption) => (
            <button
              key={sizeOption.label}
              className={`size-button ${selectedSize.label === sizeOption.label ? 'active' : ''}`}
              onClick={() => handleSizeChange(sizeOption)}
            >
              {sizeOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mine-input">
        <h2>Number of Mines</h2>
        <div className="input-group">
          <input
            type="number"
            min="1"
            max={selectedSize.maxMines}
            value={mineCount}
            onChange={handleMineCountChange}
          />
          <span className="input-hint">
            (Max: {selectedSize.maxMines})
          </span>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="menu-buttons">
        <button className="start-button" onClick={handleStart} disabled={!!error}>
          Start Game
        </button>
        <button className="stats-button" onClick={onViewStats}>
          View Stats
        </button>
      </div>

      <div className="instructions">
        <h3>How to Play</h3>
        <ul>
          <li><strong>Click</strong> a cell to reveal it</li>
          <li><strong>Toggle ▲ Marking</strong> button to mark mines</li>
          <li><strong>Numbers</strong> show how many mines are nearby</li>
          <li><strong>Goal:</strong> Reveal all safe cells without hitting a mine!</li>
        </ul>
      </div>
    </div>
  )
}

export default Menu
