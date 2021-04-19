import React from 'react'
import {documentBody, getMouseEventPosition} from "../../../layouts/Helpers"

export default class Dragger extends React.Component {
  constructor() {
    super()
    this.state = {
      dragging: false,
      offset: 0,
      mouseOffset: 0,
      startOffset: 0,
      hide: false,
      edge: null,
      top: 0,
      height: null
    }

    this.startDrag = event => {
      window.addEventListener('mousemove', this.onDrag)
      window.addEventListener('mouseup', this.endDrag)
      documentBody.className += ' resizing-column-state'
      this.setState({
        dragging: true,
        mouseOffset: getMouseEventPosition(event.nativeEvent).left,
        startOffset: this.state.offset,
        top: 0,
        height: null
      }, () => this.props.onStart(this.state.startOffset))
    }
    this.endDrag = () => {
      window.removeEventListener('mousemove', this.onDrag)
      window.removeEventListener('mouseup', this.endDrag)
      documentBody.className = documentBody.className.replace(' resizing-column-state', '')
      let change = this.state.offset - this.state.startOffset
      this.setState({dragging: false, mouseOffset: 0, startOffset: this.state.offset}, () => this.props.onEnd(change))
    }
    this.hasDragging = () => this.state.dragging
    this.hide = () => this.setState({hide: true})
    this.setPosition = position => {
      if (!position) {
        this.setState({hide: true})
      } else {
        this.setState(Object.assign({hide: false},position))
      }
    }
    this.onDrag = event => {
      if (this.state.dragging) {
        const currentMouseOffset = getMouseEventPosition(event).left
        let offset = this.state.startOffset + ((currentMouseOffset - this.state.mouseOffset) + 5)
        const {edge} = this.state
        if (edge) {
          if (offset < edge.left) offset = edge.left
          else if (offset > edge.right) offset = edge.right
        }

        this.setState({offset})
      }
    }
  }

  render() {
    const {dragging, offset, hide, top, height} = this.state
    if (hide) return null
    let style = {left: offset+'px', top}
    if (height) style.height = height
    return (
      <div draggable="true" className={"table-column-border-dragger" + (dragging ? ' dragging' : '')}
        title="Нажмите и тащите"
        style={style}
        onMouseDown={this.startDrag}
      ></div>
    )
  }
}