import Cell from "./cell"

export default (table, range, usefulness) => table.getRows().map(
  row => row.map(
    cell => !range.hasCell(cell)
      ? cell
      : new Cell(Object.assign(cell.toJSON(), {usefulness}))
  )
)