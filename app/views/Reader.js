import React, {Suspense} from 'react'
import {Link} from 'react-router-dom'
const Read = React.lazy(() => import('../components/reader') )
import {Modal, ComponentSpinner} from "../components/common"
import {BASE_PATH} from "../constants"

const ext = ['pdf', 'docx']

export default class ReaderView extends React.Component {
  constructor(props) {
    super(props)
    const id = this.props.match.params.documentUid
    
    this.state = {
      id,
      isActiveDownloadModal: false,
      document: props.documents.Collection.get(id)
    }

    this.handleDownload = () => {
      const {id} = this.state
      const {questionnaire, placeholders, tables} = this.refs.reader.state
      let document = {...this.props.documents.Collection.get(id)} || {template_uid: id}
      
      delete document.name
      delete document.template
      delete document.template_version_uid

      document = Object.assign(document, {
        data: {questionnaire: questionnaire.toJS(), placeholders: placeholders.toJS(), tables: tables.toJS()}
      })
      
      this.props.documents.save(document, () => this.setState({isActiveDownloadModal: true, document: this.props.documents.Collection.get(id)}))
    }
  }

  componentDidMount() {
    const {documents} = this.props
    const {id, document} = this.state
    if (!document) this.props.view.pageNotFound()
    else if (!document.data || !document.template) 
      documents.fetch(id, () => this.setState({document: this.props.documents.Collection.get(id)}))
  }

  render () {
    const {isActiveDownloadModal, document} = this.state
    const {directory} = this.props
    
    if (!document || !document.data || !document.template) return null
    const {uid, name} = document

    return (
      <div className="gray-bg animated fadeIn reader">
        <div className="d-flex flex-row justify-content-start align-items-center bg-white border-bottom fixed-top editor-toolbar">
          <Link className="navbar-brand" to="/">
            <img src="/images/logo-pic.png"/>
          </Link>
          <div className="d-flex navbar-collapse">
            <h3 className="text-nowrap text-truncate" style={{maxWidth: '50%'}}>{name}</h3>
            <button type="button" className="m-l-md btn btn-primary btn-sm" onClick={this.handleDownload}>
              <span><i className="fa fa-download m-r-sm"></i><span>Скачать</span></span>
            </button>
          </div>
        </div>
        <Suspense fallback={<ComponentSpinner />}>
          <Read ref="reader"
            document={document}
            directory={directory}
          />
        </Suspense>
        {
          !!document && (
            <Modal isActive={isActiveDownloadModal} clickClose={() => this.setState({isActiveDownloadModal: false})}>
              {
                ext.map(e => (
                  <div key={e} >
                   <a href={"//localhost:8000"+BASE_PATH+"/download/"+e+"/" + uid} target="_blank">{"." + e.toUpperCase()}</a>
                  </div>
                ))
              }
            </Modal>
          )
        }
      </div>
    )
  }
}