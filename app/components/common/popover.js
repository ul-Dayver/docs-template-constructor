import React from 'react'
import {Popper} from 'react-popper'
import ReactDOM from "react-dom"
import {documentBody} from '../layouts/Helpers'

const HIDDEN = 0
const SHOW = 1
const OPENED = 2

let timer = undefined

const toggle = function(status, action, delay) {
  clearTimeout(timer)
  if (status === this.getStatus()) return false
  this.setStatus(SHOW)
  this.render();
  timer = setTimeout(() => {
    this.setStatus(status)
    action()
  }, delay)
}

const Container = document.createElement('div')
documentBody.appendChild(Container)

export default class Popover {
  constructor(props) {
    this.props = props
    let prevStatus
    let status = props.show ? OPENED : HIDDEN
    
    this.show = toggle.bind(this, OPENED, this.render.bind(this), 10)
    this.hide = toggle.bind(this, HIDDEN, this.destroy.bind(this), 300)
    
    this.setStatus = (val) => {prevStatus = status; status = val}
    this.getStatus = () => status
    this.getPrevStatus = () => prevStatus
  }

  destroy() {
    if (this.popover) {
      this.popover = undefined
      ReactDOM.unmountComponentAtNode(Container)
    }
  }

  setListeners() {
    if (Container.firstChild) {
      this.popover = Container.firstChild
    }
  }

  getElement() {
    return this.popover
  }

  render () {
    if (this.getStatus() === HIDDEN || this.getPrevStatus() === this.getStatus()) return null
    
    const {title, children, placement, host} = this.props
    const className = "popover fade bs-popover-" + placement + (this.getStatus() === OPENED ? " show" : "")
    ReactDOM.render(
      <Popper placement={placement} referenceElement={host} modifiers={{arrow: {element: 'arrow'}}}>
        {
          ({placement, style, ref, arrowProps}) => (
            <div
              ref={ref}
              className={className}
              style={style}
              data-placement={placement}
            >
              <div ref={arrowProps.ref} style={arrowProps.style} className="arrow"></div>
              {!!title && (<h3 className="popover-header">{title}</h3>)}
              <div className="popover-body">{children}</div>
            </div>
          )
        }
      </Popper>,
      Container,
      () => this.setListeners()
    )
  }
}