import Document from '../document'
import createBlock, {hasTextBlock, hasTableBlock, hasPageBreak, PageBreak} from '../block'
import TextModel from '../block/text/model'
import TableModel from '../block/table/model'
import {getAttr} from '../../layouts/Helpers'
import {USER_VIEWINGIF} from '../../../constants'
import {EditorState, CharacterMetadata, ContentState} from 'draft-js'

exports.clickPage = function (event) {
  if (event.target.parentNode.className.indexOf("document-constructor-page") < 0) return;
  let pageNum = getAttr(event.currentTarget, 'data-page')
  let document = this.props.template.get('document')
  let content = document.getContent()
  let pages = document.getPages()
  let page = pages.get(pageNum)
  const lastBlockId = page.size ? page.last() : undefined

  if (lastBlockId !== undefined) {
    if (hasTextBlock(content.get(lastBlockId))) {
      this.refs['block'+lastBlockId].setFocus(true)
    } else {
      this.insertBlockToPage(createBlock(), pageNum)
    }
  } else {
    this.addBlock(createBlock())
  }
}

exports.add = function (block) {
  let document = this.props.template.get('document')
  let pages = document.getPages()
  let lastBlockId = pages.last().last()
  let lastBlock = document.getContent().get(lastBlockId)

  if (hasTableBlock(block)) {
    if (!lastBlock || !hasTextBlock(lastBlock)) {
      document = Document.push(document, undefined, createBlock(), true)
    }
  } else if(lastBlock && hasTextBlock(block) && hasTextBlock(lastBlock)) {
    block = createBlock({
      id: lastBlock.get('id'),
      state: lastBlock.get('state').merge(block.get('state'))
    })
  }
  
  document = Document.push(document, undefined, block, true)
  this.focusIn = block.get('id')
  this.props.onChange({document})
}

exports.insert = function (blockID, block) {
  let document = this.props.template.get('document')
  const currentBlock = document.getContent().get(blockID)
  if (!currentBlock) return this.addBlock(block)
  if (hasTableBlock(currentBlock)) {
    let sepBlock = createBlock()
    document = Document.insertAfter(document, sepBlock, blockID, true)
    blockID = sepBlock.get('id')
  } else if (hasTextBlock(currentBlock)) {
    let textSplit = currentBlock.get('state').split()
    if (textSplit.current) document = Document.push(document, undefined, createBlock({id: blockID, state: textSplit.current}), true)
    document = Document.insertAfter(document, createBlock({state: textSplit.new}), blockID, !textSplit.current)
  }
  document = Document.insertAfter(document, block, blockID)
  this.focusIn = block.get('id')
  this.props.onChange({document})
}

exports.insertToPage = function (block, pageNum) {
  let document = this.props.template.get('document')
  document = Document.push(document, pageNum, block, true)
  this.focusIn = block.get('id')
  this.props.onChange({document})
}

exports.focus = function (_ref, editPageNum) {
  if (!_ref) return false
  const sRef = this.state._ref
  if (
    sRef && sRef.blockID == _ref.blockID &&
    sRef.getEditorState() === _ref.getEditorState() &&
    sRef.setEditorState === _ref.setEditorState &&
    editPageNum === this.state.editPageNum
  ) {
    return false
  }
  this.setState({_ref, editPageNum})
}

exports.change = function (block, mustBecomeBoundary) {
  let document = this.props.template.get('document')
  document = Document.push(document, undefined, block, mustBecomeBoundary)
  this.props.onChange({document})
}

exports.remove = function (blockId) {
  let document = this.props.template.get('document')
  const content = document.getContent()
  let block = content.get(blockId)
  const page = document.getPages().get(this.state.editPageNum)

  let pageInIndex = page.indexOf(blockId)
  let nextEditBlockIndex = page.findIndex(
    (id, i) => i > pageInIndex && (hasTextBlock(content.get(id)) || hasTableBlock(content.get(id)))
  )

  if (hasTextBlock(block)) {
    if (nextEditBlockIndex < 0) {
      let nextPageNum = this.state.editPageNum + 1
      if (document.getPages().has(nextPageNum)) {
        this.focusIn = blockId
        let nextPage = document.getPages().get(nextPageNum)
        blockId = nextPage.find(id => hasPageBreak(content.get(id)))
      } else {
        return;
      }
    } else if (hasTableBlock(content.get(page.get(nextEditBlockIndex)))) return
      //else this.focusIn = page.get(nextEditBlockIndex)

    document = Document.remove(document, blockId, true)
  } else if (hasTableBlock(block)) {
    let prevEditBlockIndex = page.findLastIndex(
      (id, i) => i < pageInIndex && (hasTextBlock(content.get(id)) || hasTableBlock(content.get(id)))
    )
    document = Document.remove(document, blockId, true)
    if (prevEditBlockIndex >= 0) {
      if (nextEditBlockIndex >= 0) {
        let prevBlock = content.get(page.get(prevEditBlockIndex))
        let nextBlock = content.get(page.get(nextEditBlockIndex))
        if (hasTextBlock(prevBlock) && hasTextBlock(nextBlock)) {
          document = Document.remove(document, nextBlock.get('id'))
          document = Document.push(document, undefined, createBlock({
            id: prevBlock.get('id'),
            state: prevBlock.get('state').merge(nextBlock.get('state'))
          }))
        }
      }
      this.focusIn = undefined
      this.focusInEnd = page.get(prevEditBlockIndex)

    } else if (nextEditBlockIndex >= 0) {
      this.focusIn = page.get(nextEditBlockIndex)
    } else {
      block = createBlock()
      this.focusIn = block.get('id')
      document = Document.push(document, this.state.editPageNum, block, true)
    }
  }

  this.props.onChange({document})
}

exports.removeNext = function(blockId) {
  let document = this.props.template.get('document')
  const content = document.getContent()
  let currentPage = document.getPages().get(this.state.editPageNum)
  let nextPage = document.getPages().get(this.state.editPageNum + 1)

  let pageInIndex = currentPage.indexOf(blockId)
  
  if (pageInIndex == currentPage.size - 1) {
    if (nextPage) {
      this.props.onChange({document: Document.remove(document, nextPage.get(0), true)})
    }
  } else {
    this.handleRemoveBlock(currentPage.find((id, i) => i > pageInIndex))
  }
}

exports.pageBreak = function() {
  const {_ref} = this.state
  const pageBreak = createBlock({state: new PageBreak()})
  if (_ref && "blockID" in _ref) {
    const {blockID} = _ref
    if (blockID) return this.insertBlock(blockID, pageBreak)
  }
  this.addBlock(pageBreak)
}

exports.changeQuestionnaire = function (questionnaire) {
  let document = this.props.template.get('document')
  let badEntity = {}
  document.getPages().forEach(page => {
    page.forEach(blockId => {
      let block = document.getContent().get(blockId)
      if (hasTextBlock(block)) {
        let replaceEntity = checkEditorStateFromBadPredicate(block.state.getEditorState(), questionnaire)
        Object.assign(badEntity, replaceEntity)
      } else if (hasTableBlock(block)) {
        let table = block.state
        table.getRows().forEach(row => row.forEach(
          cell => {
            let replaceEntity = checkEditorStateFromBadPredicate(cell.getEditorState(), questionnaire)
            Object.assign(badEntity, replaceEntity)
          }
        ))
      }
    })
  })
  
  if (Object.keys(badEntity).length) {
    let waitUserAction = {questionnaire, badEntity}
    this.setState({waitUserAction})
  } else {
    this.props.onChange({questionnaire})
  }
}

function checkEditorStateFromBadPredicate(editorState, questionnaire) {
  let currentContent = editorState.getCurrentContent()
  let replaceEntity = {}
  currentContent.getBlocksAsArray().forEach(
    contentBlock => {
      let chars = contentBlock.getCharacterList()
      
      for(let i=0;i<chars.size;i++) {
        let entityKey = chars.get(i).getEntity()
        if (!entityKey || entityKey in replaceEntity) continue;
        let entityType = currentContent.getEntity(entityKey).getType()
        let entityData = currentContent.getEntity(entityKey).getData()
        if (entityData && entityData.condition) {
          let badPredicates = findBadPredicate(questionnaire, entityData.condition)
          if (badPredicates.length) {
            let condition = fixBadPredicates(entityData.condition, badPredicates)
            if (condition.length) {
              replaceEntity[entityKey] = Object.assign({},entityData,{condition})
            } else {
              if (entityType === USER_VIEWINGIF) {
                replaceEntity[entityKey] = null
              } else {
                replaceEntity[entityKey] = {...entityData}
                delete replaceEntity[entityKey].condition
              }
            }
          }
        }
      }
    }
  )
  return replaceEntity
}

function findBadPredicate(questionnaire, condition) {
  let ret = []
  condition.forEach(
    (predicate, index) => {
      let evrica
      if (Array.isArray(predicate)) {
        evrica = findBadPredicate(questionnaire, predicate)
        if (evrica.length) ret.push({index, evrica})
      } else if (typeof predicate == 'object') {
        evrica = questionnaire.find(item => item.key == predicate.key)
        if (!evrica) ret.push(index)
        else if (evrica.children && evrica.children.length) {
          evrica = evrica.children.find(item => item.key == predicate.value || predicate.value === null)
          if (!evrica) ret.push([index])
        }
      }
    }
  )
  return ret
}

function fixBadPredicates(condition, predicates) {
  let ret = [...condition]
  predicates.forEach(predicate => {
    if (typeof predicate == 'number') {
      if (predicate > 0) ret.splice(predicate-1,2)
      else if (predicate === 0 && ret.length > 2) ret.splice(predicate,2)
      else if (predicate === 0 && ret.length === 1) ret = []
    } else if (Array.isArray(predicate)) {
      ret[predicate[0]] = Object.assign({}, ret[predicate[0]], {value: null})
    } else {
      ret.splice(predicate.index,1, fixBadPredicates(ret[predicate.index], predicate.evrica))
    }
  })
  return ret
}

exports.applyChangeQuestionnaire = function () {
  let document = this.props.template.get('document')
  const {badEntity, questionnaire} = this.state.waitUserAction
  document.getPages().forEach(page => {
    page.forEach(blockId => {
      let block = document.getContent().get(blockId)
      if (hasTextBlock(block)) {
        let editorState = replaceEntity(block.state.getEditorState(), badEntity)
        block = createBlock({
          id: block.id,
          state: new TextModel(editorState)
        })
        document = Document.push(document, undefined, block)
      } else if (hasTableBlock(block)) {
        let table = block.state
        table.getRows().forEach(row => row.forEach(
          cell => {
            let editorState = replaceEntity(cell.getEditorState(), badEntity)
            table = TableModel.setCell(table, Object.assign(cell.toJSON(), {editorState}))
          }
        ))
        block = createBlock({id: block.id, state: table})
        document = Document.push(document, undefined, block)
      }
    })
  })
  
  this.props.onChange({questionnaire, document})
  this.setState({waitUserAction: null})
}

function replaceEntity(editorState, badEntity) {
  let currentContent = editorState.getCurrentContent()
  let updatedBlocks = {}
  currentContent.getBlocksAsArray().forEach(
    contentBlock => {
      let chars = contentBlock.getCharacterList()
      let blockKey = contentBlock.getKey()
      for(let i=0;i<chars.size;i++) {
        let entityKey = chars.get(i).getEntity()
        if (entityKey && entityKey in badEntity) {
          let entityData = badEntity[entityKey]
          currentContent.replaceEntityData(entityKey, entityData)
          do {
            chars = chars.set(i, CharacterMetadata.applyEntity(chars.get(i), entityData ? entityKey: null))
            i++
          } while (i<chars.size && entityKey === chars.get(i).getEntity())
          i--
        }
      }
      updatedBlocks[blockKey] = contentBlock.set('characterList', chars)
    }
  )
  const blocks = currentContent.getBlockMap().merge(updatedBlocks).toArray()
  currentContent = ContentState.createFromBlockArray(blocks)
  
  return EditorState.push(editorState, currentContent, 'apply-entity')
}