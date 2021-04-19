import React from 'react'
import {CompositeDecorator} from 'draft-js'
import Viewingif from './viewingif/decorcomponent'
import {USER_PLACEHOLDER, USER_VIEWINGIF, USER_LEGISLATION, USER_VARIABLE, USER_DOC} from '../../../../constants'

const strategyByType = (type) => (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (entityKey !== null && contentState.getEntity(entityKey).getType() == type) 
    },
    callback
  )
}

const strategy = {
  placeHolder: strategyByType(USER_PLACEHOLDER),
  viewingif: strategyByType(USER_VIEWINGIF),
  variable: strategyByType(USER_VARIABLE),
  legislation: strategyByType(USER_LEGISLATION),
  doc: strategyByType(USER_DOC)
}

const createComponent = function(viewConcept) {
  return ({contentState, entityKey, children}) => {
    let view = viewConcept({children})
    const data = contentState.getEntity(entityKey).getData()
    if (data.condition !== null && data.condition !== undefined) {
      return <Viewingif contentState={contentState} entityKey={entityKey}>{view}</Viewingif>
    }
    return view
  }
}

export default new CompositeDecorator([
  {
    strategy: strategy.placeHolder,
    component: createComponent(({children}) => (<span className="text-primary">{children}</span>))
  },
  {
    strategy: strategy.variable,
    component: createComponent(({children}) => (<small className="bg-warning text-dark rounded px-2 py-1">{children}</small>))
  },
  {
    strategy: strategy.legislation,
    component: createComponent(({children}) => (<span className="bg-dark text-white rounded px-2 py-1">{children}</span>))
  },
  {
    strategy: strategy.doc,
    component: createComponent(({children}) => (<span className="bg-dark text-white rounded px-2 py-1">{children}</span>))
  },
  {
    strategy: strategy.viewingif,
    component: Viewingif
  }
])

exports.strategy = strategy