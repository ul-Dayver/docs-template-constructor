import {Map} from 'immutable'

const getBorderSize = (table, selection, borderName) => {
  const range = selection.getRange()
  if (!range) return false
  const rows = table.getRows()
  const {start, end} = range
  if (borderName == 'top' || borderName == 'bottom') {
    let {y} = (borderName == 'top'? start : end)
    for (let x = start.x; x <= end.x; x++) {
      let cell = rows.getIn([y, x])
      if (!cell) {
        for (let nearest = y; nearest >= start.y; nearest--) {
          if (rows.hasIn([nearest, x])){
            cell = rows.getIn([nearest, x])
            break
          }
        }
      }
      
      if (cell && !cell.getBorder('size', borderName)) return 0
    }
  } else if (borderName == 'left' || borderName == 'right') {
    let {x} = (borderName == 'left' ? start : end)
    for (let y = start.y; y <= end.y; y++) {
      let cell = rows.getIn([y, x])
      if (!cell) {
        for (let nearest = x; nearest >= start.x; nearest--)
          if (rows.hasIn([y, nearest])){
            cell = rows.getIn([y, nearest])
            break
          }
      }
      if (cell && !cell.getBorder('size', borderName)) return 0
    }
  } else if (borderName == 'all' || borderName == 'none') {
    if (selection.hasOnly()) return 0
    for (let y = start.y; y <= end.y; y++) {
      for (let x = start.x; x <= end.x; x++) {
        const cell = rows.getIn([y, x])
        if (cell && cell.getBorder('size').findKey(val => borderName == 'all' ? !val : !!val)) return 0
      }
    }
  } else if (borderName == 'outer') {
    if(['top','right','bottom','left'].find(name => !getBorderSize(table, selection, name))) return 0
  } else if (borderName == 'inner') {
    if (selection.hasOnly()) return 0
    for (let y = start.y; y <= end.y; y++) {
      for (let x = start.x; x <= end.x; x++) {
        const cell = rows.getIn([y, x])
        if (cell && cell.getBorder('size').findKey(
          (val, name) => !(name == 'top' && y == start.y) &&
            !(name == 'bottom' && y == end.y) &&
            !(name == 'left' && x == start.x) &&
            !(name == 'right' && x == end.x) &&
            !val
        )) return 0
      }
    }
  } else throw new RangeError("borderName must be 'top', 'bottom', 'left' or 'right'") 
  
  return 1
}

exports.getBorderSize = getBorderSize
exports.canSplit = (table, selection) => {
  const range = selection.getRange()
  const rows = table.getRows()
  if (!range || !selection.hasOnly() || !rows.hasIn([range.start.y, range.start.x])) return false
  
  const {col, row} = rows.getIn([range.start.y, range.start.x]).getSpan()
  return col > 0 || row > 0
}
exports.canMerge = (table, selection) => {
  const range = selection.getRange()
  const rows = table.getRows()
  if (!range || selection.hasOnly()) return false
  let mask = Map()

  for (let y = range.start.y; y <= range.end.y; y++) {
    for (let x = range.start.x; x <= range.end.x; x++) {
      if (rows.hasIn([y, x])) {
        let cell = rows.getIn([y, x])
        let span = cell.getSpan()
        if (span.row) {
          let bottomBorder = y + (span.row - 1)
          if (bottomBorder > range.end.y) return false
          for(let i=0; i < span.row; i++) mask = mask.setIn([y+i , x], true)
        }

        if (span.col) {
          x += (span.col - 1)
          if (x > range.end.x || x < range.start.x) return false
        }
      } else if(!mask.hasIn([y, x])) {
        return false
      }
    }
  }

  return true
}
exports.getUsefulness = (table, selection) => {
  if (selection.hasOnly()) {
    let {x, y} = selection.getStart()
    return table.getRows().hasIn([y, x]) && table.getRows().getIn([y, x]).getUsefulness()
  }
  const range = selection.getRange()
  const rows = table.getRows()
  let lastUsefulness
  for (let y = range.start.y; y <= range.end.y; y++) {
    for (let x = range.start.x; x <= range.end.x; x++) {
      if (rows.hasIn([y, x])) {
        let crrUsefulness = rows.getIn([y, x]).getUsefulness()
        if (!lastUsefulness) lastUsefulness = crrUsefulness
        else if (!lastUsefulness.equals(crrUsefulness)) return false
      }
    }
  }
  
  return lastUsefulness
}