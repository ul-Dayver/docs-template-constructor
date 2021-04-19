import React from 'react'
import {ERROR_403,ERROR_401, ERROR_404} from '../constants'

export default class errorView extends React.Component {
  constructor(props) {
    super(props)
    this.signIn = () => {
      this.props.history.push('/login')
      this.props.view.exitError()
    }
    this.closeError = () => {
      const {view, history} = this.props
      if (view.error_status == ERROR_404) history.push('/')
      view.exitError()
    }
  }

  render () {
    const {view} = this.props
    return (
      <div className="middle-box text-center gray-bg py-4">
        {
          view.error_status == ERROR_404 && (
            <div className="error-desc">
              <h1>404</h1>
              <h2>Страница не найдена!</h2>
              <p></p>
            </div>
          )
        }
        {(typeof view.error == 'string') && (<div className="error-desc" dangerouslySetInnerHTML={{__html: view.error}}></div>)}
        {
          (view.error_status == ERROR_403 || view.error_status == ERROR_401) && (
            <button type="button" className="btn btn-secondary m-r-lg" onClick={this.signIn}>
              <i className="fa fa-unlock-alt m-r-sm"></i><span>Авторизоваться</span>
            </button>
          )
        }
        <button type="button" className="btn btn-primary" onClick={this.closeError}>
          <i className="fa fa-reply m-r-sm"></i><span>Вернуться</span>
        </button>
      </div>
    )
  }
}