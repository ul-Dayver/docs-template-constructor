import React from 'react'

class CheckBox extends React.Component {
  constructor(props){
    super(props)
    this.state={
      hover: false
    }
    this.handlerClick = this.handlerClick.bind(this)
  }

  handlerClick(event) {
    event.preventDefault()
    const {readOnly, checked, value, onChange} = this.props
    if (!readOnly) {
      onChange(!checked, value || null)
    }
  }

  render(){
    let classNameState = "icheckbox_square-green"
    const {checked, disabled, readOnly, children, label} = this.props
    if (!!checked) {
      classNameState += " checked"
    }
    if (disabled) {
      classNameState += " disabled"
    }
    if (this.state.hover) {
      classNameState += " hover"
    }

    return (
      <label className={'media' + (this.state.hover ? " hover" : "")} onClick={this.handlerClick} onMouseOver={() => this.setState({hover: true})} onMouseOut={() => this.setState({hover: false})}>
        <div className="media-left">
          <div className={classNameState}>
            {
              readOnly
              ? (<input disabled={disabled || false} type="checkbox" checked={!!checked} readOnly/>)
              : (<input disabled={disabled || false} type="checkbox" checked={!!checked} onChange={this.handlerClick}/>)
            }
            <i className="iCheck-helper"></i>
          </div>
        </div>
        <div className="media-body" style={{verticalAlign: 'middle'}}>
          <span>{children ? children : label}</span>
        </div>
      </label>
    )
  }
}

export default CheckBox