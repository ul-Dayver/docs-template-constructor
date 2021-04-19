import React from 'react'
import Layout from './layout'
import Item from './item'
import Operand from './operand'

export default class Predicate extends React.Component {
  constructor(props) {
    super(props)
    this.handleClose = () => this.props.onChange(this.props.parentIndex, null)

    this.handleClickQuestionnaireItem = ({item}) => {
      const {condition, onChange, parentIndex} = this.props
      const predicate = {
        key: item.key,
        value: item.children ? item.children[0].key : true
      }
      let newCondition = condition || []
      if (newCondition.length) newCondition.push(1)
      newCondition.push(predicate)
      onChange(parentIndex, newCondition)
    }
    this.handleChangeByIndex = (index, value) => {
      let newCondition = [...this.props.condition]
      
      if (typeof value !== 'number' && !value) {
        if (index > 0) newCondition.splice(index-1,2)
        else if (index === 0 && newCondition.length > 2) newCondition.splice(index,2)
        else if (index === 0 && newCondition.length === 1) newCondition = []
      } else {
        newCondition.splice(index, 1, value)
      }
      
      this.props.onChange(this.props.parentIndex, newCondition.length ? newCondition : null)
    }
  }

  render () {
    const {condition, addOptions, questionnaire, parentIndex} = this.props

    return (
      <Layout onClose={this.handleClose} onAddCondition={this.handleClickQuestionnaireItem} addOptions={addOptions} root={!(parentIndex >=0)}>
        {
          condition && (
            condition.map(
              (props, i) => {
                if (typeof props === 'number') return (<Operand key={i} value={!!props} index={i} onChange={this.handleChangeByIndex} />)
                if (Array.isArray(props)) {
                  return <Predicate key={i} parentIndex={i} condition={props} questionnaire={questionnaire} addOptions={addOptions} onChange={this.handleChangeByIndex}/>
                } else if (typeof props === 'object') {
                  const original = questionnaire.find(item => item.key === props.key)
                  if (!original) return null
                  return (
                    <Item
                      key={i}
                      index={i}
                      data={props}
                      description={original.description}
                      variants={original.children}
                      addOptions={addOptions}
                      onChange={this.handleChangeByIndex}
                    />
                  )
                }
              }
            )
          )
        }
      </Layout>
    )
  }
}