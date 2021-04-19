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

    let cells = Map()
    let first = row.first().toJSON()
    let position = {y: first.position.y, x}
    let border = defBorder

    if (first.position.x == position.x) {
      border = first.border
      if (!border.size.right && border.size.left) border.size.right = border.size.left
      else if (!border.size.left && border.size.right) border.size.right = 0
      cells = cells.set(position.x, new Cell({position, border}))
      row.forEach(
        (cell, cellX) => {
          let conf = Object.assign(cell.toJSON(), {position: {y: position.y, x: cellX + 1}})
          cells = cells.set(conf.position.x, new Cell(conf))
        }
      )
      return cells
    } else if (!row.has(position.x)) {
      let spanCell = row.find((cell, cellX) => cellX < position.x  && position.x <= cellX + (cell.getSpan('col') || 1) -1)
      if (spanCell) mask = mask.set(position.x, spanCell.getPosition('x'))
      if (mask.has(position.x)) position.x = mask.get(position.x)
    } else if (mask.has(position.x)) {
      mask = Map()
    }

    if (row.has(x)){
      border = row.get(x).getBorder()
      if (!border.size.right && border.size.left) border.size.right = border.size.left
      else if (!border.size.left && border.size.right) border.size.right = 0
    }
    
    cells = row.filter((v,k) => k >= first.position.x && k < position.x)
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