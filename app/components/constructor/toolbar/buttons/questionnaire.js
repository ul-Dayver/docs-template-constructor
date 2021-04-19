import React from 'react'
import {genKey} from 'draft-js'

export default class QuestionnaireButton extends React.Component {
  handle() {
    this.props.constructor.createQuestionList({
      key: genKey(),
      description: '',
      children: []
    })
  }

  render() {
    const {theme} = this.props
    
    return (
      <div className={theme.buttonWrapper}>
        <button className={theme.button} onClick={this.handle.bind(this)}>
          <i className="fa fa-list-alt"></i>
        </button>
      </div>
    )
  }
}