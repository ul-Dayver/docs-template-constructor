import DateTime from './datetime'

export default class DateField extends DateTime {
  constructor(p) {
    super(p)
    this.format = 'date'
    this.entity = () => Object.assign(super.entity(), {onlyDay: true})
  }
}