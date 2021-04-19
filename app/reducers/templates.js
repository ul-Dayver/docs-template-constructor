import { TEMPLATES_FETCH, TEMPLATE_SAVE,TEMPLATE_PATCH, TEMPLATE_FETCH_DATA, TEMPLATE_CREATE, TEMPLATE_CHANGE, TEMPLATE_DELETE} from '../constants'
import Document from '../components/constructor/document'
import {Map, List} from 'immutable'

exports.defState = () => Map()
exports[TEMPLATE_CREATE] = (state, action) => state.set('', 
  Map(
    Object.assign(
      {name: 'Новый шаблон', sync: false, metadata: null, questionnaire: null, version: null, document: Document.createEmpty()},
      action.dataJSON || {}
    )
  )
)

exports[TEMPLATES_FETCH] = (state, action) => {
  state = Map()
  List(action.data).forEach(val => {
    let data = Map(Object.assign(val, {sync: false}))
    state = state.set(val.uid, data)
  })
  return state
}

exports[TEMPLATE_PATCH] = (state, action) => state.update(action.id, template => Map(Object.assign({}, template.toJSON(), {sync: true})))

exports[TEMPLATE_FETCH_DATA] = exports[TEMPLATE_SAVE] = (state, action) => {
  const data = Object.assign({},action.data, {
    sync: true,
    document: action.data.metadata ? Document.createWithMeta(action.data.metadata) : Document.createEmpty()
  })
  return state.set(action.id, Map(data))
}

exports[TEMPLATE_CHANGE] = (state, action) => {
  const {id,dataJSON} = action
  const {document, metadata} = dataJSON
  let rewrite = {sync: false}
  if (!!document && document instanceof Document) {
    rewrite.metadata = document.getMeta()
  } else if (!!metadata) {
    rewrite.document = Document.createWithMeta(metadata)
  }
  
  return state.update(id, template => Map(Object.assign({}, template.toJSON(), dataJSON, rewrite)))
}

exports[TEMPLATE_DELETE] = (state, action) => state.delete(action.id || '')