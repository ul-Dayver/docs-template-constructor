import { configure } from 'enzyme'
import Adapter from "enzyme-adapter-react-16"

configure({ adapter: new Adapter() })

import {Map} from 'immutable'
import {EditorState, Modifier} from 'draft-js'
import polyfill from 'config/polyfill'
import Table from 'components/constructor/block/table/model'

const SIZE = {columns: 10, rows: 10}

const getCell = (table, x, y) => table.getRows().getIn([y,x])
//const getTextCell = (table, x, y) => getCell(table, x, y).getEditorState().getCurrentContent().getPlainText()
const tableTest = (table, size, exception) => {

  for(let y = 1; y <= size.y; y++) {
    for(let x = 1; x <= size.x; x++) {
      let cell = getCell(table, x, y)
      let currentText = cell ? cell.getEditorState().getCurrentContent().getPlainText() : undefined
      let span = cell ? cell.getSpan() : undefined
      if (!exception(cell, {x, y}, currentText, span)) {
        expect(cell).toBeDefined()
        expect(cell.getPosition('x')).toBe(x)
        expect(cell.getPosition('y')).toBe(y)
        //if (currentText !== Math.max(x, y) + '') console.log({x, y}, currentText)
        expect(currentText).toBe(Math.max(x, y) + '')
        expect(span).toEqual({col:0, row: 0})
      }
    }
  }

  let latsY = 0
  table.getRows().forEach(
    (row, y) => {
      expect(y).toBeGreaterThan(latsY)
      latsY = y
      let latsX = 0
      row.forEach(
        (cell, x) => {
          expect(x).toBeGreaterThan(latsX) 
          latsX = x
        }
      )
    }
  )
}

const createTable = () => {
  let testTable = new Table(SIZE)
  testTable.getRows().forEach(
    row => row.forEach(
      cell => {
        let {x, y} = cell.getPosition()
        let editorState = cell.getEditorState()
        let contentState = editorState.getCurrentContent()
        let text = Math.max(parseInt(x, 10), parseInt(y, 10)) + ''
        contentState = Modifier.insertText(contentState, editorState.getSelection(), text)
        editorState = EditorState.push(editorState, contentState,'insert-characters')

        testTable = Table.setCell(testTable, {
        position: Map({y, x}),
          editorState
        })
      }
    )
  )
  return testTable
}

describe('Table', () => {
  let testTable
  it('fromRaw', () => {
    testTable = Table.fromRaw({properties: {},cells:[[{"value":{"blocks":[{"key":"5pqovg","text":"1","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2hq8o0n","text":"2","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2k7k2vv","text":"3","type":"unstyled"}]}},{"value":{"blocks":[{"key":"ej06rk","text":"4","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1dnndhs","text":"5","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3sjr5v9","text":"6","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2rlvm75","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2r4jcf1","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1138uu8","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"17asf3k","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"ek1cg","text":"2","type":"unstyled"}]}},{"span":{"col":3,"row":4},"value":{"blocks":[{"key":"3o2ainn","text":"2","type":"unstyled"},{"key":"10s81m","text":"3","type":"unstyled"},{"key":"3o0goml","text":"4","type":"unstyled"},{"key":"1te2v88","text":"3","type":"unstyled"},{"key":"3nnerkf","text":"3","type":"unstyled"},{"key":"u0bm8k","text":"4","type":"unstyled"},{"key":"225do81","text":"4","type":"unstyled"},{"key":"2ul5agv","text":"4","type":"unstyled"},{"key":"7ovt1e","text":"4","type":"unstyled"},{"key":"eimjpm","text":"5","type":"unstyled"},{"key":"2litimv","text":"5","type":"unstyled"},{"key":"1050q6u","text":"5","type":"unstyled"}]}},{"value":{"blocks":[{"key":"bmth10","text":"5","type":"unstyled"}]}},{"span":{"col":2,"row":3},"value":{"blocks":[{"key":"23ucb61","text":"6","type":"unstyled"},{"key":"591r76","text":"7","type":"unstyled"},{"key":"pm8ui4","text":"6","type":"unstyled"},{"key":"37nnvnf","text":"7","type":"unstyled"},{"key":"1dshlji","text":"6","type":"unstyled"},{"key":"1bs1d58","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1q2d6uo","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1po2p8","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1mvl0u","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"epgvr8","text":"3","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1vodjr0","text":"5","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3bpddet","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"34f1e99","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"33b45qr","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"4vetpi","text":"4","type":"unstyled"}]}},{"value":{"blocks":[{"key":"bt8m76","text":"5","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1ca0n0k","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"g0qe58","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2mfb1mh","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"21vrre7","text":"5","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2cgvp85","text":"5","type":"unstyled"}]}},{"span":{"col":2,"row":2},"value":{"blocks":[{"key":"3p03k9v","text":"6","type":"unstyled"},{"key":"23dct6v","text":"7","type":"unstyled"},{"key":"spanuk","text":"6","type":"unstyled"},{"key":"1bes0hk","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"13ndi34","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2el7ra9","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"27enpv3","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"27nqotf","text":"6","type":"unstyled"}]}},{"span":{"col":3},"value":{"blocks":[{"key":"3tl1a4b","text":"6","type":"unstyled"},{"key":"3pm3g4t","text":"6","type":"unstyled"},{"key":"2qflsj9","text":"6","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3pmhdf9","text":"6","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2tpqimd","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"9hatri","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"qcp5mk","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"3shcf67","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1vot5r6","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1tobba2","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"151o9m8","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3mcoes1","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"4jff1o","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"ba09be","text":"7","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1o1hckk","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3cfubb9","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"21cuhi5","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"23bghbp","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"8o1lta","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"9q6lq8","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1d25qpu","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1vvd114","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3dl3ga7","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3qddttf","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1hdsigo","text":"8","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1g9lkfs","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"13c2jfg","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"1hculc4","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"lv8j36","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3o7qhvp","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"12h7a92","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1rih7e2","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"3rbt1l5","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"rgnh4u","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"pgd2f6","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1jl2oiu","text":"9","type":"unstyled"}]}},{"value":{"blocks":[{"key":"28rpi41","text":"10","type":"unstyled"}]}}],[{"value":{"blocks":[{"key":"jklums","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2rmheol","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"38lksrd","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"oulki4","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"hupc4c","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"1apnoju","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"dk80n4","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"m9quau","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"21964rl","text":"10","type":"unstyled"}]}},{"value":{"blocks":[{"key":"2bbl6bt","text":"10","type":"unstyled"}]}}]]})
    tableTest(testTable, {x: SIZE.columns, y: SIZE.rows}, (cell,{x, y}, currentText, span) => {
      switch (true) {
        case (x == 2 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4\n5\n5\n5')
          expect(span).toEqual({col:3, row: 4})
        return true
        case (x == 6 && y == 2) :
          expect(currentText).toBe('6\n7\n6\n7\n6\n7')
          expect(span).toEqual({col:2, row: 3})
        return true
        case (x == 2 && y == 6) :
          expect(currentText).toBe('6\n6\n6')
          expect(span).toEqual({col:3, row: 0})
        return true
        case (x == 6 && y == 5) :
          expect(currentText).toBe('6\n7\n6\n7')
          expect(span).toEqual({col:2, row: 2})
        return true
        case ((y>1 && y <7) && ((x>1 && x<5) || (x>5 && x<8))) :
          expect(cell).toBeUndefined()
        return true
        default: return false
      }
    })
    testTable = createTable()
  })
  it('MergeForPrepare', () => {
    testTable = Table.mergeCells(testTable, {x: 2, y:2}, {x: 4, y: 4})
    testTable = Table.mergeCells(testTable, {x: 7, y:3}, {x: 9, y: 6})
    tableTest(testTable, {x: SIZE.columns, y: SIZE.rows}, (cell,{x, y}, currentText, span) => {
      switch (true) {
        case (x == 2 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
          expect(span).toEqual({col:3, row: 3})
        return true
        case (x == 7 && y == 3) :
          expect(currentText).toBe('7\n8\n9\n7\n8\n9\n7\n8\n9\n7\n8\n9')
          expect(span).toEqual({col:3, row: 4})
        return true
        case ((x>1 && x<5 && y>1 && y <5) || (x>6 && x<10 && y>2 && y <7)) :
          expect(cell).toBeUndefined()
        return true
        default: return false
      }
    })

  })
  it('InsertRowBefore', () => {
    testTable = Table.insertRowBefore(testTable, 3)
    tableTest(testTable, {x: SIZE.columns, y: SIZE.rows+1}, (cell, {x, y}, currentText, span) => {
      switch (true) {
        case (x == 2 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
          expect(span).toEqual({col:3, row: 4})
        return true
        case (x == 7 && y == 4) :
          expect(currentText).toBe('7\n8\n9\n7\n8\n9\n7\n8\n9\n7\n8\n9')
          expect(span).toEqual({col:3, row: 4})
        return true
        case ((x>1 && x<5 && y>1 && y <6) || (x>6 && x<10 && y>3 && y <8)) :
          expect(cell).toBeUndefined()
        return true
        case (y>=3) :
          expect(currentText).toBe( y==3 ? '' : Math.max(x, y-1) + '')
        return true
        default: return false
      }
    })
    testTable = Table.deleteRows(testTable, 3, 3)
  })
  it('InsertRowAfter', () => {
    testTable = Table.insertRowAfter(testTable, SIZE.rows)
    expect(testTable.getRows().get(SIZE.rows+1).size).toBe(SIZE.columns)
    testTable = Table.deleteRows(testTable, SIZE.rows+1, SIZE.rows+1)

    let testTable2 = new Table({columns: 6, rows: 2})
    testTable2 = Table.mergeCells(testTable2, {x: 3, y:1}, {x: 4, y: 2})
    testTable2 = Table.insertRowAfter(testTable2, 2)
    expect(testTable2.getRows().get(3).size).toBe(4)
    expect(testTable2.getRows().getIn([1, 3]).getSpan('row')).toBe(3)

    testTable = Table.insertRowAfter(testTable, 3)
    expect(testTable.getRows().get(4).size).toBe(4)
    tableTest(testTable, {x: SIZE.columns, y: SIZE.rows+1}, (cell, {x, y}, currentText, span) => {
      switch (true) {
        case (x == 2 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
          expect(span).toEqual({col:3, row: 4})
        return true
        case (x == 7 && y == 3) :
          expect(currentText).toBe('7\n8\n9\n7\n8\n9\n7\n8\n9\n7\n8\n9')
          expect(span).toEqual({col:3, row: 5})
        return true
        case ((x>1 && x<5 && y>1 && y <6) || (x>6 && x<10 && y>2 && y <8)) :
          expect(cell).toBeUndefined()
        return true
        case (y>=4) :
          expect(currentText).toBe(y==4?'':Math.max(x, y-1) + '')
        return true
        default: return false
      }
    })
    testTable = Table.deleteRows(testTable, 4, 4)
  })
  it('Split', () => {
    testTable = Table.splitCell(testTable, 2, 2)
    testTable = Table.splitCell(testTable, 7, 3)
    tableTest(testTable, {x: SIZE.columns, y: SIZE.rows},(cell, {x, y}, currentText, span) => {
      switch (true) {
        case (x == 2 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
          expect(span).toEqual({col:0, row: 0})
        return true
        case (x == 7 && y == 3) :
          expect(currentText).toBe('7\n8\n9\n7\n8\n9\n7\n8\n9\n7\n8\n9')
          expect(span).toEqual({col:0, row: 0})
        return true
        case ((x>1 && x<5 && y>1 && y <5) || (x>6 && x<10 && y>2 && y <7)) :
          expect(currentText).toBe('')
        return true
        default: return false
      }
    })
    testTable = createTable()
  })
  it('InsertColumnBefore', () => {
    testTable = Table.mergeCells(testTable, {x: 2, y:2}, {x: 4, y: 4})
    testTable = Table.mergeCells(testTable, {x: 3, y:6}, {x: 5, y: 8})
    testTable = Table.insertColumnBefore(testTable, 3)
    tableTest(testTable, {x: SIZE.columns+1, y: SIZE.rows},(cell, {x, y}, currentText, span) => {
      switch (true) {
        case (x == 3 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
          expect(span).toEqual({col:3, row:3})
        return true
        case (x == 4 && y == 6) :
          expect(currentText).toBe('6\n6\n6\n7\n7\n7\n8\n8\n8')
          expect(span).toEqual({col:3, row:3})
        return true
        case ((x==3 && (y == 1 || y > 4)) || (x==2 && y > 1 && y <5)):
          expect(currentText).toBe('')
          return true
        case ((x>2 && x<6 && y>1 && y <5) || (x>3 && x<7 && y>5 && y <9)) :
          expect(currentText).toBeUndefined()
        return true
        case (x>3) :
          expect(currentText).toBe(Math.max(x-1, y) + '')
        return true
        default: return false
      }
    })
    testTable = createTable()
  })
  it('InsertColumnAfter', () => {
    testTable = Table.mergeCells(testTable, {x: 2, y:2}, {x: 4, y: 4})
    testTable = Table.mergeCells(testTable, {x: 3, y:6}, {x: 5, y: 8})
    testTable = Table.insertColumnAfter(testTable, 3)
    tableTest(testTable, {x: SIZE.columns+1, y: SIZE.rows},(cell, {x, y}, currentText, span) => {
      switch (true) {
        case (x == 3 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
          expect(span).toEqual({col:3, row:3})
        return true
        case (x == 4 && y == 6) :
          expect(currentText).toBe('6\n6\n6\n7\n7\n7\n8\n8\n8')
          expect(span).toEqual({col:3, row:3})
        return true
        case ((x==4 && (y == 1 || y == 5 || y>=9)) || (x==2 && y > 1 && y <5) || (x==3 && y > 5 && y <9)):
          expect(currentText).toBe('')
          return true
        case ((x>2 && x<6 && y>1 && y <5) || (x>3 && x<7 && y>5 && y <9)) :
          expect(currentText).toBeUndefined()
        return true
        case (x>4) :
          expect(currentText).toBe(Math.max(x-1, y) + '')
        return true
        default: return false
      }
    })
    testTable = createTable()
  })
  it('DeleteRows', () => {
    testTable = Table.mergeCells(testTable, {x: 2, y:2}, {x: 4, y: 4})
    testTable = Table.mergeCells(testTable, {x: 3, y:6}, {x: 5, y: 8})
    testTable = Table.mergeCells(testTable, {x: 7, y:4}, {x: 9, y: 6})
    testTable = Table.deleteRows(testTable, 3, 6)
    tableTest(testTable, {x: SIZE.columns, y: SIZE.rows-4},(cell, {x, y}, currentText, span) => {
      switch (true) {
        case (x == 2 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
          expect(span).toEqual({col:3, row:0})
        return true
        case (x == 3 && y == 3) :
          expect(currentText).toBe('')
          expect(span).toEqual({col:3, row:2})
        return true
        case ((x>1 && x <5 && y==2) || (x > 2 && x < 6 && y > 2 && y < 5)) :
          expect(currentText).toBeUndefined()
        return true
        case (y>2) :
          expect(currentText).toBe(Math.max(x, y+4) + '')
        return true
        default: return false
      }
    })
    testTable = createTable()
  })
  it('DeleteColumns', () => {
    testTable = Table.mergeCells(testTable, {x: 2, y:2}, {x: 4, y: 4})
    testTable = Table.mergeCells(testTable, {x: 3, y:6}, {x: 5, y: 8})
    testTable = Table.mergeCells(testTable, {x: 7, y:4}, {x: 9, y: 6})
    testTable = Table.deleteColums(testTable, 3, 7)
    tableTest(testTable,{x: SIZE.columns-5, y: SIZE.rows},(cell, {x, y}, currentText, span) => {
      switch (true) {
        case (x == 2 && y == 2) :
          expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
          expect(span).toEqual({col:0, row:3})
        return true
        case (x == 3 && y == 4) :
          expect(currentText).toBe('')
          expect(span).toEqual({col:2, row:3})
        return true
        case ((y>2 && y <5 && x == 2) || (x>=3 && y>=4 && x < 5 && y<7)) :
          expect(currentText).toBeUndefined()
        return true
        case (x>2) :
          expect(currentText).toBe(Math.max(x+5, y) + '')
        return true
        default: return false
      }
    })
  })
  it('toRaw', () => {
    let raw = testTable.toRaw()
    raw.cells.forEach(
      (row, _y) => {
        const y = _y + 1
        row.forEach(
          (cell, _x) => {
            const x = _x+1
            const {span, value} = cell
            const currentText = value.blocks.map(b=> b.text).join('\n')
            switch (true) {
              case (x == row.length):
                expect(currentText).toBe(raw.cells.length + '')
                break
              case (x == 2 && y == 2) :
                expect(currentText).toBe('2\n3\n4\n3\n3\n4\n4\n4\n4')
                expect(span).toEqual({row:3})
              break
              case (x == 2 && y == 4) :
                expect(currentText).toBe('')
                expect(span).toEqual({col:2, row:3})
              break
              case (y < 9 && row.length >= 4 && x >= row.length - 2) :
                expect(currentText).toBe((raw.cells.length - (row.length - x)) + '')
              break
              default:
                expect(currentText).toBe(Math.max(x, y) + '')
                expect(span).toBeUndefined()
              break
            }
          }
        )
      } 
    )
  })
  it ('setWidthColumn',() => {
    testTable = createTable()
    let columns = testTable.getProperties('columns')
    expect(columns.length).toBe(SIZE.columns)
    
    let change = -20
    const tableWidth = 690
    const cols = columns.map(w => tableWidth * w /100)
    let index = 5
    testTable = Table.setWidthColumn(testTable, {change, cols, index, tableWidth})
    change = 20
    index = 6
    testTable = Table.setWidthColumn(testTable, {change, cols, index, tableWidth})
    columns = testTable.getProperties('columns')
    let normal = 100 / SIZE.columns
    columns.forEach(
      (w, i) => {
        expect(w).toBe(
          i == 4 || i == 6 ? normal - 3 : i == 5 ? normal + 6 : normal
        )
      }
    )
    testTable = Table.mergeCells(testTable, {x: 9, y:1}, {x: 10, y: 10})
    testTable = Table.insertColumnBefore(testTable, 5)
    expect(
      testTable.getProperties('columns').reduce((acc, c) => acc + c, 0)
    ).toBe(
      100
    )
    testTable.getProperties('columns').forEach(
      (w, i) => {
        expect(w).toBe(
          i == 5 ? normal - 4 : i == 6 ? normal + 4 : i == 7 ? normal - 3 : i == 10 ? normal : normal - 1
        )
      }
    )
    testTable = Table.insertColumnAfter(testTable, 6)
    expect(
      testTable.getProperties('columns').reduce((acc, c) => acc + c, 0)
    ).toBe(
      100
    )
    testTable.getProperties('columns').forEach(
      (w, i) => {
        expect(w).toBe(
          normal - (
            i == 2 || i == 5 ? 1 : i == 6 ? 5 : i == 7 ? (-2) : i == 8 ? 3 : i == 11 ? 0 : 2
          )
        )
      }
    )
    testTable = Table.deleteColums(testTable, 3, 4)
    expect(
      testTable.getProperties('columns').reduce((acc, c) => acc + c, 0)
    ).toBe(
      100
    )
    
    testTable.getProperties('columns').forEach(
      (w, i) => {
        expect(w).toBe(
          normal - (
            i == 4 ? 4 : i == 5 ? -5 : i == 6 ? 2 : i == 9 ? -1 : 0
          )
        )
      }
    )
    
  })
})