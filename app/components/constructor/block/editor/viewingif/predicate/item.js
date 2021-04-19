import React from 'react'
import Layout from './layout'
import {Switch, Dropdown} from '../../../../../common'

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.handleClose = () => this.props.onChange(this.props.index)
    this.handleSelect = ({value}, dd) => {
      dd.close();
      const {index, data, onChange} = this.props
      onChange(index, {key: data.key, value})
    }
    this.handleSwitch = value => this.props.onChange(this.props.index, {key: this.props.data.key, value})
    this.handleAddCondition = ({item}) => this.props.onChange(this.props.index, 
      [{...this.props.data}, 1, {key: item.key, value: item.children ? item.children[0].key : true}]
    )
  }
  render () {
    const {data, description, variants, addOptions} = this.props
    let dropDownLabel = 'Укажите вариант'
    const dropDownOptions = variants && variants.map(variant => {
      let ret = {label: variant.description, value: variant.key}
      if (variant.key === data.value) {
        dropDownLabel = variant.description
        ret.active = true
      }
      return ret
    })
    return (
      <Layout onClose={this.handleClose} onAddCondition={this.handleAddCondition} addOptions={addOptions}>
      <div className="row">
        <div className="col-6">
          {description}
        </div>
        <div className="col-6">
          {
            variants
            ? <Dropdown bttnClassName="border border-info p-2 rounded dropdown-toggle" options={dropDownOptions} label={dropDownLabel} onSelect={this.handleSelect} />
            : <Switch on={!!data.value} onChange={this.handleSwitch} labels={['Нет', 'Да']} />
          }
        </div>
      </div>
      </Layout>
    )
  }
}