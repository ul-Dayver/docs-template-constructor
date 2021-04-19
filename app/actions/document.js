import {DOCUMENTS_FETCH, DOCUMENTS_CHANGE, DOCUMENTS_DELETE} from '../constants'
import {RESTful} from '../components/common/serverRequest'

const url = '/document'

module.exports = {
  fetch: id => dispatch => RESTful.read(url, id)
    .then(documents => dispatch({type: DOCUMENTS_FETCH, documents})),
  save: (jsonData) => dispatch => (
      !!jsonData.uid
      ? RESTful.update(url, jsonData.uid, jsonData)
      : RESTful.create(url, jsonData)
    )
    .then(document => dispatch({type: DOCUMENTS_CHANGE, document})),
  delete: id => dispatch => RESTful.delete(url, id).then(() => dispatch({type: DOCUMENTS_DELETE, id})),
  create: document => ({type: DOCUMENTS_CHANGE, document})
}
