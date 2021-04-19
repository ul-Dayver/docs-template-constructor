import thunkMiddleware from 'redux-thunk';
//import {createLogger} from 'redux-logger';

//import {templates} from '../reducers'
import { createStore, combineReducers, applyMiddleware } from 'redux';

const store = createStore(
  combineReducers(require('../reducers')),
  applyMiddleware(thunkMiddleware/*, createLogger({
    predicate: (getState, action) => action.type === 'APP_LOADING_BLOCK' || action.type === 'APP_LOADING_UNBLOCK'
  })*/)
)

export default store