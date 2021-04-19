import {Map, List} from 'immutable'
import {getMouseEventPosition, Offset} from "../../layouts/Helpers";

const cloneRow = (table, y, def) => table.getRows().get(y).map(cell => def ? def.get(cell.getPosition('x')) : undefined)

exports.init = props => {
  let userRows = Map()
  if (props.userData && props.userData.size) {
    props.userData.forEach(
      (rows, y) => {
        !!props.state.getRows().has(y) && (
          userRows = userRows.set(y, List(rows.map(c => cloneRow(props.state, y, c)).toList().toArray()))
        )
      }
    )
  }
  return userRows
}
exports.addRow = function() {
  const {y, index} = this.state.addrow
  if (y) {
    let row = cloneRow(this.props.state, y)
    let {userRows} = this.state
    userRows = userRows.set(y, userRows.has(y) ? userRows.get(y).insert(index + 1, row) : List([row, Map(row)]))
    this.setState({userRows})
  }
}
exports.changeUserCell = function ({x, y ,index}, value) {
  const {props} = this
  let userRows = this.state.userRows
  let path = [y, index, x]
  if (userRows.hasIn(path)) userRows = userRows.setIn(path, value)
  else {
    let row = userRows.hasIn([y, index]) ? userRows.getIn([y, index]) : cloneRow(props.state, y).set(x, value)
    userRows = userRows.set(y, userRows.has(y) ? userRows.get(y).insert(index, row) : List([row]))
  }
  this.setState({userRows}, () => !userRows.equals(props.userData) && props.onChangeTable(props.id, userRows))
}

const chkCellFromAddRow = cell => cell.isEmptyContent() && !cell.getSpan('row')
exports.Mouse = {
  Move: function(event, {index, y}) {
    this.mouseEventFlag = true
    const table = this.props.state
    const countColumns = table.getCountColumns()//table.getRows().get(y).reduce((acc, cur) => acc + (cur.getSpan('col') || 1), 0)
    if (this.countColumns == countColumns && table.getRows().get(y).every(chkCellFromAddRow)) {
      const {nativeEvent, currentTarget} = event
      const mousePosition = getMouseEventPosition(nativeEvent)
      const deltaLeft = 0
      
      if (deltaLeft >= 0 && deltaLeft <= 30){
        const cellPosition = Offset(currentTarget)
        const deltaTop = (cellPosition.top + currentTarget.offsetHeight) - mousePosition.top
        if (deltaTop >=0 && deltaTop <= currentTarget.offsetHeight/2)
          return this.setState({addrow: {index, y}})
      }
    }
    !!this.state.addrow && this.setState({addrow: false})
  },
  Out: function (event) {
    if (this.state.addrow) {
      if (this.mouseEventFlag) return this.mouseEventFlag = false
      const mousePosition = getMouseEventPosition(event)
      const tablePosition = Offset(this.refs.self)
      
      if (
        mousePosition.top >= tablePosition.top && mousePosition.top <= tablePosition.top + this.refs.self.offsetHeight &&
        mousePosition.left >= tablePosition.left && mousePosition.left <= tablePosition.left + this.refs.self.offsetWidth
      ) return;
      if (this.refs.addbtn) {
        const btnPosition = Offset(this.refs.addbtn)
        if (mousePosition.top >= btnPosition.top && mousePosition.top <= btnPosition.top + this.refs.addbtn.offsetHeight &&
          mousePosition.left >= btnPosition.left && mousePosition.left <= btnPosition.left + this.refs.addbtn.offsetWidth) return;
      }
      
      this.setState({addrow: false})
    }
  }
}

exports.didUpdate = function() {
  const {refs} = this
  if (this.state.addrow && refs.addrow && refs.addbtn) {
    const tablePosition = Offset(refs.self)
    const position = Offset(refs.addrow)
    refs.addbtn.style.top = (position.top - tablePosition.top - 10) + 'px'
  }
}