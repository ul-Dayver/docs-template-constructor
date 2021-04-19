const serverRequest = require('./serverRequest')
module.exports = {
  Modal: require('./modal').default,
  AlertMessage: require('./alert').default,
  IboxTools: require('./IboxTools'),
  WaitSpinner: require('./waitSpinner').default,
  serverRequest: serverRequest.default,
  RESTful: serverRequest.RESTful,
  simpleAJAX: serverRequest.simpleAJAX,
  sendForm: serverRequest.sendForm,
  downloadDocument: serverRequest.downloadDocument,
  Dropdown: require('./dropdown').default,
  Switch: require('./switch').default,
  Popover: require('./popover').default,
  DateTime: require('./datetime').default,
  HtmlToImage: require('./htmltoimg').default,
  JSONDiff: require('./jsondiff').default,
  ComponentSpinner: require('./componentSpinner').default
}