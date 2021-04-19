import React from 'react'
import TextModel from './model'
import Editor from '../editor'

export default class Text extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = (editorState, mustBecomeBoundary) => {
      this.props.onChange(new TextModel(editorState), mustBecomeBoundary)
    }
    this.handleKeyDown = e => {
      if (e.keyCode == 46) {
        if (!this.props.state.getEditorState().getCurrentContent().hasText()) this.props.DropBlock()
        else {
          let selection = this.props.state.getEditorState().getSelection()
          let lastContentBlock = this.props.state.getEditorState().getCurrentContent().getBlockMap().last()
          if (selection.isCollapsed() && lastContentBlock.get('key') == selection.getAnchorKey()) {
            this.props.RemoveNext()
          }
        }
      }
    }
    this.hanldeFocus = e => this.props.onFocus(Object.assign(e,{blockID: this.props.blockID}))
  }
  setFocus(toEnd) {
    this.refs.editor.handleFocus(toEnd)
  }

  render() {
    return (
      <Editor 
        ref='editor'
        editorState={this.props.state.getEditorState()}
        onChange={this.handleChange}
        onFocus={this.hanldeFocus}
        onKeyDown={this.handleKeyDown}
      />
    )
  }
}