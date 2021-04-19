import DateTime from './datetime'
export default class TimeField extends DateTime {
  constructor(p) {
    super(p)
    this.format = "time"
    this.entity = () => Object.assign(super.entity(), {onlyTime: true})
  }
}