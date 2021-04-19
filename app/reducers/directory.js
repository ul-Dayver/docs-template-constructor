import {DIRECTORY_DATATYPE} from '../constants'
import {Map} from 'immutable'

exports.defState = () => {
  return {
    datatype: Map()
  }
}
exports[DIRECTORY_DATATYPE] = (state, action) => Object.assign({}, state, {
  datatype : Map(
    action.data.map(element => [element.name, Map(element)])
  )
})