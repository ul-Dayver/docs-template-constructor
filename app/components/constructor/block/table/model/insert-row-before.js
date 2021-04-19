import Cell from "./cell"
import {Map} from "immutable"

export default (table, y) => {
  const borderSize = table.getProperties('borderSize')
  const rows = table.getRows()
  if (rows.has(y)) {
    let cells = Map()
    let first = rows.first().first().getPosition('y')
    if (first !== y) {
      cells = rows.filter((v,k) => k >= first && k < y).map(
        row => row.map(
          cell => {
            let span = cell.getSpan()
            let positionY = cell.getPosition('y')
            if (span.row && span.row + positionY - 1 >= y) {
              span.row += 1
              return new Cell(Object.assign(cell.toJSON(), {span}))
            }
            return cell
          }
        )
      )
    }

    rows.get(y).forEach((_cell, x) => {
      let position = {y, x}
      
      let colSpan = _cell.getSpan('col')
      let border = _cell.getBorder()
      let usefulness = _cell.getUsefulness()
      if (border.size.top != border.size.bottom) border.size.bottom = border.size.top

      colSpan && (border.size.right = borderSize)
      
      cells = cells.setIn([position.y, position.x], new Cell({position, border, usefulness}))
      if (colSpan) {
        border.size.left = borderSize
        for (let _x=1; _x<colSpan; _x++) {
          if (_x+1 >= colSpan) border.size.right = _cell.getBorder('size','right')
          position = {y, x: x + _x}
          cells = cells.setIn([position.y, position.x], new Cell({position, border}))
        }
      }
    })

    rows.forEach((row, k) => {
      (k >= y) && row.forEach(cell => {
        let _cell = cell.toJSON()
        _cell.position.y += 1
        cells = cells.setIn([_cell.position.y, _cell.position.x], new Cell(_cell))
      })
    })

    return cells
  }
  return rows
}