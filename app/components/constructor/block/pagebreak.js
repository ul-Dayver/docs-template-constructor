export default class PageBreak {
  constructor() {
    const _break = true
    this.toRaw = () => _break
  }

  static fromRaw() {
    return new PageBreak()
  }
}