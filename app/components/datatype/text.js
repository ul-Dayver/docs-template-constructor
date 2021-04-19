import React from 'react'
import {Editor, ContentState, EditorState} from 'draft-js'
import Abstract from './abstract'

const createValue = (value) => {
  const editorState = value && value.length || isFinite(value)
    ? EditorState.createWithContent(ContentState.createFromText(value+""))
    : EditorState.createEmpty()
  return {
    value: editorState.getCurrentContent().getPlainText(),
    editorState
  }
}

export default class TextField extends Abstract {
  constructor(props) {
    super(props)
    this.state = createValue(props.value || props.defaultValue)
    this.entity = {style: {height: '100%', width: null}}
    if (props.withcontainer) this.entity.style.minWidth = '160px'
    this.handlerChange = editorState => {

      let value = ''
      const content = editorState.getCurrentContent()
      if (content.hasText()) value = content.getPlainText()
      this.setState({editorState, value})

      const {onChange, name} = this.props
        if (onChange) onChange(name, value)
    }
    //height: 100% - Иначе не "резинится" по высоте
    this.getChildren = props => (
      <div className={props.className} onClick={this.focus} style={props.style}>
        <Editor
          ref={props.ref}
          ariaLabelledBy={props.id || props.name}
          editorState={this.state.editorState}
          onChange={props.onChange}
        />
      </div>
    )
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultValue !== undefined) return null
    return (props.value !== state.value) ? createValue(props.value) : null
  }

}