import React from 'react'
import Predicate from './predicate'

export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.dropDownOptions = props.questionnaire.map(item => {return {label: item.description || 'Укажите вариант', item}})
    this.handleChange = (i, condition) => this.props.onChange(condition)
  }

  render(){
    return (<Predicate condition={this.props.condition} questionnaire={this.props.questionnaire} addOptions={this.dropDownOptions} onChange={this.handleChange}/>)
  }
}