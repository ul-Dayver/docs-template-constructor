import React from 'react'
import Abstract from './abstract'

export default class Varchar extends Abstract {
  constructor(props) {
    super(props)
    this.entity = {type: props.type || 'text'}
    this.getChildren = props => props.type && props.type == 'textarea'
      ? (<textarea {...props}></textarea>)
      : (<input {...props}/>)
  }
}