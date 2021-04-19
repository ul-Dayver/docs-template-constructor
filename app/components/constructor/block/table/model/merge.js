import Cell from "./cell"
import deleteRows from './delete-rows'

export default (table, startPosition, endPosition) => {
  let rows = table.getRows()
  let cells = []

  for (let y = startPosition.y; y <= endPosition.y; y++) {
    if (!rows.has(y)) continue
    for(let x = startPosition.x; x <= endPosition.x; x++) {
      if (!rows.hasIn([y,x])) continue
      cells.push(rows.getIn([y,x]))
    }
  }
    
  rows = rows.setIn([startPosition.y, startPosition.x], Cell.MergeFrom.apply(null, cells))

  for (let y = startPosition.y; y <= endPosition.y; y++) {
    if (!rows.has(y)) continue
    let row = rows.get(y)
    if (row.size == (endPosition.x - startPosition.x) + 1 && y != startPosition.y) {
      rows = deleteRows(rows, y, y)
    } else {
      for(let x = startPosition.x; x <= endPosition.x; x++) {
        if (y == startPosition.y && x == startPosition.x) {
          continue
        } else if (row.has(x)) {
          row = row.delete(x)
        }
      }
      rows = rows.set(y, row)
    }
  }

  return rows
}