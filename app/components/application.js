import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {AlertMessage, WaitSpinner} from './common'
import ServerErrorView from '../views/Error'
import MainLayout from '../components/layouts/Main'

class App extends React.Component {
  componentDidMount() {
    this.props.view.bootstrap()
  }

  renderChildren(route, props) {
    const Wrapper = (route.wrapper);
    return route.wrapper
     ? (navigation) => <Wrapper {...props} {...navigation}><route.component {...props} {...navigation} /></Wrapper>
     : (navigation) => <MainLayout><route.component {...props} {...navigation}/></MainLayout>
  }
  
  renderRoutes (list, props) {
    
    return list.map(
      (route, key) => (
      route.redirect 
        ? (<Redirect key={key} from={route.path} to={route.redirect} />)
        : (<Route key={key} path={route.path} exact={!!route.exact} render={this.renderChildren(route, props)} />)
      )
    )
  }

  render () {
    const {routes, view, account} = this.props
    return view.error
      ? (<MainLayout><ServerErrorView {...this.props} /></MainLayout>)
      : view.bootstrapped && [
        (<WaitSpinner key="spinner" on={view.loading}/>),
        (<AlertMessage key="app-alert" {...view}/>),
        (<Switch key="route-switch">{this.renderRoutes(routes, this.props)}</Switch>)
      ]
  }
}

export default App;