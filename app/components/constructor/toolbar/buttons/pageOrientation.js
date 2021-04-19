import React from 'react'
import unionClassNames from 'union-class-names'
import {getAttr} from '../../../layouts/Helpers'

const Child = [{name: 'Книжная', icon:'file-image-o'}, {name:'Альбомная', icon: "picture-o"}]

export default class pageOrientation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {opened: false}
    this.toggleStyle = (event) => {
      !!event && event.preventDefault();
      const orientation = getAttr(event.currentTarget, 'data-key')
      this.props.constructor.setOrientationPage(orientation)
    }
    this.hasClick = false
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick)
  }
      
  onWindowClick = () => {
    if (!this.hasClick) this.setState({opened: false})
    this.hasClick = false
  }
  
  onMouseDown = (event) => event.preventDefault()
  
  onClick = (event) => {
    event.preventDefault();
    this.hasClick = true
    this.setState({opened: !this.state.opened})
  }
  
  componentDidUpdate() {
    if (this.state.opened) {
      window.addEventListener('click', this.onWindowClick)
    } else {
      window.removeEventListener('click', this.onWindowClick)
    }
  }

  render() {
    const {theme, getEditorState} = this.props
    const orientationPage = this.props.constructor.getOrientationPage()
    
    const active = !getEditorState || orientationPage === undefined ? 0 : (orientationPage.state.hasLandscape() ? 1 : 0)
    const themeMenu = "dropdown-item"
    return(
      <div className="btn-group m-1" onMouseDown={this.onMouseDown}>
        <button onClick={this.onClick} className='btn btn-white border-0 dropdown-toggle' disabled={!getEditorState}>
          <span className="dropdown-text-label m-r-xs">
            {
              !getEditorState
              ? 'Cтраница'
              : (
                <span>
                  <i className={"fa fa-"+Child[active].icon+" m-r-sm"}></i>
                  {Child[active].name}
                </span>
              )
            }
          </span>
        </button>
        <div className={"dropdown-menu" + (this.state.opened ? " show" : '')}>
          {
            Child.map(
              (item, key) => (
                <a key={key} data-key={key} 
                  className={(active === key ? unionClassNames(themeMenu, theme.active) : themeMenu) + " text-nowrap"}
                  onClick={this.toggleStyle}
                  href="#"
                  >
                    <i className={"fa fa-"+item.icon+" m-r-sm"}></i>
                    <span>{item.name}</span>
                </a>
              )
            )
          }
        </div>
      </div>
    )
  }
}