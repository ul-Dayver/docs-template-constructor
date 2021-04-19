import React, { Component } from 'react'
import Constructor from '../components/constructor'
import {HtmlToImage, RESTful} from '../components/common'

class Converter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null
    }
    this.list = []
    
    this.handleConvert = ()  => {
      if (!this.list.length) return setTimeout(() => this.handleDraw(), 1000)
      console.log(this.list.length)
      let {uid, name} = this.list.shift()
      RESTful.read(`/upload/migrate?uid=${uid}`)
        .then(metadata => {
          this.props.templates.create({metadata, name})
          this.handleSave()
        })
    }
    this.handleSave = () => {
      const {Collection, save} = this.props.templates
      let nId = ''
      if (Collection.has(nId)) {
        const template = Collection.get(nId)
        save(template, () => {
          this.props.templates.delete(nId)
          this.handleConvert()
        })
      }
    }
    this.handleDraw = () => {
      const {Collection, fetch} = this.props.templates
      const id = Collection.findKey(
        (tpl, id) => this.list.indexOf(id) < 0
        //(tpl, id) => this.list.indexOf(id) < 0 && !tpl.get('preview')
      )

      if (id) //fetch(id, () => 
        this.setState({id})
      //)
      else console.log('end')
    }
  }

  componentDidUpdate() {
    const {id} = this.state
    const {Collection} = this.props.templates
    if (id && Collection.has(id) && this.list.indexOf(id) < 0) {
      const page = document.querySelector('.document-constructor-page.page-0')
      const {patch} = this.props.templates
      HtmlToImage(page).then(preview => {
        const name = Collection.get(id).get('name')
        this.list.push(id)
        console.log(this.list.length, id, name)
        patch(id, {preview, name})
        setTimeout(() => {this.handleDraw()}, 1000)
      })
    }
  }

  componentDidMount() {
    /*  
    const {fetch} = this.props.templates
    fetch(null, () => {
      const {Collection} = this.props.templates
      Collection.forEach((tpl, id) => tpl.get('preview') && this.list.push(id))
      this.handleDraw()
    })
    
   
        this.counter = this.list.length
        this.handleConvert()
        */
   
    RESTful.read('/upload/migratelist?limit=125')
      .then(list => {
        this.list = list
        this.counter = list.length
        this.handleConvert()
      })
    
  }
  render () {
    const {Collection} = this.props.templates
    const template = Collection.get(this.state.id)
    
    return (
      <div>
        {template && template.has('document') && ( <Constructor template={template} directory={this.props.directory} onChange={() => {}} />)}
      </div>
    )
  }
}

export default Converter