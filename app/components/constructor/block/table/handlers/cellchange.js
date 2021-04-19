import TableModel from '../model'

export default function (cell, editorState, mustBecomeBoundary) {
  const table = TableModel.setCell(this.props.state, Object.assign(cell.toJSON(), {editorState}))
  this.props.onChange(table, mustBecomeBoundary)
}