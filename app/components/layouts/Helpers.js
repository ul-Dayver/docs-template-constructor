export const documentBody = (document.body || document.getElementsByTagName('body')[0])
export function correctHeight() {
    let windowHeight = getWindowHeight(),
      pageWrapper = document.getElementById('page-wrapper'),
      navs = document.getElementsByTagName('nav'),
      navbarHeigh = 0,
      wrapperHeigh = pageWrapper.offsetHeight

    for (let i=0; i< navs.length; i++) {
      if (navs[i].className.indexOf('navbar-default') >= 0) {
        navbarHeigh = navs[i].offsetHeight
        break;
      }
    }

    if (navbarHeigh > wrapperHeigh) {
        //pageWrapper.css("min-height", navbarHeigh + "px");
      pageWrapper.style.minHeight = navbarHeigh + "px"
    } else {
        if (navbarHeigh < windowHeight) {
            //pageWrapper.css("min-height", $(window).height() + "px");
            pageWrapper.style.minHeight = windowHeight + "px"
        } else {
            pageWrapper.style.minHeight = navbarHeigh + "px"
            //pageWrapper.css("min-height", navbarHeigh + "px");
        }
    }

    //if ($('body').hasClass('fixed-nav')) {
      if (documentBody.className.indexOf('fixed-nav') >= 0) {
        if (navbarHeigh > wrapperHeigh) {
            //pageWrapper.css("min-height", navbarHeigh + "px");
          pageWrapper.style.minHeight = navbarHeigh + "px"
        } else {
          pageWrapper.style.minHeight = windowHeight + "px"
            //pageWrapper.css("min-height", $(window).height() - 60 + "px");
        }
    }
}

export function detectBody() {
    if (getWindowWidth() < 769) {
      documentBody.className += (documentBody.className.lengh ? ' ' : '') + 'body-small'
        //$('body').addClass('body-small')
    } else {
      documentBody.className = documentBody.className.replace('body-small','').trim()
        //$('body').removeClass('body-small')
    }
}

export function smoothlyMenu() {
  let sideMenu = document.getElementById('side-menu')
    if (!(documentBody.className.indexOf('mini-navbar') >= 0) || (documentBody.className.indexOf('body-small') >= 0)) {
        // Hide menu in order to smoothly turn on when maximize menu
        //$('#side-menu').hide();
        if (!sideMenu.className.indexOf('hidden')) sideMenu.className += ' hidden'
        // For smoothly turn on menu
        //setTimeout(() => $('#side-menu').fadeIn(400), 200);
    } else if (documentBody.className.indexOf('fixed-sidebar') >= 0) {
        //$('#side-menu').hide();
        if (!sideMenu.className.indexOf('hidden')) sideMenu.className += ' hidden'
        //setTimeout(() => $('#side-menu').fadeIn(400), 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        removeAttribute(sideMenu, 'style')
        //$('#side-menu').removeAttr('style');
    }
}

export function extend(obj) {
	var sources = Array.prototype.slice.call(arguments, 1);
	if (sources.length) {
		for(var i=0; i<sources.length;i++) {
			for(var key in sources[i]) {
				obj[key] = sources[i][key];
			}
		}
	}
	
	return obj;
}

export function addEvent(element, type, handler) {
	if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler)
    } else {
      element["on" + type] = handler
    }
}

export function removeEvent (element, type, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(type, handler, false);
	} else if (element.detachEvent) {
		element.detachEvent("on" + type, handler);
	} else {
		element["on" + type] = null;
	}
}

const getOffsetRect = function(element) {
  let
    box = element.getBoundingClientRect(),
    body = document.body,
	docElem = document.documentElement,
	scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
	scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
	clientTop = docElem.clientTop || body.clientTop || 0,
	clientLeft = docElem.clientLeft || body.clientLeft || 0,
	top  = box.top +  scrollTop - clientTop,
	left = box.left + scrollLeft - clientLeft;
  return { top: Math.round(top), left: Math.round(left) };
}
const getOffsetSum = function(el) {
  if(!el) return {left:0, top:0};		
  let SL = 0, ST = 0,
  is_div = /^div$/i.test(el.tagName)
  
  if (is_div && el.scrollLeft) SL = el.scrollLeft;
  if (is_div && el.scrollTop) ST = el.scrollTop;
  let r = { left: el.offsetLeft - SL, top: el.offsetTop - ST }
  
  if (el.offsetParent) {
    let tmp = getOffsetSum(el.offsetParent);
	r.left += tmp.left;
	r.top += tmp.top;
  }
  return r;
}

export function Offset (element) {
  return element.getBoundingClientRect ? getOffsetRect(element) : getOffsetSum(element)
}

export function cookie () {
  const sec = 1000;
  const cookies = {};
  const load = function(){
	let c = document.cookie.split(';');
		
	for(let i=0; i<c.length; i++){
		let item = c[i].trim();
		if (item.indexOf('=') !== false ){
		  item = item.split('=');
		  cookies[item[0]] = item[1];
		  item = null;
		}
	}
  }

  return {
    get: function(name, noload){
		if (!name) return cookies;
		
		if (cookies[name]) return cookies[name];
			
		if (!noload){
			load();
		}else{
			return null;
		}
		
		return this.get(name,1);
	},
	set: function(prop){
		let name = prop.name,
			value = prop.value || '',
			data = []
		;
		if (!name) return;
		cookies[name] = value;
		
		data.push(name+'='+value);
		
		for(let key in prop){
			if(!(key in {'name':1, 'value':1})){
				let val = key === 'expires' ? new Date( new Date().getTime() + prop[key] ) : prop[key];
				data.push(key+'='+val);
			}
		}

		document.cookie = data.join('; ');
	},
	clear: function(name, path){
	  let data = [];
		if (!name) return;
		data.push(name+'=');
		
		if (path) {
			data.push('path='+path);
		}
			
		data.push('expires=-1');
		document.cookie = data.join('; ');
	},
	seconds: function(count){
		return (count || 1) * sec;
	},
	minutes: function(count){
		return (count || 1) * this.seconds(60);
	},
	hours: function(count){
		return (count || 1) * this.minutes(60);
	},
	days: function(count){
		return (count || 1) * this.hours(24);
	}
  };
}

export function getAttr(obj,name){
  let attr = void(0);
	
  if (obj.hasAttribute && obj.hasAttribute(name)){
	attr = obj.getAttribute(name);
  }else if (typeof(obj[name]) != 'undefined'){
    attr = obj[name];
  }
  return attr;
}

const toArray = (list) => Array.prototype.slice.call(list, 0)
const isArray = (arr) => Object.prototype.toString.call(arr) === '[object Array]'

exports.toArray = toArray
exports.isArray = isArray

const setAttribute = function (node, name, value){
  if (node.setAttribute) {
	  node.setAttribute(name, value)
  } else {
	  let attr = node.getAttributeNode(name) || document.createAttribute(name)
	  attr.nodeValue=value
	  node.setAttributeNode(attr)
  }
}

exports.setAttribute = setAttribute

const removeAttribute = function (node, name) {
  if (node.removeAttribute) {
	  node.removeAttribute(name)
  } else {
    let attr = node.getAttributeNode(name)
    if (attr) {
      node.removeAttributeNode(attr)
    }
  }
}

exports.removeAttribute = removeAttribute

export function cloneElement(el){
  return el.cloneNode(true)
  /*
  let clone = document.createElement(el.tagName)
  for (let i=0; i < el.attributes.length; i++) {
	  setAttribute(clone, el.attributes[i].nodeName, el.attributes[i].value || el.attributes[i].nodeValue)
  }
  clone.innerHTML = el.innerHTML
  if (clone.innerHTML != el.innerHTML) {
    for (let i=0; i < el.childNodes.length; i++) {
      console.log(el.childNodes[i])
      let child = cloneElement(el.childNodes[i])
      clone.appendChild(child)
    }
  }
  return clone;
  */
}

export function hashCode (str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export function formatMoney(price) {
  let str = '' + price, ret = '', i = str.length
  while (--i >= 0) {
    ret = ((str.length - i) % 3 ? '' : ' ') + str[i] + ret
  }
  return ret.trim()
}
const getWindowScrollingElement = () => window.document.scrollingElement ? window.document.scrollingElement : window.document.documentElement
export function getWindowScrollTop() {
  return getWindowScrollingElement().scrollTop || document.getElementsByTagName('body')[0].scrollTop
}

export function getWindowScrollLeft() {
  return getWindowScrollingElement().scrollLeft || document.getElementsByTagName('body')[0].scrollLeft
}

export function getWindowHeight() {
  return window.innerHeight || (document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : '')
}

export function getWindowWidth() {
  return window.innerWidth || (document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : '')
}

export function FormToArray(element) {
  let serializeArray = []
  if (element) {
    if (element.elements) {
      for(let i = 0; i < element.elements.length; i += 1) {
        let el = element.elements[i]
        serializeArray.push({name: el.name, value: el.value})
      }
    } else {
      for (let name in element ) {
        serializeArray.push({name: name, value: el[name]})
      }
    }
  }
  return serializeArray
}

export function closest(el, selector) {
  var matchesFn;

  ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
      if (typeof documentBody[fn] == 'function') {
          matchesFn = fn;
          return true;
      }
      return false;
  })

  var parent;

  // traverse parents
  while (el) {
      parent = el.parentElement;
      if (parent && parent[matchesFn](selector)) {
          return parent;
      }
      el = parent;
  }

  return null;
}

export function getMouseEventPosition(event) {
  let ret = {left: event.pageX, top: event.pageY}
  if (ret.left == null && event.clientX != null) {
    const eventDoc = (event.target && event.target.ownerDocument) || document
    const doc = eventDoc.documentElement
    const body = eventDoc.body

    ret.left = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0)
    ret.top = event.clientY +
      (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
      (doc && doc.clientTop  || body && body.clientTop  || 0 )
  }

  return ret
}

export class VirtualPopoverReference {
  constructor(props) {
    this.getBoundingClientRect = () => Object.assign({width: 1, height: 1}, props, {bottom: props.bottom || props.top, right: props.right || props.left})
  }

  get clientWidth() {
    return this.getBoundingClientRect().width
  }

  get clientHeight() {
    return this.getBoundingClientRect().height
  }
}

export function preventDefault(e) {
  e.preventDefault()
}