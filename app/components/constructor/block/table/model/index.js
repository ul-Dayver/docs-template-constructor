import {Map} from 'immutable'
import Cell from './cell'
import Merge from "./merge"
import Split from "./split"
import DeleteRows from "./delete-rows"
import DeleteColumns from "./delete-columns"
import InsertRowBefore from "./insert-row-before"
import InsertRowAfter from "./insert-row-after"
import InsertColumnBefore from "./insert-column-before"
import InsertColumnAfter from "./insert-column-after"
import ChangeBorderSize from "./change-border-size"
import SetWidthColumn from "./setwidthcolumn"
import SetUsefulness from './setusefulness'
import {getBorderSize} from '../contextmenu/validators'
import Selection from './selection'

const sort = (rows) => rows.map(row => row.sort((a,b) => {
  a = a.getPosition('x')
  b = b.getPosition('x')
  return a!=b ? (a > b ? 1 : -1) : 0
})).sort((a, b) => {
  a = a.first().getPosition('y')
  b = b.first().getPosition('y')
  return a!=b ? (a > b ? 1 : -1) : 0
})

const equals = (cells, refTable) => cells.every(
  row => row.every(
    cell => {
      const {y, x} = cell.getPosition()
      return refTable.hasCell(x, y) && cell.equals(refTable.getRows().getIn([y, x]))
    }
  )
)

const Do = function(method, args) {
  let table = args[0]
  let _args = [table]
  _args = _args.concat(args.slice(1))
  const cells = method.apply(null, _args)
  return cells instanceof Table ? cells : cells.size ? new Table({cells, prop: table.getProperties().toJS()}) : null
}

export default class Table {
  constructor(config) {
    let _cells = Map()
    let properties = Map(
      Object.assign({
        borderSize: 1,
        cellMargin: {twip: {top: 0, left: 107, right: 107, bottom: 0}, px: {top: 0, left: 7, right: 7, bottom: 0}}
      }, JSON.parse(JSON.stringify(config.prop || {})))
    )
    this.size = 0
    let _columns = 0

    if (config.cells instanceof Map) {
      _cells = sort(config.cells)
      this.size = _cells.reduce((acc, cur) => acc + cur.size, 0)
    } else {
      _columns = config.columns
      let width = (100).toRangeArray(_columns)
      properties = properties.set('columns', width.slice())
      for (let r=0; r<config.rows; r++) {
        for (let c=0; c<config.columns; c++) {
          let position = Map({y: r+1,x: c+1})
          let bs = properties.get('borderSize')
          let border = {size: {top: bs,right: bs,bottom: bs, left: bs}}
          _cells = _cells.setIn([position.get('y'), position.get('x')], new Cell({position, border, width: width[c]}))
          this.size += 1
        }
      }
    }
    
    this.getCountColumns = () => _cells.first().reduce((acc, cur) => acc + (cur.getSpan('col') || 1), 0)
    this.getProperties = (key) => key ? properties.get(key) : properties
    this.getRows = () => Map(_cells)
    this.first = () => _cells.first().first()
    this.last = () => _cells.last().last()
    this.getNextCellInRow = cell => _cells.get(cell.getPosition('y')).find((_cell, x) => x > cell.getPosition('x'))
    this.getPrevCellInRow = cell => _cells.get(cell.getPosition('y')).findLast((_cell, x) => x < cell.getPosition('x'))
    this.toRaw = () => {return {
      properties: properties.toJS(),
      cells: _cells.map(row => row.map(cell => cell.toRaw()).toList().toArray()).toList().toArray()
    }}
    this.hasCell = (x, y) => _cells.hasIn([y,x])
    this.equals = (table) => 
      Map(table.getProperties()).equals(properties) &&
      equals(_cells, table) && equals(table.getRows(), this)
  }

  static setProperties(table, prop) {
    return new Table({cells: table.getRows(), prop})
  }

  static setCell(table, _cell) {
    const cell = new Cell(_cell)
    const {x, y} = cell.getPosition()
    return new Table({cells: table.getRows().setIn([y,x], cell), prop: table.getProperties().toJS()})
  }

  static mergeCells(...args) {return Do(Merge, args)}
  static splitCell(...args) {return Do(Split, args)}
  static deleteRows(...args) {return Do(DeleteRows, args)}
  static deleteColums(...args) {return Do(DeleteColumns, args)}
  static insertRowBefore(...args) {return Do(InsertRowBefore, args)}
  static insertRowAfter(...args) {return Do(InsertRowAfter, args)}
  static insertColumnBefore(...args) {return Do(InsertColumnBefore, args)}
  static insertColumnAfter(...args) {return Do(InsertColumnAfter, args)}
  static setBorderSize(...args) {
    let table = Do(ChangeBorderSize, args)
    let borderSize = null
    let range = (new Selection(table.first())).include(table.last())
    
    if (getBorderSize(table,range,'none')){
      borderSize = 0
    } else if (getBorderSize(table,range,'all')) {
      borderSize = 1
    }
    if (borderSize !== null) 
      table = new Table({cells: table.getRows(), prop: Object.assign(table.getProperties().toJS(), {borderSize})})
    return table
  }
  static setWidthColumn(table, props) {return SetWidthColumn(table, props)}
  static setUsefulness(...args) {return Do(SetUsefulness, args)}

  static fromRaw(table) {
    let cells = Map()
    let mask = Map()
    let position = {y: 1, x: 1}
    let prop = table.properties
    if (!prop.columns) prop.columns = []
    else if (!Array.isArray(prop.columns)) {
      prop.columns = Object.values(prop.columns)
    }
    table.cells.forEach(
      line => {
        line.forEach(
          raw => {
            while (mask.hasIn([position.y, position.x])) {
              let nextRight = position.x + 1
              if (position.y > 1 && mask.size > 0 && mask.get(1).size < nextRight) {
                position = {y: position.y+1, x: 1}
              } else {
                position = Object.assign(position, {x: nextRight})
              }
            }

            const cell = Cell.fromRaw(raw, position)
            cells = cells.setIn([position.y, position.x], cell)
  
            const span = cell.getSpan()
            let r=0
            do {
              let c=0
              do {
                mask = mask.setIn([position.y + r, position.x + c], true)
              } while (++c < span.col)
            } while (++r < span.row)
          }
        )

        position = {y: position.y+1, x: 1}
      }
    )

    return new Table({cells, prop})
  }
}