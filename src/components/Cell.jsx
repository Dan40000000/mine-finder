import { useCallback } from 'react'

const NUMBER_COLORS = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080'
}

function Cell({ cell, size, onClick, onRightClick }) {
  const { isRevealed, isFlagged, isMine, neighborMines } = cell

  const handleClick = useCallback((e) => {
    e.preventDefault()
    onClick()
  }, [onClick])

  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    onRightClick()
  }, [onRightClick])

  const getCellContent = () => {
    if (!isRevealed && isFlagged) {
      return '▲'
    }

    if (!isRevealed) {
      return ''
    }

    if (isMine) {
      return '●'
    }

    if (neighborMines === 0) {
      return ''
    }

    return neighborMines
  }

  const getCellClass = () => {
    let classes = 'cell'
    if (isRevealed) {
      classes += ' revealed'
      if (isMine) {
        classes += ' mine'
      }
    } else {
      classes += ' hidden'
    }
    return classes
  }

  const getCellStyle = () => {
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      fontSize: size > 25 ? '13px' : size > 17 ? '10px' : size > 11 ? '8px' : '7px'
    }

    if (isRevealed && neighborMines > 0 && !isMine) {
      style.color = NUMBER_COLORS[neighborMines]
    }

    return style
  }

  return (
    <div
      className={getCellClass()}
      style={getCellStyle()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {getCellContent()}
    </div>
  )
}

export default Cell
