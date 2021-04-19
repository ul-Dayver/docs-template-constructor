import React from 'react'

export default class Switch extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onChange(!this.props.on)
  }

  setNoSelect (self) {
    if (self && !self.onselectstart) {
      self.onselectstart = () => false
      self.oncontextmenu = () => false
    }
  }

  render() {
    const {on, labels} = this.props
    return (
      <div ref={this.setNoSelect} className={"switch-component " + (on ? "on" : "off")} href="#" onClick={this.handleClick}>
        <span className="pr-2">{labels && labels.length ? labels[0] : 'OFF'}</span>
        <span className={"switch-component-bg"}>
          <span className={"switch-component-hand"}>&nbsp;</span>
        </span>
        <span className="pl-2">{labels && labels.length ? labels[1] : 'ON'}</span>
      </div>
    )
  }
}