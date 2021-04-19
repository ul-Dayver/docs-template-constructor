import React from 'react'
import createBlockStyle from './utils/createBlockStyle'

const headLinesType = [
  {blockType: 'unstyled', children: (<span>Обычный текст</span>), noWrap:1},
  {blockType: 'header-one', children: (<span className="h1 text-nowrap">Заголовок 1</span>), noWrap:1},
  {blockType: 'header-two', children: (<span className="h2">Заголовок 2</span>), noWrap:1},
  {blockType: 'header-three', children: (<span className="h3">Заголовок 3</span>), noWrap:1}
]
  
const headLineButtons = headLinesType.map(hl => createBlockStyle(hl))
const button = "dropdown-item"

export default class HeadlinesButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {opened: false}
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
    let label = headLinesType[0].children.props.children
      
    if (this.props.getEditorState) {
      const editorState = this.props.getEditorState()
      const blockType = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType()
  
      const type = headLinesType.find((h) => h.blockType === blockType)
      if (type) {
        label = type.children.props.children
      }
    }
    const props = Object.assign({}, this.props, {theme: {button, active: this.props.theme.active}})
    return (
      <div className="btn-group m-1" onMouseDown={this.onMouseDown}>
        <button onClick={this.onClick} className='btn btn-white border-0 dropdown-toggle' type="button">
          <span className="dropdown-text-label m-r-xs">{label}</span>
        </button>
        <div className={"dropdown-menu" + (this.state.opened ? " show" : '')}>
          {headLineButtons.map((Button, i) => <Button key={i} {...props} />)}
        </div>
      </div>
    )
  }
}