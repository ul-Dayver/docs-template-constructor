import Cell from "./cell"

const bordersMap = {top:1, right:2, bottom:3, left:4}
const borders = ['top', 'right', 'bottom', 'left']

const _check = (v, n, span, range) => 
  v >= range.start[n] && v + (span || 1) - 1 <= range.end[n]
const check = (name, {x, y}, span, range) => (bordersMap[name] & 1) == 1
  ? _check(x, 'x', span.col, range)
  : _check(y, 'y', span.row, range)
const getRangeForCheck = (name, range) => range[((bordersMap[name] >> 1) & 1) == 1 ? 'end' : 'start'][(bordersMap[name] & 1) != 1 ? 'x' : 'y']

const setBorderCell = (cell, range, borderName, borderValue) => {
  const {border, span, position} = cell
  let {x, y} = position

  let getIndex = -1
  if (!bordersMap[borderName]) return cell
  
  if (check(borderName, position, span, range)) {
    let rangeValue = getRangeForCheck(borderName, range)
    switch (borderName) {
      case 'top':
          if (rangeValue == y) getIndex = 0
          else if (rangeValue == y+(span.row || 1)) getIndex = 2
        break;
      case 'bottom':
          if (rangeValue == y || (span.row && (rangeValue == y + span.row - 1))) getIndex = 2
          else if (rangeValue == y-1) getIndex = 0
        break;
      case 'left':
          if (rangeValue == x) getIndex = 3
          else if (rangeValue == x+(span.col || 1)) getIndex = 1
        break;
      case 'right':
          if (rangeValue == x || (span.col && (rangeValue == x + span.col - 1))) getIndex = 1
          else if (rangeValue == x-1) getIndex = 3
        break;
      default: return cell
    }
  }
  getIndex >=0 && (border.size = Object.assign(border.size, {[borders[getIndex]]: borderValue}))
  return Object.assign(cell,{border})
} 

export default (table, selection, borderName, borderValue) => {
  const range = selection.getRange()
  const rows = table.getRows()
  if (!range) return rows
  
  if (borderName == 'none') borderValue = 0

  return rows.map(
    row => row.map(
      cell => {
        let _cell = cell.toJSON()
        switch (borderName) {
          case 'none':
          case 'all':
            const {x, y} = _cell.position
            if (selection.hasCell(cell)) {
              let start = {x,y}
              let end = {x: x + ((_cell.span.col || 1) - 1), y: y + ((_cell.span.row || 1) -1)}
              borders.forEach(name => _cell = setBorderCell(_cell, {start, end}, name, borderValue))
            } else {
              const {start, end} = range
              let newRange = {start: {x,y}, end: {x,y}}
              let odd = true
              if (y >= start.y && y <= end.y) {
                newRange.start.x = start.x
                newRange.end.x = end.x
              } else if (x >= start.x && x <= end.x) {
                newRange.start.y = start.y
                newRange.end.y = end.y
                odd = false
              } else break
              
              borders.forEach(
                name => ((bordersMap[name] & 1) != 1) == odd &&
                  (_cell = setBorderCell(_cell, newRange, name, borderValue))
              )
            }
          break
          case 'inner':
            if (selection.hasCell(cell)) {
              borders.forEach(name => {
                const rc = getRangeForCheck(name, range);
                if ((bordersMap[name] & 1) != 1) {
                  if (rc === _cell.position.x || rc === _cell.position.x + (_cell.span.col || 1) - 1) return;
                } else if (rc === _cell.position.y) return;
                
                _cell = setBorderCell(_cell, {start: _cell.position, end: {
                  y: _cell.position.y,
                  x: _cell.position.x + (_cell.span.col || 1) - 1
                }}, name, borderValue)
              })
            }
          break
          case 'outer':
            borders.forEach(name => _cell = setBorderCell(_cell, range, name, borderValue))
          break
          default:
            _cell = setBorderCell(_cell, range, borderName, borderValue)
          break
        }
        return new Cell(_cell)
      }
    )
  )
}