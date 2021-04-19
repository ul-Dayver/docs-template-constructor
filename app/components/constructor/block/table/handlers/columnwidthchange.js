import TableModel from '../model'

export default function (change) {
  if (!this.positionColumnBorderDragger) return false

  const tableWidth = this.tableWidth || this.refs.self.offsetWidth
  const cols = Array.prototype.slice.call(this.refs.self.querySelectorAll('col')).map(
    element => parseFloat(element.style.width.replace('px',''))
  )
  const index = this.positionColumnBorderDragger.getPosition('x')-1

  let table = TableModel.setWidthColumn(this.props.state, {change, cols, index, tableWidth})
  this.props.onChange(table, true)
}