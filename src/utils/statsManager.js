// Get stats from localStorage
export const getStats = () => {
  const defaultStats = {
    '10x10': { wins: 0, losses: 0, firstClickLosses: 0, bestTime: null, totalGames: 0, totalMines: 0 },
    '20x20': { wins: 0, losses: 0, firstClickLosses: 0, bestTime: null, totalGames: 0, totalMines: 0 },
    '30x30': { wins: 0, losses: 0, firstClickLosses: 0, bestTime: null, totalGames: 0, totalMines: 0 },
    '50x50': { wins: 0, losses: 0, firstClickLosses: 0, bestTime: null, totalGames: 0, totalMines: 0 }
  }

  const stats = localStorage.getItem('mineFinderStats')
  if (stats) {
    const parsed = JSON.parse(stats)

    // Ensure all size keys exist and migrate old stats to new format
    Object.keys(defaultStats).forEach(key => {
      if (!parsed[key]) {
        parsed[key] = defaultStats[key]
      } else {
        if (!parsed[key].totalMines) parsed[key].totalMines = 0
        if (!parsed[key].firstClickLosses) parsed[key].firstClickLosses = 0
      }
    })

    return parsed
  }

  // Initialize default stats
  return defaultStats
}

// Save stats to localStorage
const saveStats = (stats) => {
  localStorage.setItem('mineFinderStats', JSON.stringify(stats))
}

// Record a game result
export const recordGame = (size, won, time, mineCount, isFirstClick = false) => {
  const stats = getStats()
  const sizeKey = `${size}x${size}`

  if (!stats[sizeKey]) {
    stats[sizeKey] = { wins: 0, losses: 0, firstClickLosses: 0, bestTime: null, totalGames: 0, totalMines: 0 }
  }

  stats[sizeKey].totalGames++
  stats[sizeKey].totalMines += mineCount

  if (won) {
    stats[sizeKey].wins++
    // Update best time if this is faster or first win
    if (stats[sizeKey].bestTime === null || time < stats[sizeKey].bestTime) {
      stats[sizeKey].bestTime = time
    }
  } else {
    stats[sizeKey].losses++
    // Track if this was a first-click loss
    if (isFirstClick) {
      stats[sizeKey].firstClickLosses++
    }
  }

  saveStats(stats)
}

// Clear all stats
export const clearStats = () => {
  localStorage.removeItem('mineFinderStats')
}

// Format time (seconds to mm:ss)
export const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
