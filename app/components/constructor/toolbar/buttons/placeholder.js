import React from 'react'
import {EditorState, Modifier} from 'draft-js'
import {Modal, Dropdown} from '../../../common'
import {USER_PLACEHOLDER, USER_VIEWINGIF, USER_LEGISLATION, USER_VARIABLE, USER_DOC} from '../../../../constants'
import {preventDefault} from '../../../layouts/Helpers'

const init = (props) => {
  return {name: 'ЗАПОЛНИТЕЛЬ', modalOpened: false, entityKey: null, selection: null, condition: null, datatype: props.constructor.datatype.first().get('name')}
}

export default class VButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = init(props)
    this.onClick = this.onClick.bind(this)
    this.accept = this.accept.bind(this)
    this.active = this.active.bind(this)
    this.breakDefault = (callback) => this.setState(init(this.props), () => { callback && {}.toString.call(callback) === '[object Function]' ? callback() : null })
    this.selectDataType = data => this.setState({datatype: data.value})
    this.handleChangeName = e => this.setState({name: e.target.value})
  }

  accept() {
    const {getEditorState, setEditorState} = this.props
    let entityData = {name: this.state.name, datatype: this.state.datatype, editable: false}
    if (this.state.condition !== null && this.state.condition !== undefined) {
      entityData.condition = this.state.condition
    }

    let editorState = getEditorState()
    let contentState = editorState.getCurrentContent()
    let selection = this.state.selection //editorState.getSelection()
    
    if (selection.isCollapsed()) {
      contentState = Modifier.insertText(contentState, selection, entityData.name)
      editorState = EditorState.push(editorState, contentState,'insert-characters')
      selection = selection.merge({
        focusOffset: selection.getAnchorOffset() + entityData.name.length
      })
    }

    let contentStateWithEntity
    let entityKey = this.state.entityKey
    
    if (entityKey !== null) {
      let oldData = contentState.getEntity(entityKey).getData()
      if (entityKey && oldData.name !== entityData.name) {
        contentState = Modifier.replaceText(contentState, selection, entityData.name)
        editorState = EditorState.push(editorState, contentState,'insert-characters')
        contentStateWithEntity = contentState.createEntity(USER_PLACEHOLDER,'IMMUTABLE', entityData)
      } else {
        contentStateWithEntity = contentState.replaceEntityData(entityKey, entityData)
      }
    } else {
      contentStateWithEntity = contentState.createEntity(USER_PLACEHOLDER,'IMMUTABLE', entityData)
      entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    }

    selection = selection.merge({
      anchorOffset: selection.getStartOffset(),
      focusOffset: selection.getStartOffset() + entityData.name.length,
      isBackward: false
    })
    
    contentState = Modifier.applyEntity(contentStateWithEntity, selection, entityKey)
    editorState = EditorState.push(editorState, contentState,'apply-entity')
    
    this.breakDefault(() => setEditorState(editorState))
  }

  onClick(event) {
    event.preventDefault()
    const {getEditorState} = this.props
    const editorState = getEditorState()
    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()

    let state = {modalOpened: true, selection, condition: null, entityKey: null}

    const contentBlock = contentState.getBlockForKey(selection.getStartKey())
    const startOffset = selection.getStartOffset()
    const endOffset = selection.getEndOffset()

    for (let offset = startOffset; offset <= endOffset; offset++) {
      let entityKey = contentBlock.getEntityAt(offset)
      if (entityKey !== null && contentState.getEntity(entityKey).getType() === USER_PLACEHOLDER) {
        state.entityKey = entityKey
        break
      }
    }

    if (!selection.isCollapsed()) {
      state.name = contentBlock.getText().substring(startOffset, endOffset)
    }

    if (state.entityKey !== null) {
      let oldData = contentState.getEntity(state.entityKey).getData()
      if (oldData.condition) state.condition = oldData.condition
      state.datatype = oldData.datatype
    }

    if (!state.condition) {
      for (let offset = startOffset; offset <= endOffset; offset++) {
        let entityKey = contentBlock.getEntityAt(offset)
        if (entityKey !== null) {
          let parentEntity = contentState.getEntity(entityKey)
          if (parentEntity.getType() === USER_VIEWINGIF) {
            state.condition = parentEntity.getData().condition
            break
          }
        }
      }
    }

    this.setState(state)
  }

  active() {
    const {getEditorState} = this.props
    if (!getEditorState) return false
    const editorState = getEditorState()
    const contentState = editorState.getCurrentContent()
    const selection = editorState.getSelection()

    if (selection.getAnchorKey() !== selection.getFocusKey()) return false
 
    const contentBlock = contentState.getBlockForKey(selection.getStartKey())
    const startOffset = selection.getStartOffset()
    const endOffset = selection.getEndOffset()

    //if (selection.isCollapsed()) return true
    
    let entityKeyMap = {};
//    let placeHolderEntityKey
//    let viewingifEntityKey

    for (let offset = startOffset; offset <= endOffset; offset++) {
      let entityKey = contentBlock.getEntityAt(offset)
      if (entityKey) {
        let type = contentState.getEntity(entityKey).getType()
        if (type === USER_LEGISLATION || type === USER_VARIABLE || type === USER_DOC) return false
        if (type in entityKeyMap && entityKey !== entityKeyMap[type]) return false
        entityKeyMap[type] = entityKey
/*
        if (type === USER_PLACEHOLDER) {
          if (placeHolderEntityKey && entityKey !== placeHolderEntityKey) return false
          placeHolderEntityKey = entityKey
        } else if (type === USER_VIEWINGIF) {
          if (viewingifEntityKey && entityKey !== viewingifEntityKey) return false
          viewingifEntityKey = entityKey
        }
*/
      }
    }

    return true
  }

  render() {
    const {theme, constructor} = this.props
    const {datatype} = this.state
    const currentTypeName = constructor.datatype.get(datatype).get('description')
    
    return (
      <div className={theme.buttonWrapper} onMouseDown={preventDefault}>
        <button className={theme.button} onClick={this.onClick} disabled={!this.active()} type="button" title="Пользовательские данные">
          <i className="fa fa-terminal"></i>
        </button>
        <Modal
          isActive={this.state.modalOpened}
          clickClose={this.breakDefault}
          title={'Наименование пропущенного текста'}
          buttons={[
            {label: 'Отменить', className: 'btn-secondary', handle: this.breakDefault},
            {label: 'Применить', disabled: !this.state.name.length, handle: this.accept}
          ]}
        >
          <textarea style={{width: '100%'}} value={this.state.name} onChange={this.handleChangeName}></textarea>

          <Dropdown
            label={currentTypeName}
            options={constructor.datatype.map(dt => {return {label: dt.get('description'), value: dt.get('name'), active: dt.get('name') === datatype}}).toList().toArray()}
            onSelect={this.selectDataType}
          />
        </Modal>
      </div>
    )
  }
}