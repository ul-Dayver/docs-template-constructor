import React, {Suspense} from 'react'
import {Link} from 'react-router-dom'
const Constructor = React.lazy(() => import('../components/constructor') )
import {HtmlToImage, JSONDiff as diff, ComponentSpinner} from '../components/common'
import {addEvent, removeEvent, documentBody} from '../components/layouts/Helpers'

let timerChange

export default class EditorView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibilityEditNameLabel: 'visible',
      id: this.props.match.params.templateUid
    }
    this.beforeChangeInit = () => {
      const template = this.props.templates.Collection.get(this.state.id)
      if (template && template.has('sync') && template.get('sync')) {
        const {metadata, questionnaire} = template.toJS()
        return {metadata, questionnaire}
      }
      return null
    }
    this.beforeChange = this.beforeChangeInit()
    this.saveName = (e) => {
      if (e.target.selectionStart && e.target.selectionEnd) 
        e.target.selectionStart = e.target.selectionEnd = 0
      this.props.templates.patch(this.state.id,{
        name: this.props.templates.Collection.getIn([this.state.id, 'name'])
      })
      this.setState({visibilityEditNameLabel: 'visible'})
    }

    this.saveContent = () => {
      const id = this.state.id
      const {templates} = this.props
      const template = templates.Collection.get(id)
      
      if (this.beforeChange) {
        const {metadata, questionnaire} = this.beforeChange
        let patch = diff(metadata, template.get('metadata'), 'metadata')
        let qPatch = diff(questionnaire, template.get('questionnaire'), 'questionnaire')
        
        if (Array.isArray(qPatch)) {
          if (Array.isArray(patch)) patch = patch.concat(qPatch)
          else patch = qPatch
        }
        
        if (Array.isArray(patch)) {
          const page = document.querySelector('.document-constructor-page.page-0')
          HtmlToImage(page).then(preview => {
              templates.change(id, {preview})
              templates.patch(id, {content: patch, preview})
            }
          )
          const {metadata, questionnaire} = template.toJS()
          this.beforeChange = {metadata, questionnaire}
        }
      }
    }

    this.handleChangeTemplate = templateDataJSON => {
      this.props.templates.change(this.state.id, templateDataJSON)
      if (timerChange) clearTimeout(timerChange)
      timerChange = setTimeout(this.saveContent, 1000)
    }

    this.handleChangeDocName = e => this.props.templates.change(this.state.id, {name: e.target.value})

    this.handleResize = () => {
      const {editNameLabel, editName, navbar} = this.refs
      if (editNameLabel) {
        !!navbar && (editNameLabel.style.maxWidth = (navbar.offsetWidth - 28)+'px')
        !!editName && (editName.style.width = editNameLabel.offsetWidth+'px')
      }
    }
    this.handleEditNameFocus = () => this.setState({visibilityEditNameLabel: 'hidden'})
  }

  componentWillUnmount() {
    documentBody.removeAttribute("style")
    removeEvent(window, "resize", this.handleResize)
  }

  componentDidMount() {
    documentBody.style.overflow = 'hidden'
    this.handleResize()
    addEvent(window, "resize", this.handleResize)

    const id = this.state.id
    const template = this.props.templates.Collection.get(id)
    if (template && template.has('sync') && template.get('sync')) return;
    this.props.templates.fetch(id, () => this.beforeChange = this.beforeChangeInit())
    return false
  }

  componentDidUpdate() {
    this.handleResize()
  }

  render () {
    const template = this.props.templates.Collection.get(this.state.id)
    if (!template || !template.has('document')) return null
    
    return (
      <div className="gray-bg animated fadeIn writer">
        <div className="d-flex flex-row justify-content-start align-items-center bg-white fixed-top editor-toolbar">
          <Link className="navbar-brand" to="/">
            <img src="/images/logo-pic.png"/>
          </Link>
          <div ref="navbar" className="d-flex navbar-collapse">
            <span ref="editNameLabel" className="editor-edit-name-label d-block" style={{visibility: this.state.visibilityEditNameLabel}}>{template.get("name")}</span>
            <input ref="editName" className="editor-edit-name" value={template.get("name")} onChange={this.handleChangeDocName} onBlur={this.saveName} onFocus={this.handleEditNameFocus}/>
          </div>
        </div>
        <Suspense fallback={<ComponentSpinner />}>
          <Constructor
            template={template}
            directory={this.props.directory}
            onChange={this.handleChangeTemplate}
          />
        </Suspense>
      </div>
    )
  }
}