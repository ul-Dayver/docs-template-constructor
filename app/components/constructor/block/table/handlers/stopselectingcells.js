export default function () {
  if (this.state.hasSelectionCells) {
    window.removeEventListener('mouseup', this.handleStopSelectingCells)
    this.cursorSelection = undefined
    setTimeout(()=>this.setState({hasSelectionCells: false}), 100)
  }
}