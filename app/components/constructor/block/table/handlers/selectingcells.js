import {Offset} from "../../../../layouts/Helpers";

export default function (cell, positionColumnBorderDragger) {
  if (this.state.hasSelectionCells && this.cursorSelection) {
    const {x, y} = cell.getPosition()
    const selection = this.state.selectionCells
    const cursor = this.cursorSelection.getPosition()
    if (cursor.x == x && cursor.y == y) return false
    this.cursorSelection = cell
    this.setState({selectionCells: selection.include(cell)})
  } else {
    if (this.refs.columnBorderDragger && !this.refs.columnBorderDragger.hasDragging()) {
      if (positionColumnBorderDragger) {
        let {left, right, target} = positionColumnBorderDragger
        
        const tableOffset = Offset(this.refs.self).left + 4
        let offset = positionColumnBorderDragger.offset - tableOffset
        let edge = {
          left: this.getDOMCell(left.getPosition()),
          right: this.getDOMCell(right.getPosition())
        }
        let length = right.getPosition('x') - left.getPosition('x')

        for(let name in edge) {
          let _col = positionColumnBorderDragger[name].getSpan('col')
          if (_col) {
            let position = positionColumnBorderDragger[name].getPosition(),
            _end = position.x + (positionColumnBorderDragger[name].getSpan('col') || 1) - 1
            this.props.state.getRows().forEach(
              (row, fy) => row.forEach(
                (cell, fx) => {
                  if (name == 'left') {
                    fx > position.x && fx < right.getPosition('x') && (position.x = fx) && (position.y = fy)
                  } else {
                    let cellEnd = fx + (cell.getSpan('col') || 1) - 1
                    cellEnd < _end && cellEnd >= right.getPosition('x') && (position.x = fx) && (position.y = fy) && (_end = cellEnd)
                  }
                }
              )
            )
            edge[name] = this.getDOMCell(position)
          }
        }

        edge = {
          left: (Offset(edge.left).left + (length * 14)) - tableOffset,
          right: ((Offset(edge.right).left + edge.right.offsetWidth) - (length * 7)) - tableOffset
        }

        this.positionColumnBorderDragger = right
        this.refs.columnBorderDragger.setPosition(Object.assign({offset, edge: {...edge}}, target))
      } else {
        this.positionColumnBorderDragger = undefined
        this.refs.columnBorderDragger.hide()
      }
    }
  }
}