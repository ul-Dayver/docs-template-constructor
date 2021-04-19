import React from 'react'

class BttnCreateDoc extends React.Component {
  constructor(props) {
    super(props)
    this.handle = () => this.props.onClick(this.props.template.get("uid"))
  }
  render() {
    const {template} = this.props
    const preview = template.get('preview')
    return (
      <div className="doc-preview text-center" onClick={this.handle}>
        {
          !!preview
          ? (<img src={preview} />)
          : (<div className="img-doc-preview"></div>)
        }
        <div className="doc-preview-name p-1 border-top">{template.get("name")}</div>
      </div>
    )
  }
}

let lastDocId = 0

export default class Documents extends React.Component {
  constructor(props) {
    super(props)
    this.createDocument = template_uid => {
      let body = {
        template_uid,
        data: {questionnaire: null, placeholders: null, tables: null}
      }
      
      if (this.props.account.isAuth())
      this.props.documents.save(body, ({document}) => document && document.uid && this.props.history.push('/r/' + document.uid))
      else {
        this.props.templates.fetch(template_uid, (action) => {
          let uid = ++lastDocId + ''
          let {metadata, questionnaire, name} = action.data
          const template = {metadata, questionnaire, name}
          this.props.documents.create({...body, uid, template})
          this.props.history.push('/r/' + uid)
        })
      }
      
    }
  }
  render() {
    const {templates} = this.props
    return (
      <div className="container">
        <div className="ibox">
          <div className="ibox-title"><h5>Создать документ</h5></div>
          <div className="ibox-content">
            <div className="d-flex flex-row" style={{overflowX: "scroll"}}>
              {
                templates.Collection.map(
                  (template, id) => !!id && (<BttnCreateDoc key={"templates_list-template-"+id} template={template} onClick={this.createDocument}/>)
                ).toList().toArray()
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}