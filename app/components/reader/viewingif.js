import React from "react"

function where(condition) {
  let orStack = []
  let orIndex = condition.indexOf(0)
  
  while (orIndex > 0) {
    orStack.push(condition.slice(0, orIndex))
    condition = condition.slice(orIndex+1)
    orIndex = condition.indexOf(0)
  }
  
  if (orStack.length) {
    orStack.push(condition)
    let findTrue = orStack.findIndex(predicate => where.call(this, predicate))
    if (findTrue < 0) return false
  } else {
    let findFalse = condition.findIndex(predicate => {
      if (Array.isArray(predicate)) {
        return !where.call(this, predicate)
      } else if (typeof predicate === 'object') {
        return !(this.get(predicate.key) === predicate.value)
      }
    })
  
    if (findFalse >=0) return false
  }

  return true
}

export default class ViewingIf extends React.Component {
  isVisible (condition) {
    return where.call(this, condition)
  }

  render() {
    const {contentState, entityKey, children, questionnaire} = this.props
    let condition = contentState.getEntity(entityKey).getData().condition
    const show = condition ? this.isVisible.call(questionnaire, condition) : true

    return show ? <span className="bg-highlight" >{children}</span> : null
  }
}