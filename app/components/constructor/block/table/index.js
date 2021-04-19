import React from 'react'
import TableModel from './model'
import TableRow from './row'
import TableCell from './cell'
import ContextMenu from "./contextmenu";
import ColumnBorderDragger from "./borderdragger"

//import Properties from "./properties"
import {canSplit, canMerge} from './contextmenu/validators'

import { SelectingCells, ColumnWidthChange, StartSelectingCells, StopSelectingCells, CellChange, Blur } from "./handlers";

export default class Table extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      //showProp: false,
      hasSelectionCells: false,
      selectionCells: undefined
    }

    this.cursorSelection = undefined
    this.positionColumnBorderDragger = undefined

    this.getDOMCell = ({x, y}) => this.refs[x+''+y] ? this.refs[x+''+y].refs.cell : undefined
    this.handleKeyPress = () => this.state.selectionCells && this.setState({selectionCells: undefined})
    this.setFocus = (toEnd) => {
      const table = this.props.state
      if (table.size) {
        let {x, y} = table.first().getPosition(), link = x + '' + y
        !!this.refs[link] && this.refs[link].setFocus(toEnd)
      }
    }

    this.handleChange = CellChange.bind(this)
    this.handleStartSelectingCells = StartSelectingCells.bind(this)
    this.handleSelectingCells = SelectingCells.bind(this)
    this.handleStopSelectingCells = StopSelectingCells.bind(this)
    
    this.onBlur = Blur.bind(this)

    this.handleColumnWidthChange = ColumnWidthChange.bind(this)

    const toolHandle = (f, dropSelectionFlag) => {
      let range = this.state.selectionCells
      const table = f(this.props.state, range)
      if (dropSelectionFlag !== false) this.setState({hasSelectionCells: false, selectionCells: undefined})
      if (!table) this.props.DropBlock()
      else this.props.onChange(table, true)
    }

    this.handle = {
      //openProperties: () => this.setState({showProp: true}),
      addRowAfter: () => toolHandle((table, range) => TableModel.insertRowAfter(table, range.getEnd('y'))),
      addRowBefore: () => toolHandle((table, range) => TableModel.insertRowBefore(table, range.getStart('y'))),
      delRow: () => toolHandle((table, range) => TableModel.deleteRows(table, range.getStart('y'), range.getEnd('y'))),
      addColAfter: () => toolHandle((table, range) => TableModel.insertColumnAfter(table, range.getEnd('x'))),
      addColBefore: () => toolHandle((table, range) => TableModel.insertColumnBefore(table, range.getStart('x'))),
      delCol: () => toolHandle((table, range) => TableModel.deleteColums(table, range.getStart('x'), range.getEnd('x'))),
      merge: () => toolHandle((table, range) => TableModel.mergeCells(table, range.getStart(), range.getEnd())),
      split: () => toolHandle((table, range) => TableModel.splitCell(table, range.getStart('x'), range.getStart('y'))),
      dropTable: props.DropBlock,
      setBorder: (option) => toolHandle((table, range) => TableModel.setBorderSize(table, range, option.name, option.value), false),
      setUsefulness: (option) => toolHandle((table, range) => TableModel.setUsefulness(table, range, option.value ? {datatype: option.value} : null), false)
    }
/*
    this.propAccept = prop => this.setState(
      {showProp: false},
      () => this.props.onChange(TableModel.setProperties(this.props.state, prop),true)
    )
    this.propCancel = () => this.setState({showProp: false})
*/
    this.tableWidth = 0
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur)
    window.addEventListener('scroll', this.onBlur)
    if (this.refs.self) this.tableWidth = this.refs.self.offsetWidth
    this.forceUpdate()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onBlur)
    window.removeEventListener('click', this.onBlur)
  }

  getCellWidth(w) {
    return this.tableWidth ? (this.tableWidth * w /100) + 'px' : w+'%'
  }

  render() {
    const {selectionCells, hasSelectionCells} = this.state //showProp
    const {onFocus, state, blockID, directory} = this.props
    const tableProps = state.getProperties().toJS()
    const borderSize = state.getProperties('borderSize') |0;
   
    return (
      <div className="position-relative">
        <table onKeyPress={this.handleKeyPress} ref="self" className={'document-constructor-table border border-dark border-' + borderSize}>
          <colgroup>
            {
              tableProps.columns.map(
                (w, i) => <col key={'col'+i} style={{width: this.getCellWidth(w)}} />
              )
            }
          </colgroup>
          <tbody>
            {
              state.getRows().map(
                (row, y) => (
                  <TableRow key={y}>
                    {
                      row.map(
                        (cell, x) => (
                          <TableCell key={x}
                            cell={cell}
                            tableProps={tableProps}
                            onFocus={e => onFocus(Object.assign(e,{blockID}))}
                            onChange={this.handleChange}
                            ref={x+''+y}
                            onStartSelection={this.handleStartSelectingCells}
                            onSelection={this.handleSelectingCells}
                            selectedRange={selectionCells}
                            table={state}
                          />
                        )
                      ).toList().toArray()
                    }
                  </TableRow>
                )
              ).toList().toArray()
            }
          </tbody>
        </table>
        {
          !hasSelectionCells && selectionCells && (
            <ContextMenu ref="contextmenu"
              selection={selectionCells}
              target={this}
              handle = {
                Object.assign({}, this.handle, {
                  merge: !canMerge(state, selectionCells) ? undefined : this.handle.merge,
                  split: !canSplit(state, selectionCells) ? undefined : this.handle.split,
                  dropTable: !selectionCells.hasAll(state) ? undefined :  this.handle.dropTable
                })
              }
              model={state}
              directory={directory}
            />
          )
        }
        
        <ColumnBorderDragger onStart={this.handleKeyPress} onEnd={this.handleColumnWidthChange} ref="columnBorderDragger" />
      </div>
    )
  }
}

/*
{
          !hasSelectionCells && selectionCells && (
            <Properties {...tableProps} show={showProp} onAccept={this.propAccept} onCancel={this.propCancel} />
          )
        }
*/