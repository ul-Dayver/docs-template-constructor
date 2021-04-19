import React from 'react'

function findBadPredicate(condition) {
  return condition.find(
    predicate => {
      if (Array.isArray(predicate)) {
        return findBadPredicate(predicate)
      } else if (typeof predicate == 'object' && predicate.value === null) {
        return true
      }
      return false
    }
  )
}

export default class Component extends React.Component {
  constructor (props) {
    super(props)
    this.handleContextMenu = this.handleContextMenu.bind(this)
  }

  handleContextMenu(event) {
    event.preventDefault()
    let toolBtn = document.getElementById('viewingif-tool-btn')
    if (!toolBtn.disabled) toolBtn.click()
    return false
  }

  render () {
    const {contentState, entityKey, children} = this.props
    const data = contentState.getEntity(entityKey).getData()
    this.hasBadPredicate = !data.condition || findBadPredicate(data.condition)

    return (<span title={this.hasBadPredicate && "Условие повреждено, проверьте!"} className={this.hasBadPredicate ? "alert-danger" : "bg-highlight"} onContextMenu={this.handleContextMenu}>{children}</span>)
  } 
}