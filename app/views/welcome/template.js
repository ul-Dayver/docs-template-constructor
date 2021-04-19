import React from 'react'
import {Dropdown} from '../../components/common'
import moment from 'moment'
require('moment/locale/ru')

export default class Template extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: moment(props.created_at, 'YYYY-MM-DD HH:mm:ss').format("DD MMM YYYY")
    }
    this.handleDelete = (e) => {
      e.stopPropagation()
      this.props.onDelete(this.props.uid)
    }
    this.hasToolClick = false
    this.handleToolClick = () => this.hasToolClick = true
    this.handleOpen = () => {
      if (!this.hasToolClick) this.props.history.push("/w/"+this.props.uid)
      this.hasToolClick = false
    }
    
  }
  render() {
    const {name, preview} = this.props
    
    return (
      <div className="doc-preview text-center d-block" onClick={this.handleOpen}>
        {
          !!preview
          ? (<img src={preview} />)
          : (<div className="img-doc-preview"></div>)
        }
        <div className="p-3 border-top">
          <div className="doc-preview-name text-nowrap">{name}</div>
          <div className="text-left py-3 pl-1">
            <div className="pull-right" onClick={this.handleToolClick}>
              <Dropdown
                bttnClassName="btn btn-white rounded-circle"
                label={(<i className="fa fa-ellipsis-v px-1"></i>)}
                options={
                  [
                    {label: <span><i className="fa fa-trash text-danger align-middle" style={{fontSize: '18px'}}></i><span className="ml-2 text-nowrap">Удалить</span></span>, handle: this.handleDelete},
                  ]
                }
              />
            </div>
            <div className="mt-1">
              <span className="h3"><i className="fa fa-file-text mr-2 text-primary"></i></span>
              <span className="text-muted">{this.state.date}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}