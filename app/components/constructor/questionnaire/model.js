import {genKey} from 'draft-js'

export default class Model {
  constructor(props) {
    this.key = genKey()
    this.description = (props && props.description) || ''
    this.children = undefined
    
    if (props && props.children && Array.isArray(props.children)) {
      this.children = Array.apply(null, props.children).map(child => new Model(child))
    }
  }
}