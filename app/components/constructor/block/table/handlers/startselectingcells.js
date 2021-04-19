import TableSelection from '../model/selection'

export default function (cell) {
  if (!this.state.hasSelectionCells) {
    const selection = new TableSelection(cell)
    this.cursorSelection = cell
    this.setState({hasSelectionCells: true, selectionCells: selection})
    window.addEventListener('mouseup', this.handleStopSelectingCells)
  }
}