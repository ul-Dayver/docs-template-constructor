import React from 'react'
import { Link } from 'react-router-dom'

class Document extends React.Component {
  constructor(props) {
    super(props)
    this.handleDel = () => this.props.onDelete(this.props.uid)
  }
  render () {
    const {name, uid} = this.props
    return (
      <div className="col-sm-2 text-center">
        <Link type="button" className="btn btn-light btn-block" to={"/r/"+uid}>
          <i className="py-5 d-inline-block"></i>
        </Link>
        <p>{name}</p>
        <button type="button" className="btn btn-default btn-circle" onClick={this.handleDel}>
          <i className="fa fa-trash"></i>
        </button>
      </div>
    )
  }
}

export default ({documents}) => (
  <div className="container">
    <div className="ibox">
        <div className="ibox-title"><h5>Мои документы</h5></div>
        <div className="ibox-content">
          <div className="row" style={{overflowX: "scroll"}}>
            {
              documents.Collection.map(
                (document, id) => (<Document {...document} key={"documents_list-template-"+id} onDelete={documents.delete}/>)
              ).toList().toArray()
            }
          </div>
        </div>
    </div>
  </div>
)