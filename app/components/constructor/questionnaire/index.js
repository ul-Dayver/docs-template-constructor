import React from 'react'
import Item from './item'
import {Dropdown} from '../../common'
import Model from './model'

export default class Questionnaire extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleChangeItem = this.handleChangeItem.bind(this)
  }

  handleChangeItem(index, data) {
    let list = [...this.props.list]
    if (data) {
      list.splice(index,1, data)
    } else {
      list.splice(index, 1)
    }
    this.props.onChange(list)
  }

  handleAddQuestionList(option) {
    let questionnaire = this.props.list || []

    let item = new Model({
      description: '',
      children: option.value && new Array(2)
    })
    
    questionnaire.push(item)
    this.props.onChange(questionnaire)
  }

  render() {
    const {list} = this.props
    return (
      <div className="ibox">
        <div className="ibox-title">
          <h5><i className="fa fa-list-alt m-r-sm"></i><span>Опросный лист</span></h5>
          <div className="ibox-tools">
            <div className="d-inline-block">
              <Dropdown
                bttnClassName="btn-link text-secondary"
                label={<i className="fa fa-plus m-l-sm m-r-sm"></i>}
                onSelect={this.handleAddQuestionList.bind(this)}
                options={[
                  {label: (<span><i className="fa fa-check-circle-o m-r-sm"></i><span>Добавить одиночный выбор</span></span>), value: 0},
                  {label: (<span><i className="fa fa-dot-circle-o m-r-sm"></i><span>Добавить множественный выбор</span></span>), value: 1}
                ]}
              />
            </div>
          </div>
        </div>
        <div className="ibox-content" >
          <ul className="list-group list-group-flush">
          {
            list && list.map(
              (item, i) => <li key={item.key} className="list-group-item"><Item data={item} index={i} onChange={this.handleChangeItem}/></li>
            )
          }
          </ul>
        </div>
      </div>
    )
  }
}