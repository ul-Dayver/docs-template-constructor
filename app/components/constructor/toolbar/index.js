import React from 'react'
import { Separator } from 'draft-js-static-toolbar-plugin'
import Buttons from './buttons'

const toolbarConfig = {
  theme: {
    toolbarStyles: {toolbar: "draftJsToolbar__toolbar__static"},
    buttonStyles: {
      buttonWrapper: "draftJsToolbar__buttonWrapper m-1",
      button: "btn btn-white border-0",
      active: "active"
    }
  },
  structure: [
    Buttons.undo,
    Separator,
    Buttons.table,
    Separator,
    Buttons.BoldButton,
    Buttons.ItalicButton,
    Buttons.UnderlineButton,
    Separator,
    Buttons.HeadlinesButton,
    Buttons.UnorderedListButton,
    Buttons.OrderedListButton,
    Buttons.AlignBlockLeftButton,
    Buttons.AlignBlockCenterButton,
    Buttons.AlignBlockRightButton,
    Buttons.AlignBlockJustifyButton,
    Separator,
    Buttons.PageOrientation,
    Buttons.PageBreak,
    Separator,
    Buttons.UserPlaceHolderButton,
    Buttons.UserViewingIf
  ]
}

export default class Toolbar extends React.Component{
  render() {
    const {getEditorState, setEditorState, constructor, blockID} = this.props
    const childProps = {
      theme: toolbarConfig.theme.buttonStyles,
      getEditorState,
      setEditorState,
      blockID,
      constructor
    }
    return (
      <div className={toolbarConfig.theme.toolbarStyles.toolbar}>
        {
          toolbarConfig.structure.map(
            (Element, index) => <Element key={index} {...childProps}/>
          )
        }
      </div>
    )
  }
}
