import React, { Component } from 'react'
import {AUTH} from '../constants'
import {serverRequest} from '../components/common'
import {documentBody} from '../components/layouts/Helpers'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.view.cookie.get('login'),
      editing: false,
      errors: null
    }

    this.start = true

    this.signIn = this.signIn.bind(this);
    this.fail = this.fail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handlerChange = this.handlerChange.bind(this);
    this.handlerFocusFild = this.handlerFocusFild.bind(this);
    this.handlerBlurFild = this.handlerBlurFild.bind(this)
  }

  componentDidMount(){
    this.componentWillUnmount()
    documentBody.className += ' white-bg signin'
    this.start = false
  }

  componentWillUnmount(){
    documentBody.className = documentBody.className.replace(/white-bg/ig,'').replace(/signin/ig,'').trim()
  }

  componentWillUpdate(nextProps, nextState){
    nextProps.view.cookie.set({
      name: 'login',
      value: nextState.username,
      path: '/',
      expires: nextProps.view.cookie.days(14)
    })
  }

  signIn() {
    /*
    if (!!location.pathname.replace(/^\/+|\/+$/g,'')) {
      window.location.href = location.pathname
      return window.location.reload()
    } else if (!!this.props.view.lostPathName) {
      window.location.href = document.location.pathname + '#' + this.props.view.lostPathName
      return window.location.reload()
    }
    */
    window.location.href = "/"
    this.props.view.unlockView('Login')
    this.props.account.login(this.state.username)
  }

  fail(errors) {
    //console.log(errors)
    this.props.view.unlockView('Login')
    this.setState({errors: errors, editing: false});
  }
  
  parseResponse(html){
    let errors = [];
    if (html.length) {
      let el = document.createElement('body');
      el.innerHTML = html.trim();
      let htmlErrors = el.getElementsByClassName('authorization-errors');
      if (htmlErrors.length) {
      errors = errors.slice.call(htmlErrors[0]
        .getElementsByTagName('li'))
        .map((error) => error.innerHTML.trim())
        .join('|');
      }
    }

    if (errors.length) {
      return Promise.reject(errors.split("|"));
    }

    return Promise.resolve(true);
  }
  
  handlerChange(event) {
    const state = {errors: null, editing: true};
    if (event.target.name == 'lgn') {
    state.username = event.target.value;
    }
    this.setState(Object.assign({},state));
  }

  handlerFocusFild(event) {
    if (event.target.tagName.toLowerCase() == 'label') return false;
    let Label = event.target.name ? this[event.target.name + 'Label'] : event.target
    Label.style.display = 'none'
  }

  handlerBlurFild(event) {
    let Label = this[event.target.name + 'Label']
    if (!event.target.value.length)
      Label.style.display = ''
  }

  onSubmit(event) {
    this.props.view.lockView('Login')

    let body = new FormData(event.target)
    
    this.setState({
      username: document.getElementById('lgn').value,
      disconnect: false,
      editing: false
    })
    
    serverRequest({
      url: 'login',
      method: 'POST',
      body: body,
      success: this.parseResponse
    }).then(this.signIn)
      .catch(this.fail);
    event.preventDefault();
  }
  
  render () {

    let formClass = "form-auth animated bounceInDown";
    let errors = null;
    if (this.props.view.loading && !this.start) {
      formClass = formClass.replace('InDown','Out')
    } else if (this.state.errors && this.state.errors.length) {
      formClass = formClass.replace('Down','');
      formClass += " error";
      errors = (<p className="text-danger">{this.state.errors[0]}</p>);
    } else if (this.props.account.status === AUTH) {
      return null;
    }

    if (this.state.editing) {
      formClass = formClass.replace('animated','');
    }
    
    return (
      <div className={"container" + (this.props.view.loading ? ' animated fade' + (this.start ? 'In' : 'Out') : '')}>
        <div className="logo-wrap">
          <div className="pull-right">
            <div className="logo-contacts-phone-wrap">
              <a href="tel:88005003086" className="logo-contacts-phone">8 (800) 500-30-86</a>
            </div>
            <p style={{lineHeight: 1}}>Звонок по России бесплатный</p>
          </div>
          <a className="logo" href="//trudcomplex.ru"></a>
          <p>Сервис для разработки документации<br/>по управлению охраной труда</p>
        </div>
        
        <div className={formClass}>
          <form onSubmit={this.onSubmit} >
            <div>
              <a href='//trudcomplex.ru' className='close button-form_close'></a>
              <h2>Авторизация</h2>
              <div className='title-form'>{errors || "Для входа в систему пожалуйста заполните поля ниже"}</div>
              
              <div ref={(lgn) => this.lgnLabel = lgn}
                onClick={this.handlerFocusFild}
                className="text-left"
                dangerouslySetInnerHTML={{__html: '<!--[if IE]><label for="lgn" class="text-muted">Адрес электронной почты</label><![endif]-->'}}
                style={{display: this.state.username && this.state.username.length ? 'none' : '' }}></div>
              
              <div><input type="text" onBlur={this.handlerBlurFild} onFocus={this.handlerFocusFild} name="lgn" required placeholder="Адрес электронной почты" id="lgn" autoComplete="true" onChange={this.handlerChange} value={this.state.username || ""} /></div>
              
              <div ref={(psw) => this.pswLabel = psw}
                onClick={this.handlerFocusFild}
                className="text-left"
                dangerouslySetInnerHTML={{__html: '<!--[if IE]><label for="psw" class="text-muted">Пароль</label><![endif]-->'}}></div>
              
              <div><input type="password" onBlur={this.handlerBlurFild} onFocus={this.handlerFocusFild} name="psw" required placeholder="Пароль" id="psw" autoComplete="true" onChange={this.handlerChange}/></div>
              
              <div className='footer-form'>
                <a href='/user/forgot' className='forgot'>Забыли пароль?</a>
                <span className='separator'>|</span>
                <a href='/register' className='register'>Регистрация</a>
                <div className="button-bg">
                  <button type="submit" className="login-submit">Войти</button>
                </div>
              </div>
            </div>
          </form>
        </div>
        
      </div>
    )
  }
}

export default Login