import { TEMPLATE_DELETE, TEMPLATE_SAVE, TEMPLATE_PATCH, TEMPLATES_FETCH, TEMPLATE_FETCH_DATA, TEMPLATE_CREATE, TEMPLATE_CHANGE } from '../constants'
import {RESTful} from '../components/common/serverRequest'

const url = '/template'

module.exports = {
  create: dataJSON => ({type: TEMPLATE_CREATE, dataJSON}),
  change: (id, dataJSON) => ({type: TEMPLATE_CHANGE, id, dataJSON}),
  fetch: (id) => (dispatch) => RESTful.read(url, id)
    .then(data => dispatch(id ? { type: TEMPLATE_FETCH_DATA, id, data} :{ type: TEMPLATES_FETCH, data})),
  save: (jsonData) => (dispatch) => (
      !!jsonData.uid
      ? RESTful.update(url, jsonData.uid, jsonData)
      : RESTful.create(url, jsonData)
    )
    .then(data => dispatch({type: TEMPLATE_SAVE, id: data.uid, data})),
  delete: (templateUid) => (dispatch) => !!templateUid
  ? RESTful.delete(url, templateUid)
    .then(() => dispatch({type: TEMPLATE_DELETE, id: templateUid}))
  : Promise.resolve(dispatch({type: TEMPLATE_DELETE, id: templateUid})),
  patch: (id, jsonData) => (dispatch) => RESTful.patch(url, id, jsonData)
    .then(() => dispatch({type: TEMPLATE_PATCH, id}))
}
