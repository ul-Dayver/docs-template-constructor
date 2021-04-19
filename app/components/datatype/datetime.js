import React from 'react'
import {DateTime} from '../common'
import Abstract from './abstract'
import {DATETIME_FORMATS} from "../../constants";

const entity = function() {
  const {width, icon, withcontainer} = this.props
  const {value} = this.state
  return {format: DATETIME_FORMATS[this.format], width, icon, withcontainer, value}
}
export default class DateTimeField extends Abstract {
  constructor(props) {
    super(props)
    this.state = {value: (props.value||props.defaultValue) || ""}
    this.format = 'datetime'
    this.entity = entity
    const {onChange} = props
    this.handlerChange = (name, value) => {
      value = value.format(DATETIME_FORMATS[this.format])
      this.setState({value}, () => onChange(name, value))
    }
    this.getChildren = props => <DateTime {...props}/>
    this.focus = () => this.self.current.handlerToggle()
  }
  componentDidMount() {
    !!this.props.autoFocus && setTimeout(this.focus, 100)
  }

  entity() {
    return entity.call(this)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultValue !== undefined) return null
    return (props.value !== state.value) ? {value: props.value} : null
  }
}