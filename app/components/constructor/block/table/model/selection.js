const normalize = (a, b) => {

  if (a == b) return {
    start: {x: a.x, y: a.y},
    end: {x: a.x, y: a.y}
  }

  return {
    start: {x: Math.min(a.x, b.x), y: Math.min(a.y, b.y)},
    end: {x: Math.max(a.x, b.x), y: Math.max(a.y, b.y)},
  }
}

export default class TableSelection {
  constructor(firstCell) {
    const _firstPosition = firstCell.getPosition()
    let firstColSpan = firstCell.getSpan('col')
    let firstRowSpan = firstCell.getSpan('row')
    let _range = {start: _firstPosition, end: {y: _firstPosition.y + (firstRowSpan || 1) - 1, x: _firstPosition.x + (firstColSpan || 1) - 1}}
    
    this.getRange = () => {
      return !!_range && {
        start: {x: _range.start.x, y: _range.start.y},
        end: {x: _range.end.x, y: _range.end.y}
      }
    }
    this.getStart = (key) => _range && key && _range.start[key] != undefined ? _range.start[key] : _range.start
    this.getEnd = (key) => _range && key && _range.end[key] != undefined ? _range.end[key] : _range.end
    this.hasCell = (cell) => {
      if (!_range) return false
      let position = cell.getPosition()
      const {start, end} = _range
      return start.x <= position.x && start.y <= position.y && end.x >= position.x && end.y >= position.y
    }
    this.hasAll = table => this.hasCell(table.first()) && this.hasCell(table.last())
    this.hasOnly = () => (
      this.getStart('y') == this.getEnd('y') ||
      (this.getStart('y') + (firstRowSpan - 1)) == this.getEnd('y')
    ) && (
      this.getStart('x') == this.getEnd('x') ||
      (this.getStart('x') + (firstColSpan - 1)) == this.getEnd('x')
    )
    
    this.eqStartX = (x) => _range && _range.start.x == x
    this.eqStartY = (y) => _range && _range.start.y == y
    this.eqEndX = (x) => _range && _range.end.x == x
    this.eqEndY = (y) => _range && _range.end.y == y

    this.eqSelection = (selection) => this === selection || (
      this.eqStartX(selection.getStart('x')) &&
      this.eqEndX(selection.getEnd('x')) &&
      this.eqStartY(selection.getStart('y')) &&
      this.eqEndY(selection.getEnd('y'))
    )

    this.include = (cell) => {
      let position = cell.getPosition()
      let colSpan = cell.getSpan('col')
      let rowSpan = cell.getSpan('row')
      if (colSpan && _firstPosition.x <= position.x) {
        position.x += colSpan - 1
      }
      if (rowSpan && _firstPosition.y <= position.y) {
        position.y += rowSpan - 1
      }
      _range = normalize(_firstPosition, position)
      return this
    }
  }
}