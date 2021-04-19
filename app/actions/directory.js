import {DIRECTORY_DATATYPE} from '../constants'
import serverRequest from '../components/common/serverRequest'

module.exports = {
  datatypes: () => dispatch => serverRequest({
    url: '/directory/datatypes',
    dataType: 'json',
    success: data => dispatch({type: DIRECTORY_DATATYPE, data})
  })
}