import {Map} from 'immutable'
import {
  SET_ACCOUNT,
  AUTH,
  NOTAUTH
} from '../constants'

exports.defState = () => {
  return {
    id: null,
    username: null,
    userphone: null,
    status: NOTAUTH,
    roles: Map()
  }
}

exports[SET_ACCOUNT] = (state, action) => Object.assign({}, state, action.account, {
  status: action.account.id ? AUTH : NOTAUTH,
  roles: Map(!!action.account.roles && action.account.roles.map(role => [role,!0]))
})

exports[NOTAUTH] = state => Object.assign({}, state, {status: NOTAUTH})
exports[AUTH] = state => Object.assign({}, state, {status: AUTH, username: action.user})
