import Cell from "./cell"
import Table from "./index"
import {Map} from "immutable"
import {getWidthColumnsFromDelete} from "./helpers"

export default (table, startX, endX) => {
  const rows = table.getRows()
  let newWidth = getWidthColumnsFromDelete(table, startX, endX)
  let prop = table.getProperties().toJS()
  prop.columns = newWidth.slice()

  let _cells = Map()
  let mask = Map()
  rows.forEach(row => {
    let x = 1
    row.forEach(cell => {
      let span = cell.getSpan()
      let currentPosition = cell.getPosition()
      let editorState = cell.getEditorState()
      while (mask.hasIn([currentPosition.y, x])) {
        x = mask.getIn([currentPosition.y, x])
      }
      let over = (cell.getPosition('x') + span.col) - 1
      let newCell = true

      if (currentPosition.x >= startX && currentPosition.x <= endX) {
        if (over > endX) {
          span.col = over - endX
          editorState = null
        } else {
          newCell = false
        }
      } else if (over >= startX && currentPosition.x <= startX) {
        span.col = span.col - ((endX - startX) + 1)
      }
      
      if (newCell) {
        let position = {y: currentPosition.y, x}
        span.col = span.col > 1 ? span.col : 0
        let border = cell.getBorder()
        let usefulness = cell.getUsefulness()

        _cells = _cells.setIn([position.y, position.x], new Cell({position, editorState, span, border, usefulness}))
        let currentX = x
        x += span.col || 1

        if (span.row) {
          for (let i=0; i<span.row; i++) {
            let y = currentPosition.y + i
            mask = mask.setIn([y, currentX], x)
          }
        }
      }
    })
  })
  
  return new Table({cells: _cells, prop})
}