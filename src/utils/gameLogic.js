// Create initial game board
export const createBoard = (size, mineCount) => {
  const board = []

  // Initialize empty board
  for (let row = 0; row < size; row++) {
    board[row] = []
    for (let col = 0; col < size; col++) {
      board[row][col] = {
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }
    }
  }

  // Place mines randomly
  let minesPlaced = 0
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * size)
    const col = Math.floor(Math.random() * size)

    if (!board[row][col].isMine) {
      board[row][col].isMine = true
      minesPlaced++
    }
  }

  // Calculate neighbor mine counts
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!board[row][col].isMine) {
        board[row][col].neighborMines = countNeighborMines(board, row, col, size)
      }
    }
  }

  return board
}

// Count mines in neighboring cells
const countNeighborMines = (board, row, col, size) => {
  let count = 0

  for (let r = Math.max(0, row - 1); r <= Math.min(size - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(size - 1, col + 1); c++) {
      if (r === row && c === col) continue
      if (board[r][c].isMine) count++
    }
  }

  return count
}

// Reveal a cell and cascade if it's empty
export const revealCell = (board, row, col, size) => {
  const newBoard = JSON.parse(JSON.stringify(board))

  if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) {
    return newBoard
  }

  newBoard[row][col].isRevealed = true

  // If cell has no neighboring mines, reveal all neighbors
  if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
    for (let r = Math.max(0, row - 1); r <= Math.min(size - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(size - 1, col + 1); c++) {
        if (r === row && c === col) continue
        if (!newBoard[r][c].isRevealed && !newBoard[r][c].isFlagged) {
          const cascaded = revealCell(newBoard, r, c, size)
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              if (cascaded[i][j].isRevealed) {
                newBoard[i][j].isRevealed = true
              }
            }
          }
        }
      }
    }
  }

  return newBoard
}

// Toggle flag on a cell
export const toggleFlag = (board, row, col) => {
  const newBoard = JSON.parse(JSON.stringify(board))

  if (!newBoard[row][col].isRevealed) {
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
  }

  return newBoard
}

// Check if game is won
export const checkWin = (board, size) => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = board[row][col]
      // All non-mine cells must be revealed
      if (!cell.isMine && !cell.isRevealed) {
        return false
      }
    }
  }
  return true
}

// Reveal all mines (for game over)
export const revealAllMines = (board, size) => {
  const newBoard = JSON.parse(JSON.stringify(board))

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (newBoard[row][col].isMine) {
        newBoard[row][col].isRevealed = true
      }
    }
  }

  return newBoard
}
