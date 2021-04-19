import React from 'react'
import Model from './model'
import Autosize from "autosize";

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      edited: !props.data.description.length
    }
    
    this.handleChangeDescription = e => this.props.onChange(
      this.props.index,
      Object.assign({}, this.props.data, {description: e.target.value})
    )
    this.handleChangeChildren = this.handleChangeChildren.bind(this)
    this.onWindowClick = this.onWindowClick.bind(this)
    this.handleDelete = () => this.props.onChange(this.props.index)
    this.addChild = () => {
      let {children} = this.props.data
      children.push(new Model())
      this.props.onChange(this.props.index, Object.assign({}, this.props.data, {children}))
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick)
  }
      
  onWindowClick(event) {
    if (event.target !== this.refs.self && event.target.parentNode !== this.refs.self) {
      this.setState({edited: false}, () => {
        this.props.onChange(
          this.props.index, 
          Object.assign({}, this.props.data, {
            description: this.props.data.description.trim()
          })
        )
      })
    }
  }
  
  componentDidUpdate() {
    if (this.state.edited && this.props.data.description.trim().length) {
      window.addEventListener('click', this.onWindowClick)
      Autosize(this.refs['textarea'])
      this.refs['textarea'].focus()
    } else {
      window.removeEventListener('click', this.onWindowClick)
    }
  }

  handleChangeChildren(index, data) {
    let p = this.props
    let children = [...p.data.children]
    if (data) {
      children.splice(index,1, data)
    } else {
      children.splice(index, 1)
    }
    p.onChange(p.index, Object.assign({}, p.data, {children}))
  }

  render() {
    const {parent, data} = this.props
    const {description, children} = data
    
    const withChild = children && children.length
    
    return (
      <div className={withChild ? "with-child" : ""}>
        <div className="media">
          <div className="media-left">
            <div className={(!!parent ? "iradio_square-green" : "icheckbox_square-green") + " checked disabled"}></div>
          </div>
          <div className="media-body" ref="self" onClick={() => {!this.state.edited && this.setState({edited: true})}}>
            {
              !this.state.edited
                ? description
                : (<textarea rows="1" ref="textarea" placeholder="Укажите вариант" value={description} onChange={this.handleChangeDescription}></textarea>)
            }
          </div>
          <div className="media-right d-flex justify-content-end">
            {
              withChild && (
                <button onClick={this.addChild} className="btn btn-link" title="добавить"><i className="fa fa-plus"></i></button>
              )
            }
            {
              (!parent || parent && parent.children.length > 2) && (
                <button onClick={this.handleDelete} className="btn btn-link" title="убрать"><i className="fa fa-trash-o"></i></button>
              )
            }
          </div>
        </div>
        {
          withChild && (
            <ul className="list-group list-group-flush">
              {
                children.map(
                  (item, i) => (
                    <li key={item.key} className="list-group-item">
                      <Item data={item} index={i} parent={data} onChange={this.handleChangeChildren}/>
                    </li>
                  )
                )
              }
            </ul>
          )
        }
      </div>
    )
  }
}