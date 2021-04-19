import {EditorState, convertToRaw, convertFromRaw} from 'draft-js'
import {Map, Record} from 'immutable'
import decorator from '../../editor/decorator'

const _Cell = Record({
  position: Map({y: 0, x: 0}),
  editorState: null,
  span: Map({col: 0, row: 0}),
  border: Map({size: Map({top: 0, right: 0, bottom: 0, left: 0})}),
  usefulness: Map({datatype: 'text'})
})

export default class Cell {
  constructor(props) {
    let config = Object.assign({},props,{
      editorState: props.editorState || EditorState.createEmpty()
    })
    config.editorState = EditorState.set(config.editorState, {
      allowUndo: false,
      decorator
    })

    if (config.position) {
      if (typeof config.position === 'object' && !(config.position instanceof Map)) {
        config.position = Map(config.position)
      } else if (typeof config.position !== 'object') {
        delete config.position
      }
    }

    if (config.span) {
      if (typeof config.span === 'object' && !(config.span instanceof Map)) {
        config.span = new Map(config.span)
      } else if (typeof config.span !== 'object') {
        delete config.span
      }
    }

    if (config.border) {
      if (typeof config.border === 'object' && !(config.border instanceof Map)) {
        let _border = Object.assign({}, config.border,{
          size: new Map(
            Object.assign({top: 0, right: 0, bottom: 0, left: 0}, (typeof config.border.size === 'object') ? config.border.size : {})
          )
        })
        config.border = new Map(_border)
      } else if (typeof config.border !== 'object') {
        delete config.border
      }
    }

    if (config.usefulness) {
      config.usefulness = Map(config.usefulness)
    }
    
    let _cell = new _Cell(config)
    
    this.equals = (cell) => cell instanceof Cell &&
      this.getPosition('x') === cell.getPosition('x') &&
      this.getPosition('y') === cell.getPosition('y') &&
      (
        !!this.getEditorState() && !!cell.getEditorState() && cell.getEditorState().getCurrentContent() === this.getEditorState().getCurrentContent() ||
        !this.getEditorState() && !cell.getEditorState() && !!this.getUsefulness() && !!cell.getUsefulness() && this.getUsefulness().equals(cell.getUsefulness())
      ) &&
      cell.getWidth() === cell.getWidth() &&
      _cell.get('border').every((mapVal, key) => mapVal.equals(cell.getBorder(key))) &&
      this.getSpan('col') === cell.getSpan('col') &&
      this.getSpan('row') === cell.getSpan('row')
      

    this.getEditorState = () => _cell.get('editorState')
    this.isEmptyContent = () => !_cell.get('editorState').getCurrentContent().hasText()

    this.getWidth = () => _cell.get('width')
    
    this.getSpan = function(key) {
      if (!arguments.length) {
        return _cell.get('span').toJSON()//filter(v => !!v).mapEntries((entry) => [entry[0] + 'Span', entry[1]])
      }
  
      if (key !== 'col' && key !== 'row') {
        throw new RangeError("key must be 'row' or 'col'");
      }
      return _cell.getIn(['span', key])
    }
    
    this.getPosition = function (key) {
      if (!arguments.length) {
        return _cell.get('position').toJSON()
      }

      if (key !== 'x' && key !== 'y') {
        throw new RangeError("key must be 'x' or 'y'");
      }
      
      return _cell.getIn(['position', key])
    }

    this.getBorder = function(...args) {
      if (args.length) return _cell.getIn(['border'].concat(args))
      return _cell.get('border').toJS()
    }

    this.getUsefulness = () => _cell.get('usefulness')

    this.toJSON = () => {
      const usefulness = this.getUsefulness()
      
      let ret = {
        border: this.getBorder(),
        position: this.getPosition(),
        editorState: this.getEditorState(),
        span: this.getSpan(),
        width: this.getWidth(),
        usefulness: usefulness ? usefulness.toJS() : usefulness
      }

      return ret
    }

    this.toRaw = () => {
      let value = null
      if (!!this.getEditorState()) {
        value = convertToRaw(this.getEditorState().getCurrentContent())
        if (!Object.keys(value.entityMap).length) delete value.entityMap
        value.blocks = value.blocks.map(block => {
          delete block.depth
          delete block.key
          if (block.inlineStyleRanges && !block.inlineStyleRanges.length) delete block.inlineStyleRanges
          if (block.entityRanges && !block.entityRanges.length) delete block.entityRanges
          if (!Object.keys(block.data).length) delete block.data
          if (block.type == 'unstyled') delete block.type
          return block
        })
      }
      
      const border = _cell.get('border').toJS()
      const usefulness = _cell.get('usefulness')
      let raw = {border, value}
      let span = _cell.get('span').filter(v => !!v)
      if (span.size) {
        //raw.span = span.mapEntries(entry => [entry[0] + 'span', entry[1]]).toJSON()
        raw.span = span.toJSON()
      }
      if (usefulness && usefulness.get('datatype') != 'text') raw.usefulness = usefulness.toJS()
      return raw
    }

    this.clone = () => {
      if (!this.isEmptyContent()) throw new RangeError("cell must be empty content in editorState")
      return new Cell(Object.assign(this.toJSON(),{editorState: null}))
    }
  }

  static MergeFrom() {
    if (arguments.length < 1) throw new Error("Can't merge Cell from nothing!")
    const position = arguments[0].getPosition()
    let maxRight = position.x
    let maxBottom = position.y
    let border = arguments[0].getBorder()
    let width = []
    Array.apply(null, arguments).forEach(cell => {
      let {x, y} = cell.getPosition()
      let old = width[x]
      if (!old || old < cell.getWidth())
        width[x] = cell.getWidth()
      if (x > maxRight) {
        maxRight = x
        border.size.right = cell.getBorder('size', 'right')
      }
      if (y > maxBottom) {
        maxBottom = y
        border.size.bottom = cell.getBorder('size', 'bottom')
      }
    })
    width = width.reduce((acc, val) => acc + val)

    let endCell = arguments[arguments.length-1]
    let endPosition = endCell.getPosition()

    const span = Map(arguments[0].getSpan()).map(
      (spanValue, spanKey) => {
        let key = spanKey == 'col' ? 'x' : 'y'
        if (endPosition[key] == position[key]) return spanValue 
        const endSpan = endCell.getSpan(spanKey) || 1
        return (endPosition[key] - position[key]) + endSpan
      }
    )

    const rawContent = Array.apply(null, arguments).reduce((acc, cell) => {
      if (!cell.getEditorState()) return acc
      let raw = convertToRaw(cell.getEditorState().getCurrentContent())
      if (raw.blocks.length == 1 && !raw.blocks[0].text.length) raw.blocks = []
      if (!acc) return raw
      
      let entityMapIndex = Object.keys(acc.entityMap).length
      let entityMap = acc.entityMap
      Object.keys(raw.entityMap).forEach((key, index) => {entityMap[index+entityMapIndex] = raw.entityMap[key]})
      let blocks = acc.blocks.concat(
        raw.blocks.map(
          block => Object.assign(block, {
            entityRanges: block.entityRanges.map(
              range => Object.assign(range, {key: range.key + entityMapIndex})
            )
          })
        )
      )

      return {blocks, entityMap}
    }, null)
    
    const editorState = !rawContent.blocks.length ? EditorState.createEmpty() : EditorState.createWithContent(convertFromRaw(rawContent))
    let usefulness = arguments[0].getUsefulness()

    return new Cell({position, span, editorState, border, width, usefulness})
  }

  static fromRaw(cell, position) {
    let span = {col: 0, row: 0}
    if (cell.span) {
      span = Object.assign(span, Map(cell.span).mapEntries(entry => [entry[0].replace('span',''), entry[1]]).toJSON())
    }
    let editorState = null;
    if (!!cell.value) {
      let value = JSON.parse(JSON.stringify(cell.value)) 
      if (!value.hasOwnProperty('entityMap')) value.entityMap = {}
      editorState = EditorState.createWithContent(convertFromRaw(value))
    }
    let _cell = {position, span, editorState}
    if (cell.border !== undefined) {
      _cell.border = {size: {}}
      Object.keys(cell.border.size).forEach(key => _cell.border.size[key] = parseInt(cell.border.size[key], 10))
    }
    if (cell.usefulness !== undefined) _cell.usefulness = cell.usefulness
    return new Cell(_cell)
  }
}