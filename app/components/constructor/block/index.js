import React from 'react'
import {Record} from 'immutable'
//import Variator from './variator/model'
import Text from './text/model'
import Table from './table/model'
import PageBreak from './pagebreak'
import PageOrientation from './pageorientation'
import {genKey} from 'draft-js'

const Components = {
  table: require('./table').default,
  text: require('./text').default
}

const Block = Record({type: 'text', state: null, id: null})

class ViewBlock extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = (state, mustBecomeBoundary) => {
      const {type, id} = this.props
      this.props.onChange(
        new Block({type, state, id}),
        mustBecomeBoundary
      )
    }
    this.handleDropBlock = () => {
      this.props.onRemove(this.props.id)
    }
    this.handleRemoveNext = () => {
      this.props.onRemoveNext(this.props.id)
    }
  }
  setFocus(toEnd) {
    this.refs.component.setFocus(toEnd)
  }
  
  render() {
    const {type, state, onFocus, pageNum, id, directory} = this.props
    const Component = Components[type]
    
    return <Component
      state={state}
      blockID={id}
      ref="component"
      onChange={this.handleChange.bind(this)}
      onFocus={(focus) => onFocus(focus, pageNum)}
      DropBlock={this.handleDropBlock}
      RemoveNext={this.handleRemoveNext}
      directory={directory}
    />
  }
}

export default (props) => {
  let defProps = {}
    
  if (!props || !props.state) {
    Object.assign(defProps, props || {}, {state: new Text()})
  } else {
    defProps = props
  }

  if (defProps.state instanceof Table) {
    defProps.type = 'table'
  } else if (defProps.state instanceof PageBreak) {
    defProps.type = 'pagebreak'
  } else if (defProps.state instanceof PageOrientation) {
    defProps.type = 'pageorientation'
  } else {
    delete defProps.type
  }

  if (!defProps.id) defProps.id = genKey()

  return new Block(defProps)
}

exports.ViewBlock = ViewBlock
exports.PageBreak = PageBreak
exports.PageOrientation = PageOrientation
exports.hasTextBlock = block => block.get('state') instanceof Text
exports.hasTableBlock = block => block.get('state') instanceof Table
exports.hasPageBreak = block => block.get('state') instanceof PageBreak
exports.hasPageOrientation = block => block.get('state') instanceof PageOrientation
exports.convertToRaw = block => {
  return {
    type: block.type,
    id: block.id,
    state: block.state.toRaw()
  }
}
exports.convertFromRaw = (block) => {
  let State = Text
  if (block.type === 'table') {
    State = Table
  } else if (block.type === 'pagebreak' ) {
    State = PageBreak
  } else if (block.type === 'pageorientation' ) {
    State = PageOrientation
  }

  return new Block({
    type: block.type,
    id: block.id,
    state: State.fromRaw(block.state)
  })
}