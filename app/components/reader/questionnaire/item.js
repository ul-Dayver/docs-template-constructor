import React from 'react'
import {Radio, Checkbox} from '../../datatype'

export default class Item extends React.Component {
  render() {
    const {parent, onChange, data, value} = this.props
    const {description, children} = data
        
    return children && children.length
      ? (
        <div className="with-child">
          {description}
          <ul className="list-group list-group-flush">
            {
              children.map(
                (item, i) => (
                  <li key={item.key} className="list-group-item">
                    <Item data={item} parent={data} onChange={onChange} value={item.key === value} />
                  </li>
                )
              )
            }
          </ul>
        </div>
      )
      : (
       !!parent
        ? <Radio onChange={checked => checked && onChange(parent.key, data.key)} label={description} checked={value} name={parent.key} value={data.key} />
        : <Checkbox onChange={checked => onChange(data.key, checked)} label={description} checked={value} />
      )
  }
}