import React from 'react'
import {EditorState, Modifier, SelectionState} from 'draft-js'
import {Modal} from '../../../common'
import {preventDefault} from '../../../layouts/Helpers'
import Option from '../../block/editor/viewingif/option'
import {USER_VIEWINGIF} from '../../../../constants'
import {Map} from 'immutable'

const getMapChildEntity = (contentState, selection) => {
  const startKey = selection.getStartKey()
  const startOffset = selection.getStartOffset()
  const endKey = selection.getEndKey()
  const endOffset = selection.getEndOffset()

  const startBlockIndex = contentState.getBlocksAsArray().findIndex(block => block.getKey() === startKey)
  const endBlockIndex = contentState.getBlocksAsArray().findIndex(block => block.getKey() === endKey)

  const selectedBlocks = contentState.getBlocksAsArray().slice(startBlockIndex, endBlockIndex + 1)

  let ret = Map()

  selectedBlocks.forEach(
    block => {
      let start = block.getKey() === startKey ? startOffset : 0
      let end = block.getKey() === endKey ? endOffset : block.getLength()

      for (let offset = start; offset <= end; offset++) {
        let entityKey = block.getEntityAt(offset)
        if (entityKey !== null) {
          let entity = contentState.getEntity(entityKey)
          if (entity.getType() !== USER_VIEWINGIF) {
            if (!ret.has(entityKey)) {
              ret = ret.set(entityKey,
                Map({
                  instance: entity.toJS(),
                  ranges: Map({anchorKey: block.getKey(), focusKey: block.getKey(), anchorOffset: offset, focusOffset: offset})
                })
              )
            }
            ret = ret.setIn([entityKey, 'ranges' , 'focusOffset'], offset + 1)
          }
        }
      }
    }
  )

  return ret
}

const findEntity = (content, block, begin, end) => {
  let ret = undefined
  for (let offset = begin; offset <= end; offset++) {
    let entityKey = block.getEntityAt(offset)
    if (entityKey !== null && content.getEntity(entityKey).getType() === USER_VIEWINGIF) {
      if (ret) {
        if (ret !== entityKey) {
          throw 'find bad entity in viewingif'
        }
      } else {
        ret = entityKey
      }
    }
  }
  return ret
}

const findEntityRanges = (contentState, entityKey) => {
  let ret = {}
  if (
    !contentState.getBlockMap().find(
      block => {
        const character = block.getCharacterList().findIndex(
          character => character.getEntity() === entityKey
        )
        if (character >=0) {
          ret.anchorKey = block.getKey()
          ret.anchorOffset = character
          return true
        }
        return false
      }
    )
  ) return undefined

  if (
    !contentState.getBlockMap().findLast(
      block => {
        const character = block.getCharacterList().findLastIndex(
          character => character.getEntity() === entityKey
        )
        
        if (character >= 0) {
          ret.focusKey = block.getKey()
          ret.focusOffset = character
          return true
        }
        return false
      }
    )
  ) return undefined

  return ret
}

const init = () => {
  return {
    ifConfigOpened: false,
    entityKey: null,
    selection: null,
    condition: null
  }
}

export default class VButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = init()

    this.accept = this.accept.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.breakDefault = this.breakDefault.bind(this)
    this.setCondition = condition => this.setState({condition})
  }

  breakDefault(callback) {
    this.setState(init(), () => { callback && {}.toString.call(callback) === '[object Function]' ? callback() : null })
  }

  accept() {
    const {getEditorState, setEditorState} = this.props
    let entityData = {condition: this.state.condition, editable: true}

    let editorState = getEditorState()
    let contentState = editorState.getCurrentContent()
    let selection = this.state.selection
    let entityKey = this.state.entityKey
    let contentStateWithEntity
    let mapChildEntity = null

    if (!selection.isCollapsed()) {
      mapChildEntity = getMapChildEntity(contentState, selection)
    }

    if (entityKey) {
      contentStateWithEntity = contentState.replaceEntityData(entityKey, entityData)
    } else {
      selection = selection || editorState.getSelection()
      contentStateWithEntity = contentState.createEntity(USER_VIEWINGIF,'MUTABLE', entityData)
      entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    }
    
    contentState = Modifier.applyEntity(contentStateWithEntity, selection, entityKey)
    editorState = EditorState.push(editorState, contentState,'apply-entity')

    if (mapChildEntity && mapChildEntity.size) {
      mapChildEntity.forEach(
        entity => {
          let contentState = editorState.getCurrentContent()
          contentState = contentState.createEntity(
            entity.get('instance').type,
            entity.get('instance').mutability,
            Object.assign({}, entity.get('instance').data, {condition: entityData.condition})
          )
          let childEntityKey = contentState.getLastCreatedEntityKey()
          
          contentState = Modifier.applyEntity(contentState, new SelectionState(entity.get('ranges').toJS()), childEntityKey)
          editorState = EditorState.push(editorState, contentState,'apply-entity')
        }
      )
    }
    
    this.breakDefault(() => setEditorState(editorState))
  }

  active() {
    const {getEditorState} = this.props
    if (!getEditorState) return false
    const editorState = getEditorState()
    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()

    if (selection.isCollapsed()) {
      const entityKey = contentState.getBlockForKey(selection.getStartKey()).getEntityAt(selection.getStartOffset())
      return entityKey && contentState.getEntity(entityKey).getType() === USER_VIEWINGIF
    }

    const startBlockKey = selection.getStartKey()
    const endBlockKey = selection.getEndKey()

    const startBlockIndex = contentState.getBlocksAsArray().findIndex(block => block.getKey() === startBlockKey)
    const endBlockIndex = contentState.getBlocksAsArray().findIndex(block => block.getKey() === endBlockKey)
    const selectedBlocks = contentState.getBlocksAsArray().slice(startBlockIndex, endBlockIndex + 1)
    let beforeEntityKey
    return selectedBlocks.every(
      (block) => {
        let start = block.getKey() === startBlockKey ? selection.getStartOffset() : 0
        let end = block.getKey() === endBlockKey ? selection.getEndOffset() : block.getLength()
        
        for (let offset = start; offset <= end; offset++) {
          let entityKey = block.getEntityAt(offset)
          if (entityKey && contentState.getEntity(entityKey).getType() === USER_VIEWINGIF) {
            if (beforeEntityKey && entityKey !== beforeEntityKey) return false
            beforeEntityKey = entityKey
          }
        }
        return true
      }
    )
  }

  handleClick() {
    const {getEditorState} = this.props
    const editorState = getEditorState()
    const selection = editorState.getSelection()
    let state = {ifConfigOpened: true, selection}
    const contentState = editorState.getCurrentContent()

    if (selection.isCollapsed()) {
      const selectedBlock = contentState.getBlockForKey(selection.getStartKey())
      const entityKey = selectedBlock.getEntityAt(selection.getStartOffset())
      if (entityKey && contentState.getEntity(entityKey).getType() === USER_VIEWINGIF) {
        state.condition = contentState.getEntity(entityKey).getData().condition
        state.entityKey = entityKey

        let ranges = findEntityRanges(contentState, entityKey)

        if (ranges) {
          state.selection = new SelectionState(ranges)
        } else {
          throw 'undefined ranges from entity'
        }
      } else {
        return false
      }
    } else {

      const startBlockKey = selection.getStartKey()
      const endBlockKey = selection.getEndKey()

      const startBlockIndex = contentState.getBlocksAsArray().findIndex(block => block.getKey() === startBlockKey)
      const endBlockIndex = contentState.getBlocksAsArray().findIndex(block => block.getKey() === endBlockKey)
      const selectedBlocks = contentState.getBlocksAsArray().slice(startBlockIndex, endBlockIndex + 1)

      const entity = selectedBlocks.reduce(
        (acc, block) => {
          let start = block.getKey() === startBlockKey ? selection.getStartOffset() : 0
          let end = block.getKey() === endBlockKey ? selection.getEndOffset() : block.getLength()
          
          let entity = findEntity(contentState, block, start, end)

          if (!!entity) {
            if (!!acc) {
              if (acc === entity) {
                return acc
              } else {
                throw 'so many entities in selected blocks'
              }
            } else {
              return entity
            }
          } else {
            return acc
          }
        },
        false
      )

      if (entity) {
        state.entityKey = entity
        state.condition = contentState.getEntity(state.entityKey).getData().condition
        state.selection = new SelectionState({anchorKey: selection.getStartKey(), anchorOffset: selection.getStartOffset(), focusOffset: selection.getEndOffset(), focusKey: selection.getEndKey()})

        let ranges = findEntityRanges(contentState, state.entityKey)
        if (ranges) {
          const entityStartBlockIndex = contentState.getBlocksAsArray().findIndex(block => block.getKey() === ranges.anchorKey)
          if (entityStartBlockIndex < startBlockIndex) {
            state.selection = state.selection.merge({anchorKey: ranges.anchorKey, anchorOffset: ranges.anchorOffset})
          } else if (entityStartBlockIndex === startBlockIndex) {
            state.selection = state.selection.merge({anchorOffset: Math.min(ranges.anchorOffset, selection.getStartOffset())})
          }
          const entityEndBlockIndex = contentState.getBlocksAsArray().findIndex(block => block.getKey() === ranges.focusKey)
          if (entityEndBlockIndex > endBlockIndex) {
            state.selection = state.selection.merge({focusKey: ranges.focusKey, focusOffset: ranges.focusOffset})
          } else if (entityEndBlockIndex === endBlockIndex) {
            state.selection = state.selection.merge({focusOffset: Math.max(ranges.focusOffset, selection.getEndOffset())})
          }
        } else {
          throw 'undefined ranges from entity'
        }
      }
    }

    this.setState(state)
  }

  render() {
    const {theme, constructor} = this.props
    const questionnaire = constructor.getQuestionnaire()
    return (
      <div className={theme.buttonWrapper} onMouseDown={preventDefault}>
        <button id="viewingif-tool-btn" className={theme.button} onClick={this.handleClick} disabled={!this.active()} type="button" title="Прикрепить условие">
          <i className="icon-show-sidebar"></i>
        </button>
        <Modal
          isActive={this.state.ifConfigOpened}
          clickClose={this.breakDefault}
          title={'Условие отображения текста'}
          buttons={!!questionnaire && [
            {label: 'Отменить', className: 'btn-secondary', handle: this.breakDefault},
            {label: 'Применить', disabled: !this.state.condition, handle: this.accept}
          ]}
        >
          {
            !!questionnaire && Array.isArray(questionnaire)
            ? <Option questionnaire={questionnaire} condition={this.state.condition} onChange={this.setCondition}/>
            : <h3>Чтобы создать условие, заполните опросный лист!</h3>
          }
        </Modal>
      </div>
    )
  }
}