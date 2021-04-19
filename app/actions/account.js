import { SET_ACCOUNT, AUTH} from '../constants'
import serverRequest from '../components/common/serverRequest'

module.exports = {
  auth: user => dispatch => dispatch(() => ({type: AUTH, user: user})),
  init: () => dispatch => serverRequest({
    url: '/account',
    dataType: 'json',
    success: account => dispatch({type: SET_ACCOUNT, account})
  })
}