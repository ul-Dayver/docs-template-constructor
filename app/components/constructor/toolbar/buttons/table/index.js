import React from 'react'
import Model from '../../../block/table/model'
import Helper from './helper'
//import Properties from '../../../../constructor/block/table/properties'

export default class TableButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showHelper: false,
      //showProp: false,
      //table: null
    }
    this.hasClick = false

    this.createTable = (x, y) => {
      //this.setState({showHelper: false, showProp: true, table: {columns: x, rows: y}})
      let table = new Model({columns: x, rows: y})
      const {constructor, blockID} = this.props
      if (!blockID) constructor.add(table)
      else constructor.insert(blockID, table)
    }
    /*
    this.Accept = prop => {
      let table = new Model(Object.assign({}, this.state.table, {prop}))
      this.setState({showProp: false, table: null}, () => {
        const {constructor, blockID} = this.props
        
        if (!blockID) constructor.add(table)
        else constructor.insert(blockID, table)
      })
    }
    this.Cancel = () => this.setState({showProp: false, table: null})
    */
    this.handler = (e) => {
      e.preventDefault()
      this.hasClick = true
      const showHelper = !this.state.showHalper
      if (showHelper) {
        window.addEventListener('click', this.onWindowClick)
      } else {
        window.removeEventListener('click', this.onWindowClick)
      }
      this.setState({showHelper})
    }
  }

  onWindowClick = () => {
    if (!this.hasClick) {
      this.componentWillUnmount()
      this.state.showHelper && this.setState({showHelper: false})
    }
    this.hasClick = false
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick)
  }

  render() {
    const {theme} = this.props
    return (
      <div className={theme.buttonWrapper}>
        <button className={theme.button} onClick={this.handler} type="button" title="Вставить таблицу">
          <i className="icon-table2"></i>
        </button>
        {!!this.state.showHelper && (<Helper onSelect={this.createTable} />)}
      </div>
    )
  }
}

//<Properties show={this.state.showProp} onAccept={this.Accept} onCancel={this.Cancel} />