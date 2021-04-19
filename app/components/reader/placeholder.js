import React from "react"
import ViewingIf from "./viewingif";
import {Popover} from "../common"
import {closest, getMouseEventPosition, Offset, getWindowScrollTop, getWindowHeight, VirtualPopoverReference} from "../layouts/Helpers"

const Datatypes = require('../datatype')
const getFild = (datatype) => {
  const type = datatype.ucfirst()
  return Datatypes[type] || Datatypes.Varchar
}

const lineHeight = 21

let setListenerTimer = undefined
let popover = undefined

const onWindowClick = event => {
  if (popover) {
    let clst = closest(event.target, '.popover')
    if (clst && clst === popover.getElement()) return;
    dropPopover()
  }
}

const dropPopover = (fast) => {
  clearTimeout(setListenerTimer)
  window.removeEventListener('scroll', dropPopover)
  window.removeEventListener('click', onWindowClick)
  if (popover) {
    if (fast) {
      popover.destroy()
    } else {
      popover.hide()
    }
  }
  popover = undefined
}

export default class PlaceHolder extends ViewingIf {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = (name, value) => this.props.onChangePlaceholder(this.path, value)

    const {contentState, entityKey, id} = this.props
    const {name, datatype} = contentState.getEntity(entityKey).getData()
    this.path = Array.isArray(id) ? id : [id]
    
    contentState.getBlockMap().find(
      (block, bId) => {
        let offset = block.getCharacterList().findIndex(char => char.getEntity() === entityKey)
        if (offset >= 0) {
          this.path.push(bId, offset+'')
          return true
        }
        return false
      }
    )
    
    const Fild = getFild(this.props.datatype.get(datatype).get('name'))
    this.EditForm = () => (
      <form onSubmit={this.handleSubmit}>
        <Fild id={id + entityKey} label={name} defaultValue={this.props.placeholders.getIn(this.path) || ""} onChange={this.handleChange} icon={false} autoFocus={true} withcontainer={true}/>
      </form>
    )
  }

  componentWillUnmount() {
    dropPopover()
  }

  handleSubmit(event) {
    event.preventDefault()
    dropPopover()
    event.stopPropagation()
    return false
  }

  handleClick(event) {
    event.preventDefault()
    
    dropPopover(true)

    const mousePosition = getMouseEventPosition(event)
    const offsetTarget = Offset(event.target)
    
    let top = (offsetTarget.top + (mousePosition.top > offsetTarget.top ? Math.ceil((mousePosition.top - offsetTarget.top) / lineHeight) * lineHeight : lineHeight)) - lineHeight/3
    top = top - getWindowScrollTop()
    
    let windowHeight = getWindowHeight()
    let placement = "bottom"
    
    if (top + 100 > windowHeight) {
      placement = "top"
    }

    popover = new Popover({
      placement,
      host: new VirtualPopoverReference({left: mousePosition.left, top, width: 6, height: lineHeight}),//event.target,
      children: this.EditForm()
    })
    popover.show()
    //event.stopPropagation()

    setListenerTimer = setTimeout(() => {
      window.addEventListener('click', onWindowClick)
      window.addEventListener('scroll', dropPopover)
    }, 100)
    return false
  }

  render() {
    const {contentState ,entityKey, placeholders, questionnaire, children} = this.props
    
    let condition = contentState.getEntity(entityKey).getData().condition
    let show = true
    let className="text-primary"
    if (condition) {
      className += " bg-highlight"
      show = this.isVisible.call(questionnaire, condition)
    }

    if (!show) return null

    let value = placeholders.getIn(this.path)

    return <span className={className} onClick={this.handleClick}>{value || children}</span>
  }
}