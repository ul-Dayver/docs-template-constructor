import Cell from "./cell"

export default (table, y) => {
  let borderSize = table.getProperties('borderSize')

  const rows = table.getRows()
  if (rows.has(y)) {
    let first = rows.first().first().getPosition('y')
    let last = rows.last().first().getPosition('y')
    y++
    let cells = rows.filter((v, k) => k>=first && k<y).map(
      row => row.map(
        cell => {
          let span = cell.getSpan()
          let position = cell.getPosition()

          if (span.row && span.row + position.y >= y) {
            span.row += 1
            return new Cell(Object.assign(cell.toJSON(), {span}))
          }
          return cell
        }
      )
    )
    
    rows.get(y-1).forEach((_cell, x) => {
      let span = _cell.getSpan()
      if (!span.row) {
        let position = {y, x}
        let border = _cell.getBorder()
        if (border.size.bottom !== border.size.top) border.size.top = border.size.bottom
        let usefulness = _cell.getUsefulness()
        if (span.col) {
          border.size.right = borderSize
        }
        cells = cells.setIn([position.y, position.x], new Cell({position, border, usefulness}))
        if (span.col) {
          border.size.left = borderSize
          for (let _x=1; _x<span.col; _x++) {
            if (_x+1 >= span.col) border.size.right = _cell.getBorder('size','right')
            position = {y, x: x + _x}
            cells = cells.setIn([position.y, position.x], new Cell({position, border}))
          }
        }
      }
    })

    if (last !== y-1) {
      rows.forEach((row, k) => {
        (k>=y) && row.forEach(cell => {
          let _cell = cell.toJSON()
          _cell.position.y += 1
          cells = cells.setIn([_cell.position.y, _cell.position.x], new Cell(_cell))
        })
      })
    }
    
    return cells
  }
  return rows
}