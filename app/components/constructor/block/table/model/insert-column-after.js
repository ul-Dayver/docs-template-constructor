import Cell from "./cell"
import Table from "./index"
import {Map} from "immutable"
import {getWidthColumnsFromInsert} from "./helpers"

export default (table, x) => {
  const rows = table.getRows()
  let mask = Map()
  let rangeWidth = getWidthColumnsFromInsert(table,x)
  let prop = table.getProperties().toJS()
  prop.columns = rangeWidth.slice()

  let bs = table.getProperties('borderSize')
  let defBorder = {size: {top: bs,right: bs,bottom: bs, left: bs}}
  return new Table({cells: rows.map(row => {
    let last = row.last().toJSON()
    let position = {y: last.position.y, x: x+1}
    let borderLast = last.position.x + (last.span.col || 1) - 1
    let border = defBorder

    if (borderLast < position.x) {
      border = last.border
      if (!border.size.left && border.size.right) border.size.left = border.size.right
      else if (!border.size.right && border.size.left) border.size.left = 0
      return row.set(position.x, new Cell({position, border}))
    }

    let first = row.first().toJSON()
    let cells = Map()

    if (!row.has(position.x)) {
      let spanCell = row.find((cell, cellX) => cellX < position.x  && position.x <= cellX + (cell.getSpan('col') || 1) -1)
      if (spanCell) {
        mask = mask.set(position.x, spanCell.getPosition('x'))
        border = spanCell.getBorder()
      }
      if (mask.has(position.x)) position.x = mask.get(position.x)
    } else {
      border = row.get(x).getBorder()
      if (!border.size.left && border.size.right) border.size.left = border.size.right
      else if (!border.size.right && border.size.left) border.size.left = 0
    }

    if (position.x != first.position.x) {
      cells = row.filter((v,k) => k >= first.position.x && k < position.x)
    }
    
    cells = cells.set(position.x, new Cell({position, border}))
    
    row.forEach((cell, cellX) => {
      if (cellX >= position.x) {
        let crrPosition = {y: position.y, x: cellX + 1}
        cells = cells.set(crrPosition.x, new Cell(Object.assign(cell.toJSON(), {position: crrPosition})))
      }
    })

    return cells
  }), prop})
}