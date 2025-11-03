import { useState } from 'react'
import { getStats, clearStats, formatTime } from '../utils/statsManager'

function Stats({ onBack }) {
  const [stats, setStats] = useState(getStats())

  const handleClearStats = () => {
    if (confirm('Are you sure you want to clear all statistics?')) {
      clearStats()
      setStats(getStats())
    }
  }

  const calculateWinRate = (wins, totalGames) => {
    if (totalGames === 0) return '0%'
    return `${Math.round((wins / totalGames) * 100)}%`
  }

  const calculateAvgMines = (totalMines, totalGames) => {
    if (totalGames === 0) return '0'
    return Math.round(totalMines / totalGames)
  }

  const sizes = ['10x10', '20x20', '30x30', '50x50']

  return (
    <div className="stats">
      <div className="stats-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>Statistics</h1>
        <button className="clear-button" onClick={handleClearStats}>
          Clear Stats
        </button>
      </div>

      <div className="stats-grid">
        {sizes.map((size) => {
          const sizeStats = stats[size] || { wins: 0, losses: 0, firstClickLosses: 0, bestTime: null, totalGames: 0, totalMines: 0 }
          return (
            <div key={size} className="stat-card">
              <h2 className="stat-size">{size}</h2>
              <div className="stat-rows">
                <div className="stat-row">
                  <span className="stat-label">Total Games:</span>
                  <span className="stat-value">{sizeStats.totalGames}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Avg Mines:</span>
                  <span className="stat-value">{calculateAvgMines(sizeStats.totalMines, sizeStats.totalGames)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Wins:</span>
                  <span className="stat-value win">{sizeStats.wins}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Losses:</span>
                  <span className="stat-value loss">{sizeStats.losses}</span>
                </div>
                {sizeStats.firstClickLosses > 0 && (
                  <div className="stat-row highlight">
                    <span className="stat-label" title="Bad luck! Hit a mine on first click">
                      ⚠ First-Click Losses:
                    </span>
                    <span className="stat-value bad-luck">{sizeStats.firstClickLosses}</span>
                  </div>
                )}
                <div className="stat-row">
                  <span className="stat-label">Win Rate:</span>
                  <span className="stat-value">
                    {calculateWinRate(sizeStats.wins, sizeStats.totalGames)}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Best Time:</span>
                  <span className="stat-value best-time">
                    {formatTime(sizeStats.bestTime)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {Object.values(stats).every(s => s.totalGames === 0) && (
        <div className="empty-stats">
          <p>No games played yet!</p>
          <p>Start playing to see your statistics here.</p>
        </div>
      )}
    </div>
  )
}

export default Stats
