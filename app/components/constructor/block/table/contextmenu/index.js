import React from 'react'
import {Popover} from '../../../../common'
import {VirtualPopoverReference, getWindowHeight, getWindowScrollTop} from "../../../../layouts/Helpers";
import Toolbar from './toolbar'

export default class Menu extends React.Component {
  render() {
    return null
  }

  componentWillUnmount() {
    if (this.popover) this.popover.hide()
    this.popover = undefined
  }

  shouldComponentUpdate(nextProps) {
    //!nextProps.selection.eqSelection(this.props.selection) || 
    //!this.props.model && !!nextProps.model || !!this.props.model && !nextProps.model || this.props.model && nextProps.model && 
    return !this.props.model.equals(nextProps.model)
  }
  
  componentDidUpdate() {
    if (this.popover) {
      const {handle, selection, model, directory} = this.props
      this.popover.props.children = (<Toolbar handle={handle} model={model} selection={selection} directory={directory}/>)
      this.popover.render()
    }
  }

  componentDidMount() {
    const {selection, target, handle, model, directory} = this.props
    let refProps = {}
    
    let cellStart = target.getDOMCell(selection.getStart())
    
    if (cellStart) {
      let {top, left} = cellStart.getBoundingClientRect()
      refProps = Object.assign(refProps, {top, left})
    } else {
      for (let y = selection.getStart('y'); y <= selection.getEnd('y'); y++) {
        if (!refProps.top) {
          for (let x = selection.getStart('x'); x <= selection.getEnd('x'); x++) {
            cellStart = target.getDOMCell({x, y})
            if (cellStart) {
              refProps.top = cellStart.getBoundingClientRect().top
              break
            }
          }
        } else {
          cellStart = target.getDOMCell({x: selection.getStart('x'), y})
          if (cellStart) {
            refProps.left = cellStart.getBoundingClientRect().left
            break
          }
        }
      }
    }

    let cellEnd = target.getDOMCell(selection.getEnd())
    if (cellEnd) {
      let offsetCellEnd = cellEnd.getBoundingClientRect()
      refProps.width = (offsetCellEnd.left - refProps.left) + cellEnd.offsetWidth
      refProps.height = (offsetCellEnd.top - refProps.top) + cellEnd.offsetHeight
    } else {
      for (let y = selection.getEnd('y'); y >= selection.getStart('y'); y--) {
        for (let x = selection.getEnd('x'); x >= selection.getStart('x'); x--) {
          cellEnd = target.getDOMCell({x, y})
          if (cellEnd) {
            refProps.height = (cellEnd.getBoundingClientRect().top - refProps.top) + cellEnd.offsetHeight
            refProps.width = (cellEnd.getBoundingClientRect().left - refProps.left) + cellEnd.offsetWidth
            break
          }
        }
      }
    }

    refProps.right = refProps.left + refProps.width
    refProps.bottom = refProps.top + refProps.height

    let host = new VirtualPopoverReference(refProps)
    let placement = 'bottom'

    const windowHeight = getWindowHeight()
    
    if ((refProps.top - getWindowScrollTop()) + host.clientHeight + 120 > windowHeight) placement = 'top'

    this.popover = new Popover({
      placement,
      host,
      children: (<Toolbar handle={handle} model={model} selection={selection} directory={directory}/>)
    })

    this.popover.show()
  }
}