import React from 'react'

class Radion extends React.Component {
  constructor(props){
    super(props)
    this.state={
      hover: false
    }
    this.handlerClick = this.handlerClick.bind(this)
  }

  handlerClick(event) {
    event.preventDefault()
    const {readOnly, checked, value} = this.props
    if (!readOnly) 
      this.props.onChange(!checked, value == undefined ? null : value)
  }

  render(){
    let classNameState = "iradio_square-green"
    const {checked, disabled, readOnly, children, label, name, value} = this.props
    if (checked) {
      classNameState += " checked"
    }
    if (disabled) {
      classNameState += " disabled"
    }
    if (this.state.hover) {
      classNameState += " hover"
    }

    return (
      <label className={'media' + (this.state.hover ? " hover" : "")}
        onClick={this.handlerClick}
        onMouseOver={() => this.setState({hover: true})}
        onMouseOut={() => this.setState({hover: false})}
        >
        <div className="media-left">
          <div className={classNameState}>
            {
              readOnly
              ? (<input disabled={disabled || false} name={name} type="radio" value={value} checked={checked} readOnly/>)
              : (<input disabled={disabled || false} name={name} type="radio" value={value} checked={checked} onChange={this.handlerClick}/>)
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

export default Radion