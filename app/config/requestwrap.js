const requestError = require('../components/common/serverRequest').requestError

exports.createRequestWrap = function (view) {
  return function(dispatch, action, name, cb) {
    !!name && view.lockView(name)(dispatch)
    const queue = Array.isArray(action) ? Promise.all(action.map(dispatch)) : dispatch(action)
    queue.then((r) => {
      !!name && view.unlockView(name)(dispatch)
      !!cb && cb(r)
    })
    .catch(error => {
      let res = requestError(error)
      if (res.body) res.body.then(error => dispatch(Object.assign({},res,{error})))
      else dispatch(res)
    })
  }
}