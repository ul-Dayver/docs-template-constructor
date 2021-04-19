import React from 'react'
import {Dropdown} from '../../../../../common'

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.handleDropDown = (option, dropdown) => {
      dropdown.close()
      this.props.onAddCondition(option)
    }
  }
  render () {
    const {onClose, children, addOptions, root} = this.props
    const dropDown = (
      <Dropdown
        key="dropdown-addcondition"
        bttnClassName="btn btn-info m-t-md"
        label={(<span><i className="fa fa-plus m-r-sm"></i><span>Добавить условие</span></span>)}
        options={addOptions}
        onSelect={this.handleDropDown}
      />
    )

    return root 
      ? [children, dropDown]
      : (
        <div className="position-relative border border-secondary p-3">
          <div className="position-absolute bg-muted border border-secondary rounded-circle px-1" style={{right: '-1rem', top: '-1rem'}}>
            <button type="button" className="close" onClick={onClose}>&times;</button>
          </div>
          {children}
        </div>
      )
  }
}//{dropDown}