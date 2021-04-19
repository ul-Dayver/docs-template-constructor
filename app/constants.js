export const BASE_PATH = process.env.NODE_ENV == 'production' ? '' : '/api';

export const ERROR_REQUEST = 'ERROR_REQUEST'
export const ERROR_403 = 403
export const ERROR_404 = 404
export const ERROR_401 = 401
export const ERROR_504 = 504
export const HTTP_200 = 200

export const NOTAUTH = 'NOTAUTH'
export const AUTH = 'AUTH'

export const VIEW_LOCK_FROM_WAIT_SERVER = 'VIEW_LOCK_FROM_WAIT_SERVER'
export const VIEW_UNLOCK_FROM_WAIT_SERVER = 'VIEW_UNLOCK_FROM_WAIT_SERVER'
export const VIEW_BOOTSTRAP = 'VIEW_BOOTSTRAP'
export const VIEW_CLOSE_MESSAGE = 'VIEW_CLOSE_MESSAGE'
export const VIEW_EXIT_ERROR = 'VIEW_EXIT_ERROR'

export const SET_ACCOUNT = 'SET_ACCOUNT'

export const TEMPLATES_FETCH = 'TEMPLATES_FETCH'
export const TEMPLATE_FETCH_DATA = 'TEMPLATE_FETCH_DATA'
export const TEMPLATE_SAVE = 'TEMPLATE_SAVE'
export const TEMPLATE_PATCH = 'TEMPLATE_PATCH'
export const TEMPLATE_DELETE = 'TEMPLATE_DELETE'
export const TEMPLATE_CREATE = 'TEMPLATE_CREATE'
export const TEMPLATE_CHANGE = 'TEMPLATE_CHANGE'

export const DOCUMENTS_FETCH = 'DOCUMENTS_FETCH'
export const DOCUMENTS_CHANGE = 'DOCUMENTS_CHANGE'
export const DOCUMENTS_DELETE = 'DOCUMENTS_DELETE'

export const DIRECTORY_DATATYPE = 'DIRECTORY_DATATYPE'

export const USER_PLACEHOLDER = 'USER_PLACEHOLDER'
export const USER_VIEWINGIF = 'USER_VIEWINGIF'
export const USER_VARIABLE = 'VARIABLE'
export const USER_LEGISLATION = 'LEGISLATION'
export const USER_DOC = 'DOC'

export const DATETIME_FORMATS = {
  date: 'DD.MM.YYYY',
  time: 'HH:mm',
  datetime: 'DD.MM.YYYY HH:mm'
}