import React, { Component } from 'react'
import Layout from './layout'

export default class AbstractField extends Component {
  constructor(props) {
    super(props)
    this.self = React.createRef()
    this.entity = {}
    const {onChange} = props
    if (onChange) this.handlerChange = event => onChange(event.target.name, event.target.value)
    this.getChildren = props => (<input {...props}/>)
    this.focus = () => this.self.current.focus()
  }
  componentDidMount() {
    !!this.props.autoFocus && this.focus()
  }
  render() {
    const {id, value, defaultValue, label, name, required, helperText, helperType, inLine, width, size, undecor} = this.props
    const layoutProps = {id, label, helperText, helperType, inLine}
    let props = Object.assign({
      ref:this.self, onChange: this.handlerChange, value, defaultValue,
      className: undecor ? 'form-control-without-decoration' : "form-control" + (size ? ' form-control-' + size : ''),
      id, name: name || id
    }, typeof this.entity == 'function' ? this.entity() : this.entity)
    !!width && (props.style = Object.assign({width}, props.style || {}))
    !!required && (props.required = true)
    return undecor ? this.getChildren(props) : (<Layout {...layoutProps}>{this.getChildren(props)}</Layout>)
  }
}