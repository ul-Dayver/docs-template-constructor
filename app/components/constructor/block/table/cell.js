import React from 'react'
import Editor from '../editor'
import {Map} from 'immutable'
import {getMouseEventPosition, Offset} from "../../../layouts/Helpers";

export default class Tcell extends React.Component {
  constructor(props) {
    super(props)
    this.setFocus = () => {
      !!this.refs.editor && this.refs.editor.handleFocus()
    }

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleChange = (editorState, mustBecomeBoundary) => this.props.onChange(this.props.cell, editorState, mustBecomeBoundary)
  }

  handleMouseMove(event) {
    //event.preventDefault()
    //event.stopPropagation()
    const {currentTarget, nativeEvent} = event
    const mousePosition = getMouseEventPosition(nativeEvent)
    const targetPosition = Offset(currentTarget)
    const targetCenter = targetPosition.left + currentTarget.offsetWidth / 2
    const {cell, table} = this.props
    const {x, y} = cell.getPosition()
    const row = table.getRows().get(y)
    const target = {top: currentTarget.offsetTop, height: currentTarget.offsetHeight}

    this.props.onSelection(cell, 
      row.size > 1
      ? (
        row.first().getPosition('x') == x 
        ? {target, offset: targetPosition.left + currentTarget.offsetWidth, left: cell, right: table.getNextCellInRow(cell)}
        : (
          row.last().getPosition('x') == x
          ? {target, offset: targetPosition.left, left: table.getPrevCellInRow(cell), right: cell}
          : mousePosition.left < targetCenter
            ? {target, offset: targetPosition.left, left: table.getPrevCellInRow(cell), right: cell}
            : {target, offset: (targetPosition.left + currentTarget.offsetWidth), left: cell, right: table.getNextCellInRow(cell)}
        )
      )
      : undefined
    ) 
  }

  handleMouseDown(event) {
    this.props.onStartSelection(this.props.cell)
    if (event.target == this.refs.cell) {
      setTimeout(()=>this.setFocus(true), 100)
    }
  }

  render() {
    const {cell, onFocus, selectedRange, table} = this.props
    const {top, left, right, bottom} = table.getProperties('cellMargin').px
    const spanProps = Map(cell.getSpan()).filter(v => !!v).mapEntries(([k, v]) => [k + 'Span', v]).toJS()
    const editorState = cell.getEditorState()
    const borderSize = cell.getBorder('size')
    let style = {
      padding: top +'px ' + right +'px ' + bottom +'px ' + left +'px'
    }

    let className = 'border'

    if (borderSize.every(b=> !!b)) className += ' border-dark'
    else if (!borderSize.every(b=> !b)) {
      borderSize.forEach((size, name) => {
        if (size) className += ' border-'+name+'-dark'
        //if (size) style['border'+name.ucfirst()+'Color'] = 'var(--dark) !important'
      })
    }
    
    if (selectedRange && !selectedRange.hasOnly()) {
      if (selectedRange.hasCell(cell)) {
        className += (className.length ? ' ' : '') + 'selected'
      }
    }
    
    return (
      <td ref="cell" className={className} {...spanProps} style={style}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
      >
        <Editor editorState={editorState} ref="editor" onChange={this.handleChange} onFocus={onFocus}/>
      </td>
    )
  }
}