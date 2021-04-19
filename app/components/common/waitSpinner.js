import React from 'react'

const ON = 'fadeIn'
const OFF = 'fadeOut'
//const NONE = ''
const HIDDEN = 'hidden'

class WaitSpinner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: HIDDEN
    }
    this.timer = null
  }

  toggleStatus(on) {
    const {status} = this.state
    if (status === HIDDEN && !on) return
    if (status !== OFF) this.setState({status: OFF})
    if (on && status !== ON) {
      this.timer = setTimeout(() => this.setState({status: ON}), 100)
    } else if (status !== HIDDEN) {
      this.timer = setTimeout(() => this.setState({status: HIDDEN}), 500)
    }
  }

  componentDidMount() {
    this.toggleStatus(this.props.on)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.on === this.props.on) return
    if (this.timer) clearTimeout(this.timer)
    this.toggleStatus(newProps.on)
  }
  render() {
    return (
      <div className={"modal waiting-spinner animated " + this.state.status}>
        <div className="waiting-spinner-bg"></div>
        <div className="waiting-spinner-body">
          <div className="alert alert-success">
            <div className="sk-spinner sk-spinner-rotating-plane pull-left "></div>
            <p className="m-l-xl">Пожалуйста, подождите...</p>
          </div>
        </div>
      </div>
    )
  }
}

export default WaitSpinner