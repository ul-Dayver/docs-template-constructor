import React from 'react'
import {sendForm, RESTful} from '../../components/common'
import {BASE_PATH} from '../../constants'
import Template from './template'

export default class Templates extends React.Component {
  constructor(props) {
    super(props)
    this.creating = false
    this.createTemplate = () => {
      this.creating=true
      this.props.templates.create()
    }
    
    this.handleClickWordImport = () => document.getElementById('word-file-import').click()
    this.handleChangeFileUpload = (e) => {
      e.preventDefault();
      let form = e.target.parentNode
      let name = e.target.files[0].name.replace('.docx','')
      sendForm(form, resp => {
        form.reset()
        if (resp.success) {
          this.creating=true
          this.props.templates.create({metadata: resp.data, name})
        } else console.log(resp.message)
      }, err => console.log(err))
      return false
    }
    this.handleConvert = () => {
      RESTful.read('/upload/migrate?uid=ebb01d22-7547-44b6-b4dc-8dcb4898ce66')
      .then(metadata => {
        this.creating=true
        this.props.templates.create({metadata, name: "ebb01d22-7547-44b6-b4dc-8dcb4898ce66"})
      })
    }
  }
  componentDidUpdate() {
    const {Collection, save} = this.props.templates
    let nId = ''
    if (this.creating && Collection.has(nId)) {
      const template = Collection.get(nId)
      this.creating = false
      save(template, ({id}) => {
        if (id) this.props.history.push('/w/' + id)
        else this.props.templates.delete(nId)
      })
    }
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.templates.Collection.equals(this.props.templates.Collection)
  }

  render() {
    const {templates, account} = this.props
    return (
      <div className="container">
        <form encType="multipart/form-data" action={BASE_PATH + "/upload/template"} method="post" className="d-none">
          <input accept="application/vnd.ms-word" name="template" id="word-file-import" type="file" onChange={this.handleChangeFileUpload}/>
        </form>
        <div className="ibox">
          <div className="ibox-title"><h5>Мои шаблоны</h5></div>
          <div className="ibox-content">
            <div className="d-flex flex-row" style={{overflowX: "scroll"}}>

              <div className="text-center doc-preview position-relative" onClick={this.createTemplate}>
                <div className="img-doc-preview pt-5">
                  <i className="display-5 fa fa-plus py-5"></i>
                </div>
                <div className="doc-preview-name pl-3">Создать шаблон</div>
              </div>
      
              <div className="text-center doc-preview position-relative" onClick={this.handleClickWordImport}>
                <div className="img-doc-preview pt-5">
                  <i className="display-5 icon-microsoftword py-5 d-inline-block"></i>
                </div>
                <div className="doc-preview-name pl-3">Импортировать</div>
              </div>

              <div className="text-center doc-preview position-relative" onClick={this.handleConvert}>
                <div className="img-doc-preview pt-5">
                  <i className="display-5 py-5 d-inline-block"></i>
                </div>
                <div className="doc-preview-name pl-3">Конвертировать</div>
              </div>

              {
                templates.Collection.map(
                  (template, id) => !!id && template.get('account_uid') == account.state.id && (
                    <Template key={"templates_list-template-"+id} {...template.toJS()} history={this.props.history} onDelete={templates.delete}/>
                  )
                ).toList().toArray()
              }

            </div>
          </div>
        </div>
    </div>
    )
  }
}