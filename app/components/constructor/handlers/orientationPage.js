import createBlock, {PageOrientation} from '../block'

exports.set = function (orientation) {
  const state = new PageOrientation(orientation)
  let pageNum = this.state.editPageNum
  if (pageNum !== null && pageNum !== undefined) {
    let document = this.props.template.get('document')
    let block = document.getOrientationPage(pageNum)
    if (!block) this.insertBlockToPage(createBlock({state}), pageNum)
    else this.handleChangeBlock(createBlock({state, id: block.id}), true)
  } else {
    this.addBlock(createBlock({state}))
  }
}

exports.get = function () {
  let pageNum = this.state.editPageNum
  if (pageNum !== null && pageNum !== undefined) {
    let document = this.props.template.get('document')
    let block = document.getOrientationPage(pageNum)
    if (!block) document.getPages().findLastIndex((page,num) => num <= pageNum && (block = document.getOrientationPage(num)))
    if (block) return block
  }
  return undefined
}