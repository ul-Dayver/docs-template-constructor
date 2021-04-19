import React, {Component} from 'react'
import {closest, addEvent, removeEvent} from '../../layouts/Helpers'
import moment from 'moment'
require('moment/locale/ru')

import View from './view'
import {DATETIME_FORMATS} from "../../../constants";

export default class DatetimeField extends Component {
  constructor (props){
    super(props)
    this.input = React.createRef()
    this.container = props.withcontainer && React.createRef()
    let format = props.format || (props.onlyDay ? DATETIME_FORMATS.date : (props.onlyTime ? DATETIME_FORMATS.time : DATETIME_FORMATS.datetime))
    let value = (props.value || props.defaultValue) || ""
    let newValue = value.length ? moment(value, format) : moment()

    this.state = {opened: false, newValue, format}
    this.stopEventClick = false

    this.handlerEventWindow = this.handlerEventWindow.bind(this)
    this.handleStopEvent = event => {
      event.preventDefault()
      this.stopEventClick = true
    }
    this.handlerToggle = () => {
      this.stopEventClick = true
      this.setState({opened: !this.state.opened})
    }
    this.onChange = (value, prop) => this.setState({
      newValue: prop 
        ? moment(this.state.newValue)[prop](value)
        : moment(value)
    })
    this.handlerSubmit = () => {
      this.stopEventClick = false
      let value = moment(this.state.newValue)
      this.setState({opened: false})
      this.props.onChange(this.props.name, value)
    }
  }

  handlerEventWindow(event){
    if (this.state.opened && event) {
      if (this.stopEventClick) {
        this.stopEventClick = false
        return
      }
      let clst = closest(event.target, '.datetime-field')
      if (clst && clst === this.refs.self) return;

      this.setState({opened: false})
    }
    this.stopEventClick = false
  }

  componentDidMount(){
    addEvent(window, "scroll", this.handlerEventWindow)
    addEvent(window, "click", this.handlerEventWindow)
  }
  componentWillUnmount() {
		removeEvent(window,'scroll', this.handlerEventWindow)
    removeEvent(window,'click', this.handlerEventWindow)
  }

  render (){
    const {newValue, opened, format} = this.state
    const {value, defaultValue, onlyTime, onlyDay, width, name, id, className, icon} = this.props
    let val = (value || defaultValue) || ""
    const style = width ? {width} : null
    const mainProps = {
      value: newValue, icon, onlyDay, onlyTime, target: this.input, container: this.container,
      handleStopEvent: this.handleStopEvent, onChange: this.onChange, onSubmit: this.handlerSubmit
    }
    return (
      <div className="datetime-field" style={style || {maxWidth: '235px'}} ref="self">
        <div className="input-group" onClick={this.handlerToggle}>
          {!!icon && <span className="input-group-addon"><i className={"fa fa-" + (onlyTime ? 'clock-o' : 'calendar')}></i></span>}
          <input type="text" id={id} name={name} className={className}
            readOnly={true}
            value={val.format ? val.format(format) : val}
            ref={this.input}
            style={style}
          />
        </div>
        {!!this.container && (<div ref={this.container}></div>)}
        {!!opened && (<View {...mainProps} ref="calendar"/>)}
      </div>
    )
  }
}