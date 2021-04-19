import Cell from "./cell"

export default (table, x, y) => {
  let rows = table.getRows()
  let cell = rows.getIn([y,x])
  const {editorState, span, border, usefulness} = cell.toJSON()
  
  let r = 0
  do {
    let c = 0
    do {
      let position = {y: y + r, x: x + c}
      rows.find(
        (r, ry) => ry != position.y && r.find((c, cx) => {
          return (!c.getSpan('col') && cx == position.x)
        })
      )
      let data = {position, usefulness}
      if (!r && !c) data.editorState = editorState
      let size = Object.assign({}, border.size)
      if (c && size.right !== size.left) size.left = size.right
      if (y && size.bottom !== size.top) size.top = size.bottom
      data.border = Object.assign({}, border, {size})
      
      rows = rows.setIn([position.y, position.x], new Cell(data))
    } while(++c < span.col)
  } while (++r < span.row)

  return rows
}