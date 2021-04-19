import React from 'react'
import {Editor, EditorState, CompositeDecorator} from 'draft-js'
import blockStyleFn from "../constructor/block/editor/blockStyleFn"
import Placeholder from "./placeholder"
import Viewingif from "./viewingif"
import {strategy} from '../constructor/block/editor/decorator'

const initEditorState = ({state, questionnaire, onChangePlaceholder, placeholders, id, datatype}) => EditorState.set(state.getEditorState(), {
  allowUndo: false,
  decorator: new CompositeDecorator([
    {strategy: strategy.placeHolder, component: Placeholder, props: {onChangePlaceholder, placeholders, id, datatype, questionnaire}},
    {strategy: strategy.viewingif, component: Viewingif, props: {questionnaire}}
  ])
})

export default class Text extends React.Component {
  constructor(props) {
    super(props)
    this.editorState = initEditorState(props)
  }

  shouldComponentUpdate(nextProps) {
    const newContent = nextProps.state.getEditorState().getCurrentContent()
    const currentContent = this.props.state.getEditorState().getCurrentContent()
    if (
      newContent !== currentContent || 
      !nextProps.questionnaire.equals(this.props.questionnaire) ||
      !nextProps.placeholders.equals(this.props.placeholders)
    ) {
      this.editorState = initEditorState(nextProps)
      return true
    }
    return false
  }

  render() {
    return (
      <Editor
        blockStyleFn={blockStyleFn}
        editorState={this.editorState}
        readOnly
      />
    )
  }
}