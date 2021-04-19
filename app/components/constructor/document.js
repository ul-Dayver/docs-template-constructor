import {List, Stack, Record, Map} from 'immutable'
import {convertToRaw, convertFromRaw, hasTextBlock, hasTableBlock, hasPageBreak, hasPageOrientation} from './block'

const _Document = Record({
  undoStack: Stack(),
  redoStack: Stack(),
  content: Map(),
  pages: List([List()])
})

export default class Document {
  constructor(recDocument) {
    const _document = recDocument
    this.getImmutable = () => _document
  }

  isUndo() {
    return !!this.getUndoStack().peek()
  }

  isRedo() {
    return !!this.getRedoStack().peek()
  }

  getUndoStack() {
    return this.getImmutable().get('undoStack')
  }

  getRedoStack() {
    return this.getImmutable().get('redoStack')
  }

  getContent() {
    return this.getImmutable().get('content')
  }

  getPages() {
    return this.getImmutable().get('pages')
  }

  getMeta() {
    const content = this.getContent()
    let ret = []
    this.getPages().forEach(page => page.forEach(blockId => ret.push(convertToRaw(content.get(blockId)))))
    return ret
  }

  getOrientationPage(pageNum) {
    const blockId = this.getPages().get(pageNum).get(pageNum ? 1 : 0)
    const block = blockId && this.getContent().get(blockId)
    return block && hasPageOrientation(block) ? block : undefined
  }

  static redo(document) {
    const redoStack = document.getRedoStack()
    let redoStackPeak = redoStack.peek()
    let newContent = redoStackPeak.content
    if (!newContent) return document

    return new Document(new _Document({
      undoStack: document.getUndoStack().push({content: document.getContent(), pages: document.getPages()}),
      redoStack: redoStack.shift(),
      content: newContent,
      pages: redoStackPeak.pages
    }))
  }

  static undo(document) {
    const undoStack = document.getUndoStack()
    const undoStackPeek = undoStack.peek()
    const content = undoStackPeek.content
    const pages = undoStackPeek.pages
    if (!content) return document
    const redoStack = document.getRedoStack().push({
      pages: document.getPages(),
      content: document.getContent()
    })

    return new Document(new _Document({
      undoStack: undoStack.shift(),
      redoStack,
      content,
      pages
    }))
  }

  static push(document, pageNum, block, mustBecomeBoundary) {
    let content = document.getContent()
    let pages = document.getPages()
    let blockId = block.get('id')

    if (!content.has(blockId)) {
      if (hasPageBreak(block)) {
        pages = pages.push(List())
      }
      
      let pageKey = pageNum !== undefined && pageNum !== null ? pageNum : pages.size-1
      let page = hasPageOrientation(block) ? pages.get(pageKey).insert(pageKey ? 1 : 0,blockId) : pages.get(pageKey).push(blockId)
      pages = pages.set(pageKey, page)
    }

    content = content.set(blockId, block)

    let _state = {content, pages}

    if (mustBecomeBoundary) {
      Object.assign(_state, {
        undoStack: document.getUndoStack().push({content: document.getContent(), pages: document.getPages()}),
        redoStack: Stack()
      })
    }
    
    return new Document(document.getImmutable().merge(_state))
  }

  static insertAfter(document, newBlock, referenceBlockId, mustBecomeBoundary) {
    let blockId = newBlock.get('id')
    let content = document.getContent().set(blockId, newBlock)
    let pages = document.getPages()
    let refBlockIndex
    const pageKey = pages.findIndex(page => {
      refBlockIndex = page.findIndex(id => id == referenceBlockId)
      return refBlockIndex >=0
    })
    let page
    if (hasPageBreak(newBlock)) {
      let nextPage = List([blockId]).concat(pages.get(pageKey).skipWhile((id, i) => i <= refBlockIndex))
      pages = pages.insert(pageKey + 1, nextPage)
      page = pages.get(pageKey).slice(0, refBlockIndex + 1)
    } else {
      page = pages.get(pageKey).insert(refBlockIndex + 1, blockId)
    }
    pages = pages.set(pageKey, page)

    let _state = {content, pages}

    if (mustBecomeBoundary) {
      Object.assign(_state, {
        undoStack: document.getUndoStack().push({content: document.getContent(), pages: document.getPages()}),
        redoStack: Stack()
      })
    }

    return new Document(document.getImmutable().merge(_state))
  }

  static remove(document, blockId, mustBecomeBoundary) {
    let content = document.getContent()
    if (!content.has(blockId)) return document
    let pages = document.getPages()
    let inPageIndex = -1
    let pageIndex = pages.findIndex(page => {
      inPageIndex = page.findIndex(id => id === blockId)
      return inPageIndex >=0
    })
    let prevPageIndex = pageIndex-1
    
    if (hasPageBreak(content.get(blockId)) && pages.has(prevPageIndex)) {
      let prevPage = pages.get(prevPageIndex)
      pages.get(pageIndex).forEach(
        id => {
          if (hasTextBlock(content.get(id))) {
            if (hasTextBlock(content.get(prevPage.last()))) {
              let accBlock = convertToRaw(content.get(prevPage.last()))
              let rawBlock = convertToRaw(content.get(id))
              let acc = accBlock.state
              let raw = rawBlock.state

              let entityMapIndex = Object.keys(acc.entityMap).length
              let entityMap = acc.entityMap
              Object.keys(raw.entityMap).forEach((key, index) => {entityMap[index+entityMapIndex] = raw.entityMap[key]})
              let blocks = acc.blocks.concat(
                raw.blocks.map(
                  block => Object.assign(block, {
                    entityRanges: block.entityRanges.map(
                      range => Object.assign(range, {key: range.key + entityMapIndex})
                    )
                  })
                )
              )
              content = content.remove(id).set(accBlock.id, convertFromRaw(Object.assign(accBlock, {state: {blocks, entityMap}})))
            } else {
              prevPage = prevPage.push(id)
            }
          } else if (hasTableBlock(content.get(id))) prevPage = prevPage.push(id)
          else content = content.remove(id)
        }
      )
      pages = pages.set(prevPageIndex, prevPage).remove(pageIndex)
    } else if (!hasPageBreak(content.get(blockId))) {
      pages = pages.removeIn([pageIndex, inPageIndex])
      content = content.remove(blockId)
    } else {
      return document
    }
    
    let _state = {content, pages}

    if (mustBecomeBoundary) {
      Object.assign(_state, {
        undoStack: document.getUndoStack().push({content: document.getContent(), pages: document.getPages()}),
        redoStack: Stack()
      })
    }

    return new Document(document.getImmutable().merge(_state))
  }

  static createEmpty() {
    return new Document(new _Document())
  }

  static createWithMeta(metaDate) {
    let content = Map()
    let pages = List([List()])

    metaDate.forEach(_block => {
      const block = convertFromRaw(_block)
      const blockId = block.get('id')
      content = content.set(blockId, block)

      if (hasPageBreak(block)) {
        pages = pages.push(List())
      }

      let page = pages.last().push(blockId)
      pages = pages.set(pages.size-1, page)
    })

    return new Document(new _Document({content, pages}))
  }
}