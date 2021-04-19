export default class PageOrientation {
  constructor(orientation) {
    const _orientation = (orientation || 0)|0
    this.toRaw = () => _orientation
    this.hasLandscape = () => _orientation === 1
  }
 
  static fromRaw(orientation) {
    return new PageOrientation(orientation)
  }
}