import Abstract from './abstract'

export default class NumericField extends Abstract {
  constructor(props) {
    super(props)
    this.entity = {type: "number"}
    this.handlerChange = event => {
      let {name, value} = event.target
      if (this.props.onChange) {
        value = (value+'').replace(',','.')
        this.props.onChange(name, 
          isFinite(value)
          ? (value.indexOf('.') > 0 ? parseFloat(value) : value|0)
          : 0
        )
      }
    }
  }
}