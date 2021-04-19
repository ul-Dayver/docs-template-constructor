import React from 'react'
import {Map} from 'immutable'
import InlineSVG from 'svg-inline-react'

const pngImgs = Map(['column','column-delete','column-left','column-right','row','row-delete','row-down','row-up','cells-merge','cells-unmerge']
.map(name => {
  const key = 'table-'+name
  const data = require('./'+key+'-24.png')
  return [key, data]
}))

const svgImg = Map(['top','bottom',"left","right","none","all", "outer", "inner"]
.map(name => ['border-'+name, require('./border-'+name+'.svg')]))

export default (props) => {
  const {src} = props
  switch (true) {
    case pngImgs.has(src):
      return (<img src={pngImgs.get(src)}/>)
    case svgImg.has(src):
      return (<InlineSVG {...Object.assign({},props, {src: svgImg.get(src)})}/>)
  }
  return false
}
/*

class IconBorder extends React.Component{
  constructor(prop){
    super(prop)
  }

  render() {
    const {name} = this.props
    const size = this.props.size || 20
    const style = {
      width: size + 'px',
      height: size + 'px',
      border: '2px ' + (name == 'outer' || name == 'all' ? 'solid #343a40' : 'dotted #dee2e6')
    }

    if (name == 'left' || name == 'right' || name == 'top' || name == 'bottom')
    style['border'+name.ucfirst()] = '2px solid #343a40'
    
    const border = '1px ' + (name == 'inner' || name == 'all' ? 'solid #343a40' : 'dotted #dee2e6')
    const subsize = ((size/2)-1) + 'px'
    const innerBorderRight = {width: subsize, borderRight: border}
    const innerBorderLeft = {width: subsize, borderLeft: border}

    return (
      <div className="d-flex align-items-center" style={{padding: '3px 0 1px'}}>
        <div className="d-flex flex-column" style={style}>
          <div className="d-flex flex-row" style={{height: subsize, borderBottom: border}}>
            <div className="p-1" style={innerBorderRight}></div>
            <div className="p-1" style={innerBorderLeft}></div>
          </div>
          <div className="d-flex flex-row" style={{height: subsize, borderTop: border}}>
            <div className="p-1" style={innerBorderRight}></div>
            <div className="p-1" style={innerBorderLeft}></div>
          </div>
        </div>
      </div>
    )
  }
}

exports.IconBorder = IconBorder
*/