import Cell from "./cell"
import {Map} from "immutable"

export default (table, startY, endY) => {
  const rows = table.getRows ? table.getRows() : table
  let columns = rows.first().reduce((acc, cur) => acc += cur.getSpan('col') || 1, 0)
  let _cells = Map()
  let y = 1
  rows.forEach(row => {
    row.forEach(cell => {
      let currentPosition = cell.getPosition()
      let span = cell.getSpan()
      let position = {y, x: currentPosition.x}
      let editorState = cell.getEditorState()

      if (span.row) {
        let cellEnd = (currentPosition.y + span.row) - 1
        if (cellEnd > endY) {
          if(currentPosition.y >= startY && currentPosition.y <= endY) {
            span.row = cellEnd - endY
            editorState = null
          } else if(currentPosition.y < endY) {
            span.row -= endY - startY + 1
          }
        } else if (currentPosition.y >= startY && cellEnd <= endY) { 
          return
        } else if (cellEnd >= startY) span.row = startY - currentPosition.y
      } else if (currentPosition.y >= startY && currentPosition.y <= endY) return;
      
      let border = cell.getBorder()
      let usefulness = cell.getUsefulness()

      span.row = span.row > 1 ? span.row : 0
      _cells = _cells.setIn([position.y, position.x], new Cell({position, editorState, span, border, usefulness}))

    })
    if (_cells.has(y)) {
      let lastCell = _cells.get(y).last()
      let RowEnd = lastCell.getPosition('x') + (lastCell.getSpan('col') || 1) - 1
      if (RowEnd === columns) y++
    }
  })

  return _cells
}