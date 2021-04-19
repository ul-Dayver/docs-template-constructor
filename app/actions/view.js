import {VIEW_LOCK_FROM_WAIT_SERVER, VIEW_UNLOCK_FROM_WAIT_SERVER, VIEW_CLOSE_MESSAGE, VIEW_EXIT_ERROR, ERROR_REQUEST, ERROR_404} from '../constants'

module.exports = {
  lockView: name => (dispatch) => {dispatch({type: VIEW_LOCK_FROM_WAIT_SERVER, name})},
  unlockView: name => (dispatch) => {dispatch({type: VIEW_UNLOCK_FROM_WAIT_SERVER, name})},
  closeMessage: ({type: VIEW_CLOSE_MESSAGE}),
  pageNotFound: ({type: ERROR_REQUEST, status: ERROR_404, error: true}),
  exitError: ({type: VIEW_EXIT_ERROR})
}