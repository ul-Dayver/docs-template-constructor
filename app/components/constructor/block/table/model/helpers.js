exports.getWidthColumnsFromInsert = (table, insX) => {
  let columns = table.getProperties('columns')
  let rangeWidth = (100).toRangeArray(columns.length + 1)
  let oldRangeWidth = (100).toRangeArray(columns.length)
  
  let fraction = 0
  for (let i=0; i<rangeWidth.length; i++) {
    let x = i+1
    if (insX !== x) {
      let index = x>insX ? i-1 : i
      let width = (columns[index] / oldRangeWidth[index]) * rangeWidth[i]
      rangeWidth[i] = Math.trunc(width)
      fraction += width - rangeWidth[i]
      let plus = 0
      if (fraction > 0) {
        plus = Math.trunc(fraction)
        fraction -= plus
      }
      rangeWidth[i] += plus
    }
  }
  if (Math.round(fraction)) rangeWidth[rangeWidth.length-1] += 1

  return rangeWidth
}

exports.getWidthColumnsFromDelete = (table, startX, endX) => {

  let columns = table.getProperties('columns')
  let oldRangeWidth = (100).toRangeArray(columns.length)
  let rangeWidth = (100).toRangeArray(columns.length - ((endX - startX) + 1))
  let newWidth = []
  
  for(let i=0; i<columns.length; i++) {
    let x = i+1
    if (!(x >= startX && x <= endX)) {
      newWidth.push(Math.round((columns[i] / oldRangeWidth[i]) * rangeWidth[newWidth.length]))
    }
  }

  return newWidth
}