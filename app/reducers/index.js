const reducers = {
  templates: require('./templates'),
  account: require('./account'),
  view: require('./view'),
  directory: require('./directory'),
  documents: require('./documents')
}
function createReducer(key) {
  return function (state, action, rootState) {
    let reducer = reducers[key]
    if (state === void 0) state = reducer.defState()
    if (action.type in reducer) {
      state = reducer[action.type](state, action, rootState)
    }
    return state
  }
}

let ret = {}
Object.keys(reducers).forEach(key => ret[key] = createReducer(key))
module.exports = ret