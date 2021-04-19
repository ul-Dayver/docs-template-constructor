import USP from 'url-search-params';

const polyfill = (function () {
  if (!window.URLSearchParams) {
    window.URLSearchParams = USP;
  }

  if (!('FormData' in window)) {
    window.FormData = function (element) {
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
      
      this.get = function (name) {
        let ret = serializeArray.map((item) => item.name == name ? item.value : null)
        return ret[0] || null
      }
      this.append = (name, value) => serializeArray.push({name: name, value: value})
      this.toString = () => serializeArray.map((item) => encodeURIComponent(item.name) + "=" + encodeURIComponent(item.value == null ? "" : item.value )).join('&')
    }
    window.FormData.prototype.fake = true
  }

  if (!('ucfirst' in String) && !String.prototype.ucfirst) {
    String.prototype.ucfirst = function(){ return this.charAt(0).toUpperCase() + this.substr(1) };
  }

  if (!('clearString' in String) && !String.prototype.clearString) {
    String.prototype.clearString = function() {return JSON.parse(JSON.stringify(this))}
  }

  if (!('hashCode' in String) && !String.prototype.hashCode) {
    String.prototype.hashCode = function() {
      var hash = 0, i, chr;
      if (this.length === 0) return hash;
      for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
      }
      return hash;
    };
  }

  if (!('toRangeArray' in Number) && !Number.prototype.toRangeArray) {
    Number.prototype.toRangeArray = function(count) {
      let middle = this / count
      let fraction = 0
      let ret = []
      for(let i=0; i < count; i++) {
        let tranc = Math.trunc(middle)
        fraction += middle - tranc
        
        let plus = 0
        if (fraction > 0) {
          plus = Math.trunc(fraction)
          fraction -= plus
        }
        ret[i] = tranc + plus
      }
      if (Math.round(fraction)) ret[count-1] += 1
      return ret
    }
  }

  if (!('toObject' in Array) && !Array.prototype.toObject) {
    Array.prototype.toObject = function() {
      return this.length ? Object.assign({}, this) : {}
    }
  }

  return true
})();

export default polyfill