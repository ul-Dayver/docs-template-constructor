import React from 'react'
import {RichUtils} from 'draft-js'
import unionClassNames from 'union-class-names'
import {preventDefault} from '../../../../layouts/Helpers'

export default (param) => {
  const {style, children} = param
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
      this.props.setEditorState(RichUtils.toggleInlineStyle(this.props.getEditorState(), style))
    }

    styleIsActive() {
      return this.props.getEditorState && this.props.getEditorState().getCurrentInlineStyle().has(style)
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.getEditorState && this._delayToggleStyle && this.props.getEditorState) {
        this.toggleStyle()
      }
    }

    render() {
      const {theme} = this.props
      const className = this.styleIsActive() ? unionClassNames(theme.button, theme.active) : theme.button;

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