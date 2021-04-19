import React from 'react'
import ReactDOM from 'react-dom'
import {documentBody} from '../layouts/Helpers'

export default class Modal extends React.Component {
  constructor(props) {
	  super(props);
    this.isRender = false
    this.el = document.createElement('div')
    
    this.onActivate = () => {this.isRender = true; this.componentDidUpdate()}
    this.onUnActivate = () => {this.isRender = false; this.componentDidUpdate()}
    this.onClickClose = () => this.props.clickClose()
    this.handleClick = e => e.target.className.indexOf('modal fade') >= 0 && this.onClickClose()
  }
  
  componentDidMount() {
    documentBody.appendChild(this.el)
    //this.renderForm(this.props)
  }
  
  componentWillUnmount() {
    documentBody.removeChild(this.el)
    documentBody.className = documentBody.className.replace('modal-open','').trim()
  }
  
  componentDidUpdate() {
    this.renderForm(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return !(nextProps.isActive === this.props.isActive && nextProps.isActive === false)
  }

  render() {
    return null
  }

  renderForm(props) {
    let styleModal = {display: 'block'}
    let classModal = "modal fade"
    let backdrop = "modal-backdrop fade"

    if (props.isActive) {
      styleModal.paddingRight = '17px'
      if (this.isRender) {
        backdrop += " show"
        classModal = classModal + " show"
        if (documentBody.className.indexOf('modal-open') < 0) {
          documentBody.className += ' modal-open'
          documentBody.style.paddingRight = '17px'
        }
      }
    } else if (this.isRender) {
      documentBody.style.paddingRight = null
    } else {
      documentBody.className = documentBody.className.replace('modal-open','').trim()
      ReactDOM.unmountComponentAtNode(this.el)
      return;
    }
    
    ReactDOM.render(
      <div>
        <div className={classModal} style={styleModal} onClick={this.handleClick}>
          <div className="modal-dialog" >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{marginTop: '3px'}}>{props.title}</h5>
                <button type="button" className="close" onClick={this.onClickClose}>&times;</button>
              </div>
              <div className="modal-body">
                {props.children}
              </div>
              <div className="modal-footer">
                {
                  props.buttons
                  ? (props.buttons.map((bttn, i) => <button key={i} type="button" className={"btn " + (bttn.className || "btn-primary")} onClick={bttn.handle} disabled={!!bttn.disabled}>{bttn.label}</button>))
                  : <button type="button" className="btn btn-secondary" onClick={this.onClickClose}>Закрыть</button>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={backdrop}></div>
      </div>
      ,this.el
    )
    if (props.isActive && !this.isRender) {
      setTimeout(this.onActivate, 200)
    } else if (!props.isActive && this.isRender) {
      setTimeout(this.onUnActivate, 300)
    }
  }
}

