import React from 'react'
import Item from './item'

export default class Questionnaire extends React.Component {
  render() {
    const {list, map, onChange} = this.props
    return (
      <div className="ibox">
        <div className="ibox-title">
          <h5><i className="fa fa-list-alt m-r-sm"></i><span>Опросный лист</span></h5>
        </div>
        <div className="ibox-content" style={{padding: 0}}>
          <ul className="list-group list-group-flush">
          {
            list && list.map(
              item => (
                <li key={item.key} className="list-group-item">
                  <Item data={item} value={map.get(item.key)} onChange={onChange}/>
                </li>
              )
            )
          }
          </ul>
        </div>
      </div>
    )
  }
}