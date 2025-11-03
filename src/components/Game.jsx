import { useState, useEffect, useCallback } from 'react'
import Cell from './Cell'
import { createBoard, revealCell, toggleFlag, checkWin, revealAllMines } from '../utils/gameLogic'
import { recordGame, formatTime } from '../utils/statsManager'

function Game({ config, onBack }) {
  const { size, mineCount } = config

  const [board, setBoard] = useState(() => createBoard(size, mineCount))
  const [gameState, setGameState] = useState('playing') // 'playing', 'won', 'lost'
  const [timer, setTimer] = useState(0)
  const [flagCount, setFlagCount] = useState(0)
  const [firstClick, setFirstClick] = useState(true)
  const [markingMode, setMarkingMode] = useState(false)

  // Timer logic
  useEffect(() => {
    if (gameState === 'playing' && !firstClick) {
      const interval = setInterval(() => {
        setTimer((t) => t + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameState, firstClick])

  // Count flags
  useEffect(() => {
    let count = 0
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col].isFlagged) count++
      }
    }
    setFlagCount(count)
  }, [board, size])

  const handleCellClick = useCallback((row, col) => {
    if (gameState !== 'playing') return

    const cell = board[row][col]

    // If in marking mode, toggle flag instead of revealing
    if (markingMode) {
      if (!cell.isRevealed) {
        const newBoard = toggleFlag(board, row, col)
        setBoard(newBoard)
      }
      return
    }

    if (cell.isRevealed || cell.isFlagged) return

    if (firstClick) {
      setFirstClick(false)
    }

    // Reveal the cell
    const newBoard = revealCell(board, row, col, size)

    // Check if hit a mine
    if (cell.isMine) {
      const revealedBoard = revealAllMines(newBoard, size)
      setBoard(revealedBoard)
      setGameState('lost')
      recordGame(size, false, timer, mineCount, firstClick)
      return
    }

    setBoard(newBoard)

    // Check if won
    if (checkWin(newBoard, size)) {
      setGameState('won')
      recordGame(size, true, timer, mineCount, false)
    }
  }, [board, gameState, size, timer, firstClick, markingMode, mineCount])

  const handleCellRightClick = useCallback((row, col) => {
    if (gameState !== 'playing') return

    const newBoard = toggleFlag(board, row, col)
    setBoard(newBoard)
  }, [board, gameState])

  const handleReset = () => {
    setBoard(createBoard(size, mineCount))
    setGameState('playing')
    setTimer(0)
    setFlagCount(0)
    setFirstClick(true)
    setMarkingMode(false)
  }

  const getCellSize = () => {
    if (size === 10) return 38
    if (size === 20) return 26
    if (size === 30) return 18
    if (size === 50) return 12
    return 20
  }

  const cellSize = getCellSize()

  return (
    <div className="game">
      <div className="game-header">
        <div className="header-top-row">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>

          <div className="info-item">
            <span className="info-label">Grid:</span>
            <span className="info-value">{size}×{size}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Mines:</span>
            <span className="info-value">{mineCount - flagCount}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Time:</span>
            <span className="info-value">{formatTime(timer)}</span>
          </div>
        </div>

        <div className="header-bottom-row">
          <button className="reset-button" onClick={handleReset}>
            {gameState === 'won' ? '★' : gameState === 'lost' ? '✕' : '↻'}
          </button>

          <button
            className={`marking-button ${markingMode ? 'active' : ''}`}
            onClick={() => setMarkingMode(!markingMode)}
          >
            ▲ {markingMode ? 'Marking ON' : 'Marking OFF'}
          </button>
        </div>
      </div>

      {gameState !== 'playing' && (
        <div className={`game-overlay ${gameState}`}>
          {gameState === 'won' ? (
            <div className="victory-container">
              <div className="fireworks">
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
              </div>
              <div className="confetti">
                {[...Array(50)].map((_, i) => (
                  <div key={i} className="confetti-piece" style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'][Math.floor(Math.random() * 6)]
                  }}></div>
                ))}
              </div>
              <div className="victory-content">
                <h1 className="victory-title">★ VICTORY! ★</h1>
                <div className="victory-stats">
                  <div className="victory-stat">
                    <span className="stat-icon">⏱</span>
                    <span className="stat-text">{formatTime(timer)}</span>
                  </div>
                  <div className="victory-stat">
                    <span className="stat-icon">◼</span>
                    <span className="stat-text">{size}×{size}</span>
                  </div>
                  <div className="victory-stat">
                    <span className="stat-icon">●</span>
                    <span className="stat-text">{mineCount} mines</span>
                  </div>
                </div>
                <div className="end-game-buttons">
                  <button className="play-again-button victory" onClick={handleReset}>
                    ↻ Play Again
                  </button>
                  <button className="main-menu-button victory" onClick={onBack}>
                    ← Main Menu
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="game-over-container">
              <div className="game-over-content">
                <h1 className="game-over-title">✕ GAME OVER ✕</h1>
                <div className="end-game-buttons">
                  <button className="play-again-button game-over" onClick={handleReset}>
                    ↻ Try Again
                  </button>
                  <button className="main-menu-button game-over" onClick={onBack}>
                    ← Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="board-container">
        <div
          className="board"
          style={{
            gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                size={cellSize}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onRightClick={() => handleCellRightClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Game
