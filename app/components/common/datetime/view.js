import React from 'react'
import ReactDOM from 'react-dom'

import {documentBody, Offset, getWindowScrollTop, getWindowScrollLeft, getWindowHeight} from '../../layouts/Helpers'
import Calendar from './calendar'
import Time from './time'

const container = document.createElement('div')
documentBody.appendChild(container)

export default class View extends React.Component {
  render() {
    return null
  }
  componentWillUnmount() {
    if (this.container.firstChild) {
      const calendar = this.container.firstChild
      calendar.className = calendar.className.replace('fadeIn','fadeOut')
      calendar.className = calendar.className.indexOf('Down') >=0
        ? calendar.className.replace('Down','Up')
        : calendar.className.replace('Up','Down')
    }
    setTimeout(() =>ReactDOM.unmountComponentAtNode(this.container), 500)
  }
  setListeners() {
    if (this.container.firstChild && this.props.target && this.props.target.current) {
      const calendar = this.container.firstChild
      const target = this.props.target.current
      let windowHeight = getWindowHeight()
      let offsetInput = Offset(target)
      let top = offsetInput.top - getWindowScrollTop()
      let topWithHeight = top + target.offsetHeight
      if (this.props.container) {
        if (topWithHeight + calendar.offsetHeight > windowHeight) {
          this.container.style.top = "-" + calendar.offsetHeight + "px";
        } else {
          this.container.style.top = "auto"
        }
      } else {
        this.container.style.left = (offsetInput.left - getWindowScrollLeft())+'px'
        if (topWithHeight + calendar.offsetHeight > windowHeight) {
          this.container.style.top = (top - calendar.offsetHeight) + "px";
          calendar.className = calendar.className.replace('Down', 'Up')
        } else {
          this.container.style.top = topWithHeight + "px"
          calendar.className = calendar.className.replace('Up', 'Down')
        }
      }
    }
  }
  componentDidMount() {
    this.container = this.props.container ? this.props.container.current : container
    this.renderView(this.props)
  }
  componentDidUpdate() {
    this.renderView(this.props)
  }
  renderView({value, icon, onlyDay, onlyTime, handleStopEvent, onChange, onSubmit}) {
    this.container.className = "datetime-field-calendar-wrap"
    ReactDOM.render(
      <div className="fadeInDown animated faster datetime-field-calendar"
        onClick={handleStopEvent}>
        {!onlyTime && (<Calendar value={value} onChangeDay={onChange}/>)}
        <div className="d-flex flex-row gray-bg border-top py-2 px-1 justify-content-center">
          {!onlyDay && (<Time value={value} onChange={onChange} icon={icon}/>)}
          <button type="button" onClick={onSubmit} className="btn btn-sm btn-primary">Применить</button>
        </div>
      </div>,
      this.container,
      () => this.setListeners()
    )
    
  }
}