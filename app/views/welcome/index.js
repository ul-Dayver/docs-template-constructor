import React, { Component } from 'react'
import DocumetsList from './documents'
import TemplatesList from './templates'
import MyDocsList from './mydocs'

class Welcome extends Component {
  componentDidMount() {
    this.props.templates.fetch(null, () => {
      this.props.documents.fetch()
    })
  }
  render () {
    const {account} = this.props
    let writer = account.isAuth() && account.state.roles.has('tplwriter')
    
    return (
      <div>
        <div className="gray-bg">
          <DocumetsList {...this.props}/>
        </div>
        <div className="white-bg">
          <MyDocsList {...this.props}/>
        </div>
        {writer && (<div className="gray-bg"><TemplatesList {...this.props} /></div>)}
      </div>
    )
  }
}

export default Welcome