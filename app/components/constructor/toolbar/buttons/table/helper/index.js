import React from 'react'
import Cell from './cell'

const MaxRow = 10
const MaxCol = 10

export default class Halper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gridValue: {x: 0, y: 0},
      showProp: false
    }
    this.selectValueGrid = (x, y) => this.setState({gridValue: {x, y}})
    this.setValue = () => {
      const {x, y} = this.state.gridValue
      this.props.onSelect(x, y)
    }
  }

  render() {
    let grid = []
    for (let y = 1; y<=MaxRow; y++) {
      let row = []
      for (let x = 1; x<=MaxCol; x++) {
        row.push(<Cell key={x+':'+y} x={x} y={y} active={x <= this.state.gridValue.x && y <= this.state.gridValue.y} onSelect={this.selectValueGrid}/>)
      }
      grid.push(row)
    }
    
    return (
      <div className="table-insert-helper-wrap animated fadeIn">
        <div className="table-insert-helper">
          <div className="table-insert-helper-head">
            {
              this.state.gridValue.x && this.state.gridValue.y
              ? 'Таблица ' + this.state.gridValue.x + 'x' + this.state.gridValue.y
              : 'Вставка таблицы'
            }
          </div>
          <div onMouseLeave={() => this.selectValueGrid(0, 0)} className="table-insert-helper-grid" onClick={this.setValue}>
            {grid.map((row, i) => (<div key={i} className="table-insert-helper-grid-row">{row}</div>))}
          </div>
        </div>
      </div>
    )
  }
}