import {
  DOCUMENTS_FETCH,
  DOCUMENTS_CHANGE,
  DOCUMENTS_DELETE
} from '../constants'
import {Map} from 'immutable'

exports.defState = () => Map()
exports[DOCUMENTS_FETCH] = (state, action) => {
  action.documents.forEach(doc => state = state.set(doc.uid, doc))
  return state
}
exports[DOCUMENTS_CHANGE] = (state, action) => state.update(action.document.uid, document => Object.assign({}, document, action.document))
exports[DOCUMENTS_DELETE] = (state, action) => state.delete(action.id)