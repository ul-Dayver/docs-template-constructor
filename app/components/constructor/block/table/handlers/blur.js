import {closest} from "../../../../layouts/Helpers";

export default function(event) {
  if (this.refs.contextmenu) {
    let clst = closest(event.target, '.popover')
    if (clst && this.refs.contextmenu.popover && clst === this.refs.contextmenu.popover.getElement()) return false
    clst = closest(event.target, 'table')
    if (clst && clst === this.refs.self) return false

    this.setState({selectionCells: undefined})
  }
}