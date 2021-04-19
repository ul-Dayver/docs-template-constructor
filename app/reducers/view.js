import {
  VIEW_BOOTSTRAP, VIEW_LOCK_FROM_WAIT_SERVER, VIEW_UNLOCK_FROM_WAIT_SERVER, VIEW_CLOSE_MESSAGE,VIEW_EXIT_ERROR,
  AUTH, NOTAUTH, ERROR_REQUEST
} from '../constants'
import { cookie } from '../components/layouts/Helpers'
import {Map} from 'immutable'

const assign = (state, newState) => Object.assign({}, state, newState)
const show = {notice: null, alert: null}
exports.defState = () => {
  return {
    title: "",
    loading: false,
    loadingQueue: Map(),
    show: {...show},
    cookie: cookie(),
    lostPathName: null,
    bootstrapped: false,
    error_status: 0,
    error: null
  }
}
exports[VIEW_BOOTSTRAP] = state => assign(state, {bootstrapped: true})
exports[AUTH] = state => assign(state, {lostPathName: null})
exports[NOTAUTH] = state => {
  let retState = {loading: false, loadingQueue: Map()}
  if (!state.lostPathName) retState.lostPathName = location.hash.replace('#','').replace(/^\/+|\/+$/g,'')
  return assign(state, retState)
}
exports[VIEW_LOCK_FROM_WAIT_SERVER] = (state, action) => assign(state, {loading: true, loadingQueue: state.loadingQueue.set(action.name, 1)})
exports[VIEW_UNLOCK_FROM_WAIT_SERVER] = (state, action) => {
  let loadingQueue = state.loadingQueue.delete(action.name)
  return assign(state, {loading: !!loadingQueue.size, loadingQueue})
}
exports[ERROR_REQUEST] = (state, action) => {
  let ret = assign(state, {loading: false, loadingQueue: Map()})
  if (action.message) ret.show = action.message
  else if (action.error){
    ret.error_status = action.status
    ret.error = action.error
  } if (action.notice) {
    ret.show.notice = action.notice
  }
  return ret
}
exports[VIEW_CLOSE_MESSAGE] = state => assign(state, {...show})
exports[VIEW_EXIT_ERROR] = state => assign(state, {error: null, error_status: 0})