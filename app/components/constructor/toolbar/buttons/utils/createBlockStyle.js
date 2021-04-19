import React from 'react'
import {RichUtils} from 'draft-js'
import unionClassNames from 'union-class-names'
import {preventDefault} from '../../../../layouts/Helpers'

export default (param) => {
  const {blockType, children, noWrap} = param
  return class createBlockStyle extends React.Component {
    constructor(props) {
      super(props)
      this._delayToggleStyle = false

      this.toggleStyle = (event) => {
        !!event && event.preventDefault();
        this._delayToggleStyle = false
        if (!this.props.getEditorState) {
          this._delayToggleStyle = true
          return this.props.constructor.add()
        }
        this.props.setEditorState(
          RichUtils.toggleBlockType(this.props.getEditorState(), blockType)
        )
      }
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.getEditorState && this._delayToggleStyle && this.props.getEditorState) {
        this.toggleStyle()
      }
    }

    blockTypeIsActive() {
      if (!this.props.getEditorState) {
        return false
      }

      var editorState = this.props.getEditorState()
      var type = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType()
      return type === blockType;
    }

    render() {
      const {theme} = this.props
      let cls = theme.button
      if (this.blockTypeIsActive()) cls = unionClassNames(cls, theme.active)

      return noWrap
        ? (<button className={cls} onClick={this.toggleStyle} type="button">{children}</button>)
        : (
          <div className={theme.buttonWrapper} onMouseDown={preventDefault}>
            <button className={cls} onClick={this.toggleStyle} type="button">
              {children}
            </button>
          </div>
        )
    }
  }
}