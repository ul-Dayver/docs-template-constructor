import React from 'react'
import Text from "../text"
import {Map} from 'immutable'

const Datatypes = require('../../datatype')
const getFild = (datatype) => {
  const type = datatype.ucfirst()
  return Datatypes[type] || Datatypes.Varchar
}

export default class Cell extends React.Component {
  constructor(props) {
    super(props)
    
    const {cell, onChangeCell, onMouseMove, padding} = props
    const {x, y} = cell.getPosition()
    this.handleChange = (name, value) => onChangeCell({y, index: this.props.index, x}, value)
    this.handleMouseMove = event => onMouseMove(event, {y, index: this.props.index})
    
    this.spanProps = Map(cell.getSpan()).filter(v => !!v).mapEntries(([k, v]) => [k + 'Span', v]).toJS()
    
    const borderSize = cell.getBorder('size')
    this.className = 'border'

    if (borderSize.every(b=> !!b)) this.className += ' border-dark'
    else if (!borderSize.every(b=> !b)) {
      borderSize.forEach((size, name) => {
        if (size) this.className += ' border-'+name+'-dark'
      })
    }
    this.Fild = undefined
    this.onClick = undefined
    if (cell.isEmptyContent()) {
      const usefulness = cell.getUsefulness()
      this.Fild = getFild(usefulness ? props.block.datatype.get(usefulness.get('datatype')).get('name') : 'text')
      this.onClick = () => {
        const {block, index} = this.props
        this.refs[block.id+'-'+y+':'+index+':'+x].focus()
      }
    }

    this.style = {width: cell.getWidth() ? cell.getWidth() + '%' : 'auto', padding}
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.cell.isEmptyContent() || (nextProps.userValue !== this.props.userValue || nextProps.index !== this.props.index)
  }

  render() {
    const {cell, block, userValue, index} = this.props
    const {x, y} = cell.getPosition()
    const {style, className, spanProps, Fild, handleMouseMove, handleChange} = this
    let rend
    if (!Fild) {
      rend = (<Text {...Object.assign({}, block, {state: cell, id: [block.id, y +':'+ x]})} />)
    } else {
      const id = block.id+'-'+y+':'+index+':'+x
      rend =(<Fild ref={id} id={id} value={userValue || ""} onChange={handleChange} undecor={true} width="100%"/>) 
    }
    
    return (
      <td className={className} style={style} {...spanProps} onMouseMove={handleMouseMove} onClick={this.onClick}>{rend}</td>
    )
  }
}