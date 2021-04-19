import { connect } from 'react-redux'
import { templates, account, view, directory, document } from '../actions';
import {AUTH, VIEW_BOOTSTRAP} from '../constants'
import {createRequestWrap} from './requestwrap'

const requestWrap = createRequestWrap(view)
const bootstrapQueue = [account.init(), directory.datatypes()/*, templates.fetch() , document.fetch()*/]

function mergeProps (stateProps, dispatchProps, routesProps) {
  const { dispatch } = dispatchProps
//console.log(stateProps)
  return Object.assign({},stateProps, routesProps, {
    view: Object.assign({}, view, stateProps.view, {
      bootstrap: () => {
        requestWrap(dispatch,
          bootstrapQueue,
          'bootstrap',
          () => dispatch({type: VIEW_BOOTSTRAP})
        )
      },
      lockView: name => view.lockView(name)(dispatch),
      unlockView: name => view.unlockView(name)(dispatch),
      closeMessage: () => dispatch(view.closeMessage),
      exitError: () => dispatch(view.exitError),
      pageNotFound: () => dispatch(view.pageNotFound)
    }),
    account: {
      state: stateProps.account,
      isAuth: () => stateProps.account.status === AUTH,
      login: (user) => {
        requestWrap(dispatch, account.auth(user), 'login', 
          () => requestWrap(dispatch, bootstrapQueue, 'bootstrap')
        )
      }
    },
    templates: {
      Collection: stateProps.templates,
      fetch: (id, cb) => requestWrap(dispatch, templates.fetch(id), 'template_fetch', cb),
      save: (dataJSON, cb) => requestWrap(dispatch, templates.save(dataJSON), 'template_save', cb),
      delete: (templateUid) => requestWrap(dispatch, templates.delete(templateUid), 'template_delete'),
      create: (dataJSON) => dispatch(templates.create(dataJSON)),
      change: (id, jsonData) => dispatch(templates.change(id, jsonData)),
      patch: (id, jsonData) => requestWrap(dispatch, templates.patch(id, jsonData))
    },
    documents: {
      Collection: stateProps.documents,
      fetch: (id, cb) => requestWrap(dispatch, document.fetch(id), 'document_fetch', cb),
      save: (dataJSON, cb) => requestWrap(dispatch, document.save(dataJSON), 'document_save', cb),
      delete: id => requestWrap(dispatch, document.delete(id), 'document_delete'),
      create: jsonData => dispatch(document.create(jsonData))
    }
  })
}

export default connect((state) => Object.assign({}, state), null, mergeProps)