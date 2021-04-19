import React from 'react'
import {getAttr, setAttribute, getWindowHeight, getWindowScrollTop, Offset, preventDefault, removeEvent, addEvent} from "../layouts/Helpers"

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
    this.hasClick = false
    this.close = () => this.setState({show: false})
    this.open = () => this.setState({show: true})
    this.onWindowClick = () => {
      if (!this.hasClick) this.close()
      this.hasClick = false
    }
    this.handleClick = e => {
      e.preventDefault();
      this.hasClick = true
      this.setState({show: !this.state.show})
    }
    this.handleClickOption = e => {
      e.preventDefault();
      const {options, onSelect} = this.props
      const optionKey = getAttr(e.currentTarget, 'data-key')
      const option = options[optionKey];
      (option.handle && option.handle(e, this));
      (onSelect && onSelect(option, this))
    }
    this.onWindowScroll = () => {
      const {menu} = this.refs
      if (menu) {
        setAttribute(menu, 'x-placement', 'bottom-start')
        menu.style.top = "95%"

        if (this.state.show && (Offset(menu).top + menu.offsetHeight) - getWindowScrollTop() > getWindowHeight()) {
          setAttribute(menu, 'x-placement', 'top-start')
          menu.style.top = -(menu.offsetHeight+1) + "px"
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props.byHover) return false
    removeEvent(window, 'click', this.onWindowClick)
    removeEvent(window, 'scroll', this.onWindowScroll)
  }
  
  componentDidUpdate() {
    this.onWindowScroll()
    if (this.props.byHover) return false
    if (this.state.show) {
      addEvent(window,'click', this.onWindowClick)
      addEvent(window,'scroll', this.onWindowScroll)
    } else {
      removeEvent(window, 'click', this.onWindowClick)
      removeEvent(window, 'scroll', this.onWindowScroll)
    }
  }

  render() {
    const {title, label, options, bttnClassName, byHover, itemClass} = this.props
    const showClass = this.state.show ? " show" : ''
    return (
      <div className={"dropdown" + showClass}
        onMouseEnter={byHover ? this.open: preventDefault}
        onMouseLeave={byHover ? this.close: preventDefault}>
        <a
          className={bttnClassName || "btn btn-secondary dropdown-toggle"}
          href="#"
          onClick={!byHover ? this.handleClick: preventDefault}
          title={title || "Нажмите для выбора"}
        >{label}</a>
        <div className={"dropdown-menu" + showClass} style={{top: '95%', minWidth: '0'}} x-placement="bottom-start" ref="menu">
          {
            options.map(
              (option, i) => (
                <a
                  data-key={i}
                  onClick={this.handleClickOption}
                  key={i}
                  className={(itemClass ? itemClass : "dropdown-item") + (option.active ? ' active': '')} href="#">
                  {option.label}
                </a>
              )
            )
          }
        </div>
      </div>
    )
  }
}