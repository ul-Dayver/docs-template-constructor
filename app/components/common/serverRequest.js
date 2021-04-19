import { BASE_PATH, HTTP_200, ERROR_403, ERROR_401, ERROR_REQUEST} from '../../constants'
import fetch from 'isomorphic-fetch'

const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'
const PATCH = 'PATCH'

const handler = response => response.status !== HTTP_200 ? Promise.reject(response) : getResponse(response)
const getResponse = response => response.headers.get('Content-Type').indexOf('text') >= 0 ? response.text() : response.json()

exports.requestError = (error) => {
  let status = error.status ? error.status : 0
  if (process.env.NODE_ENV !== 'production' && !(status === ERROR_401 || status === ERROR_403))
    console.log(error)
  let ret = {type: ERROR_REQUEST, status}
  switch(status) {
    case HTTP_200: 
    case ERROR_401:
    case ERROR_403:
      ret.body = getResponse(error)
      break;
    default:
      ret.message = error
      break;
  }
  
  return ret
}

const parser = response => response.success === true && response.data ? Promise.resolve(response.data) : Promise.reject(response);
const restReq = (url, method, jsonData) => request({
  url: url,
  method: method || GET,
  body: jsonData || null,
  dataType: 'json',
  success: parser
});
const concatenateUrl = (url, id) => id ? url + (url.charAt(url.length - 1) === '/' ? '' : '/') + encodeURIComponent(id) : url;

const prepareParams = function(params) {
  if (params.dataType) {
    switch (params.dataType.toLowerCase()) {
      case 'json':
        params.headers = {'Accept': 'application/json','Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'}
        break;
      default: 
        break;
    }
    delete params.dataType
  }
  
  params = Object.assign({
    url: "",
    success: (res) => Promise.resolve(res),
    method: GET,
    credentials: "same-origin"
    //credentials: 'include'
  }, params);
  params.url = BASE_PATH + '/' + params.url.replace(/^\/+|\/+$/g,'');

  if (params.body && typeof params.body === 'object' && !(params.body instanceof FormData)) {
    switch (params.method) {
      case POST:
      case PUT:
      case PATCH:
        params.body = JSON.stringify(params.body)
        break;
      case GET:
      case DELETE:
      default:
        let searchParams = new URLSearchParams();
        for (let keyParamsBody in params.body) {
          if (params.body.hasOwnProperty(keyParamsBody)) {
            searchParams.append(keyParamsBody, params.body[keyParamsBody]);
          }
        }
        params.url += '?' + searchParams.toString()
        delete params.body
        break;
    }
  } else if (params.body instanceof FormData && params.body.fake) {
    params.body = params.body.toString();
    if (!params.headers) params.headers = {}
    params.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  } else if ('body' in params && !params.body) {
    delete params.body
  }

  return params;
}

const request = function (params) {
  params = prepareParams(params)
  let url = params.url;
  delete params.url;

  return fetch(url, params)
    .then(response => handler(response))
    .then(res => params.success(res) || Promise.resolve(HTTP_200))
}

exports.RESTful = {
  update : (url, id, jsonData) => restReq(concatenateUrl(url, id), PUT, jsonData),
  create : (url, jsonData) => restReq(concatenateUrl(url), POST, jsonData),
  read : (url, id) => restReq(concatenateUrl(url, id)),
  delete : (url, id) => restReq(concatenateUrl(url, id), DELETE),
  patch : (url, id, jsonData) => restReq(concatenateUrl(url, id), PATCH, jsonData)
}

export default request

function getAJAX(){
	
	if (window.XMLHttpRequest) {
		try {
			return new window.XMLHttpRequest();
		} catch(e) {}
	}
	
	if (window.ActiveXObject) {
		
		try {
			return new window.ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {}
		
		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {}
	}
	
	return null;
}

function convertJSONData(data, prefix){
	let ret = []
	for (var name in data) {
		var value = data[name],
			key = prefix ? prefix + '[' + name + ']' : name,
			type = typeof(value)
		;
		
		if (type === 'object' || type === 'function' && !!value) {
			ret = ret.concat(convertJSONData(value, key))
		} else {
			ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(value === null ? "" : value));
		}
  }
  return ret
}

function onLoad(onSuccess, onError) {
  return function() {
    if (this.readyState == 4 && !this.aborted) {
      var data = this.responseText;
      
      if (this.status != HTTP_200 && onError) onError(this)

      try {
          data = JSON.parse(data);
      } catch (exc) {
        if (onError) onError(this, exc)
      }
      if (onSuccess) {
        onSuccess(data, this);
      }
    }
  }
}

exports.sendForm = (form, success, error) => {
  let {action, method} = form
  let body = new FormData(form)
  const xhr = getAJAX()
  if (xhr) {
    xhr.open(method, action, true);
    !!success && (xhr.onreadystatechange = onLoad(success, error).bind(xhr))
    xhr.setRequestHeader('Accept', '*/*');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.aborted = false
    xhr.send(body);
  }
}
exports.simpleAJAX = function (props) {
  var url = props.url,
  type = props.method || GET,
  sendData = props.data || {},
  xhr = getAJAX(),
  sd = type === GET ? convertJSONData(sendData).join("&").replace(/%20/g,"+") : sendData
  
  if (xhr) {
    xhr.open(type, url + (type === GET ? '?'+sd : ''), true);
    xhr.onreadystatechange = onLoad(props.success, props.error).bind(xhr)
    xhr.setRequestHeader('Accept', '*/*');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.aborted = false
    xhr.send(type !== GET ? sd : null);
    return {
      abort: () => {
        xhr.aborted = true
        xhr.abort()
      }
    }
  }
  return null
}