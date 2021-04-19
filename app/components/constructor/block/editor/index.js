import React from 'react'
import {Editor, EditorState, SelectionState} from 'draft-js'
import blockStyleFn from './blockStyleFn'

const getBorderOffsetFromNotEditableBlock = (contentState, entityKey, block, selectionOffset, IsBackward) => {
  const entityData = contentState.getEntity(entityKey).getData()
  if (entityData.editable === false) {
    let charList = block.getCharacterList()
    if (IsBackward) {
      let character = charList.slice(selectionOffset).findEntry(
        character => character.getEntity() !== entityKey
      )
      return character ? selectionOffset + character[0] : charList.size
    } else {
      let character = charList.slice(0, selectionOffset).findLastEntry(
        character => character.getEntity() !== entityKey
      )
      return character ? selectionOffset - character[0] : 0
    }
  }

  return undefined
}

const moveCursorFromNotEditableBlock = (editorState) => {
  const selection = editorState.getSelection()
  const contentState = editorState.getCurrentContent()
  if (!selection.getHasFocus()) return editorState
  
  if (selection.isCollapsed()) {
    const contentBlock = contentState.getBlockForKey(selection.getAnchorKey())
    const entityKey = contentBlock.getEntityAt(selection.getStartOffset())

    if (entityKey) {
      let newSelection = selection
      let flag = false
      
      const anchorOffset = !!selection.getAnchorOffset()
        ? getBorderOffsetFromNotEditableBlock(contentState, entityKey, contentBlock, selection.getAnchorOffset(), false)
        : 0
      const focusOffset = selection.getAnchorOffset() < contentBlock.getCharacterList().size - 1
        ? getBorderOffsetFromNotEditableBlock(contentState, entityKey, contentBlock, selection.getAnchorOffset(), true)
        : selection.getAnchorOffset()

      if (anchorOffset !== undefined && anchorOffset !== selection.getAnchorOffset()) {
        newSelection = newSelection.merge({anchorOffset})
        flag = true
      }

      if (focusOffset !== undefined && focusOffset !== selection.getAnchorOffset()) {
        newSelection = newSelection.merge({focusOffset})
        flag = true
      }
      if (flag) return EditorState.forceSelection(editorState, newSelection)
    }
  } else {
    const anchorBlock = contentState.getBlockForKey(selection.getAnchorKey())
    const focusBlock = contentState.getBlockForKey(selection.getFocusKey())
    const anchorEntity = selection.getAnchorOffset() > 0 && selection.getAnchorOffset() < anchorBlock.getCharacterList().size - 1
      ? anchorBlock.getEntityAt(selection.getAnchorOffset())
      : null
    const focusEntity = selection.getFocusOffset() > 0 && selection.getFocusOffset() < focusBlock.getCharacterList().size - 1
      ? focusBlock.getEntityAt(selection.getFocusOffset())
      : null
    let newSelection = selection
    let flag = false

    if (anchorEntity) {
      const anchorOffset = getBorderOffsetFromNotEditableBlock(contentState, anchorEntity, anchorBlock, selection.getAnchorOffset(), selection.getIsBackward())
      if (anchorOffset) {
        newSelection = newSelection.merge({anchorOffset})
        flag = true
      }
      
    }

    if (focusEntity) {
      const focusOffset = getBorderOffsetFromNotEditableBlock(contentState, focusEntity, focusBlock, selection.getFocusOffset(), !selection.getIsBackward())
      if (focusOffset) {
        newSelection = newSelection.merge({focusOffset})
        flag = true
      }
    }
    
    if (flag) return EditorState.forceSelection(editorState, newSelection)
  }

  return editorState
}

export default class DirectlyEditor extends React.Component {
  constructor(props){
    super(props)
    this.handleFocus = this.handleFocus.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(editorState) {
    editorState = moveCursorFromNotEditableBlock(editorState)
    
    const newContentState = editorState.getCurrentContent()
    const currentContentState = this.props.editorState.getCurrentContent()

    const newSelection = editorState.getSelection()
    const currentSelection = this.props.editorState.getSelection()
    if (currentSelection.getHasFocus() == false && newSelection.getHasFocus() == true) {
      this.props.onFocus({
        getEditorState: () => this.props.editorState,
        setEditorState: this.editor.update
      })
    }

    if (newContentState === currentContentState) {
      this.props.onChange(editorState)
      return;
    }
    
    const changeType = editorState.getLastChangeType()
    const lastChangeType = this.props.editorState.getLastChangeType()

    const mustBecomeBoundary = (
      this.props.editorState.getSelection() !== currentContentState.getSelectionAfter() || 
      (changeType !== lastChangeType || changeType !== 'insert-characters' && changeType !== 'backspace-character' && changeType !== 'delete-character')
    )
    
    this.props.onChange(editorState, mustBecomeBoundary)
  }

  handleFocus(toEnd) {
    let editorState = this.props.editorState
    
    const content = editorState.getCurrentContent()
    const blockMap = content.getBlockMap()
    
    const key = blockMap.last().getKey()
    const length = blockMap.last().getLength()
    
    const selection = new SelectionState({
      anchorKey: key,
      anchorOffset: toEnd ? length : 0,
      focusKey: key,
      focusOffset: toEnd ? length : 0,
      hasFocus: true
    })
    
    this.editor.update(EditorState.forceSelection(editorState, selection))
  }

  shouldComponentUpdate(nextProps) {
    const newContentState = nextProps.editorState.getCurrentContent()
    const currentContentState = this.props.editorState.getCurrentContent()
    const newSelection = nextProps.editorState.getSelection()
    const currentSelection = this.props.editorState.getSelection()

    if (newContentState === currentContentState && newSelection === currentSelection) return false
    
    return true
  }

  render () {
    return (
      <div onKeyDown={this.props.onKeyDown || (() => {})}>
        <Editor
          blockStyleFn={blockStyleFn}
          editorState={this.props.editorState}
          onChange={this.onChange}
          ref={(e) => {this.editor = e;}}
        />
      </div>
    )
  }
}