import React from 'react'
import unionClassNames from 'union-class-names'
import { getSelectedBlocksMetadata, setBlockData } from 'draftjs-utils'
import {preventDefault} from '../../../../layouts/Helpers'

export default (param) => {
  const {alignment, children} = param
  return class createInlineStyle extends React.Component {
    constructor(props) {
      super(props)
      this._delayToggleStyle = false
    }

    toggleStyle(event) {
      !!event && event.preventDefault();
      this._delayToggleStyle = false
      if (!this.props.getEditorState) {
        this._delayToggleStyle = true
        return this.props.constructor.add()
      }

      let editorState = this.props.getEditorState()
      editorState = setBlockData(editorState, { 'text-align': alignment })
      this.props.setEditorState(editorState)
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.getEditorState && this._delayToggleStyle && this.props.getEditorState) {
        this.toggleStyle()
      }
    }

    styleIsActive() {
      const editorState = this.props.getEditorState()
      if (!editorState) return false
      return alignment === (getSelectedBlocksMetadata(editorState).get('text-align') || 'left')
    }

    render() {
      const {theme} = this.props
      const className = this.props.getEditorState && this.styleIsActive() ? unionClassNames(theme.button, theme.active) : theme.button;

      return (
        <div className={theme.buttonWrapper} onMouseDown={preventDefault}>
          <button className={className} onClick={this.toggleStyle.bind(this)}>
            {children}
          </button>
        </div>
      )
    }
  }
}