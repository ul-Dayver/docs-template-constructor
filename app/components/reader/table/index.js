import React from 'react'
import Tcell from './cell'
import {init, addRow,changeUserCell, Mouse, didUpdate} from './handlers'

export default class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {addrow: false, userRows: init(props)}
    this.countColumns = props.state.getCountColumns()
    this.mouseEventFlag = false

    this.onMouseAddBtn = () => this.mouseEventFlag = true
    this.onMouseMove = Mouse.Move.bind(this)
    this.onMouseOut = Mouse.Out.bind(this)
    
    this.handleAddRow = addRow.bind(this)

    this.handleChangeUserCell = changeUserCell.bind(this)
    this.didUpdate = didUpdate
  }

  shouldComponentUpdate(nextProps) {
    return !(this.state.userRows.size && (!!nextProps.userData && !nextProps.userData.equals(this.props.userData)))
  }

  static getDerivedStateFromProps(props, state) {
    return (!state.userRows.size && !!props.userData && !!props.userData.size)
      ? {userRows: init(props)}
      : null
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseOut)
  }

  componentDidUpdate() {
    this.didUpdate()
  }

  render() {
    const {state} = this.props
    const tableProps = state.getProperties().toJS()
    const {top, left, right, bottom} = tableProps.cellMargin.px
    const padding = top +'px ' + right +'px ' + bottom +'px ' + left +'px'
    const {addrow, userRows} = this.state
    let defaultProps = {index: 0, padding, block: this.props, onMouseMove: this.onMouseMove, onChangeCell: this.handleChangeUserCell}
    let rowsHTML = state.getRows().map(
      (row, y) => (<tr key={y}>{row.map(
        (cell, x) => {
          const props = Object.assign({cell, key: x, userValue: userRows.getIn([y, defaultProps.index, x])}, defaultProps)
          return (<Tcell {...props} />)
        }
      ).toList().toArray()}</tr>)
    ).toList()
    let margin = 0, addrowMargin = 0
    if (userRows.size) {
      userRows.forEach((rows, y) => {
        rows.forEach((row, i) => {
          if (i) {
            rowsHTML = rowsHTML.insert(margin + y + i - 1,
              (
                <tr key={y+"-"+i}>{
                  row.map(
                    (cell, x) => {
                      const props = Object.assign({cell: state.getRows().getIn([y,x]), key: x, userValue: cell},defaultProps, {index:i})
                      return (<Tcell {...props} />)
                    }
                  ).toList().toArray()
                }</tr>
              )
            )
          }
        })
        margin += rows.size-1
        if (addrow && addrow.y > y) {addrowMargin = margin}
      })
    }

    if (addrow) {
      rowsHTML = rowsHTML.insert(addrowMargin + addrow.y + addrow.index, (<tr ref="addrow" key="addrow"><td className="table-row-add-span" colSpan={this.countColumns}><div></div></td></tr>))
    }

    return (
      <div className="position-relative">
        {!!addrow && (
          <div ref="addbtn" className="table-row-add-button" onMouseMove={this.onMouseAddBtn}>
            <button className="btn btn-primary rounded-circle" onClick={this.handleAddRow}><i className='fa fa-plus'></i></button>
          </div>
        )}
        <table ref="self" className={'document-constructor-table border border-dark border-' + (tableProps.borderSize |0)}>
          <tbody>
            {rowsHTML.toArray()}
          </tbody>
        </table>
      </div>
    )
  }
}