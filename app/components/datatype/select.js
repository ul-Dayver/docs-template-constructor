import React from 'react'
import Abstract from './abstract'

export default class SelectField extends Abstract {
  constructor(props) {
    super(props)
    this.getChildren = props => (
      <select {...props} >{props.options.map((item, i) => <option key={'selectfield-'+ props.id + '-' + i} value={item.value}>{item.text}</option>)}</select>
    )
  }
}