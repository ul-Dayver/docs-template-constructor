import Table from "./index"

export default (table, {change, tableWidth, cols, index}) => {
  let prop = table.getProperties().toJS()

  if (index == cols.length-1 && change > 0) {
    cols[index] -= change
    cols[index-1] += change
  } else {
    if (change < 0) {
      if (cols[index-1] + change <= 0) {
        let width = cols[index-1]
        for (let i=index-2;i>=0;i--) {
          width += cols[i]
          if (width + change > index-i) {
            Math.floor(width + change).toRangeArray(index-i).forEach(
              (w, i) => cols[index-(i+1)] = w
            )
            break
          }
        }
      } else {
        cols[index-1] += change
      }
      cols[index] -= change
    } else {
      if (cols[index] - change <= 0) {
        let width = cols[index]
        for (let i=index+1;i< cols.length;i++) {
          width += cols[i]
          if (width - change > (i - index) + 1) {
            Math.floor(width - change).toRangeArray((i - index) + 1).forEach(
              (w, i) => cols[index+i] = w
            )
            break
          }
        }
      } else {
        cols[index] -= change
      }
      cols[index-1] += change
    }
  }
  
  let columns = cols.map(width => Math.round((width*100)/tableWidth))
  const error = 100 - columns.reduce((a,c) => a+c, 0)
  if (error > 0) {
    let i = columns.indexOf(Math.max(...columns))
    columns[i] -= error
  } else {
    let i = columns.indexOf(Math.min(...columns))
    columns[i] += error
  }
  prop.columns = columns

  return new Table({cells: table.getRows(), prop})
}