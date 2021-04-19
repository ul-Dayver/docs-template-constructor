import {diff} from 'deep-diff'

const operations = {N: 'add', D: 'remove', E: 'replace'}

const normalize = val => Array.isArray(val) ? val.toObject() :val

export default (original, $new, root) => {
  let patch = diff(
    normalize(original),
    normalize($new),{
      normalize: (path, key, lhs, rhs) => [
        normalize(lhs), normalize(rhs)
      ]
    }
  )
  if (patch && patch.length) {
    let ret = []
    root = root || ""
    patch.forEach(operation => {
      let {kind, path, lhs, rhs} = operation
      if (path) path.unshift(root)
      else path = [root]
      path = '/' + path.join('/')
      if (kind == 'E') ret.push({value: lhs, op:"test", path})
      let set = {op: operations[kind], path}
      if (kind != 'D') set.value = rhs
      ret.push(set)
    })
    return ret
  }
  return patch
}