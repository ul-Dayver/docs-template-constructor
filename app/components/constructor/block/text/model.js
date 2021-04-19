import {EditorState, ContentState, ContentBlock, genKey, convertToRaw, convertFromRaw} from 'draft-js'
import decorator from '../editor/decorator'

export default class Text {
  constructor(props) {

    let editorState = EditorState
    .set(props || EditorState.createEmpty(),
      {
        allowUndo: false,
        decorator
      }
    )

    this.getEditorState = () => editorState
  }

  split() {
    const editorState = this.getEditorState()
    const selection = editorState.getSelection()
    const editBlockKey = selection.getStartKey()
    const offset = selection.getStartOffset()
    const currentContent = editorState.getCurrentContent()
    const editBlock = currentContent.getBlockForKey(editBlockKey)

    if (offset == 0 && currentContent.getFirstBlock().equals(editBlock)) {
      return {
        current: new Text(),
        new: new Text(editorState)
      }
    } else if (offset == editBlock.getLength()-1 && currentContent.getLastBlock().equals(editBlock)) {
      return {
        new: new Text()
      }
    }

    let currentBlockProcessed = false

    let currentBlockMap = [], newBlockMap = []
    editorState.getCurrentContent().getBlockMap().forEach(
      (block, blockKey) => {
        if (blockKey == editBlockKey) {
          currentBlockProcessed = true

          currentBlockMap.push(
            new ContentBlock({
              key: block.getKey(),
              type: block.getType(),
              text: block.getText().substring(0, offset),
              characterList: block.getCharacterList().slice(0, offset),
              data: block.getData()
            })
          )

          newBlockMap.push(
            new ContentBlock({
              key: genKey(),
              type: block.getType(),
              text: block.getText().substring(offset),
              characterList: block.getCharacterList().slice(offset)
            })
          )
        } else if (!currentBlockProcessed) {
          currentBlockMap.push(block)
        } else {
          newBlockMap.push(block)
        }
        
        block.getCharacterList()
      }
    )

    return {
      current: new Text(EditorState.createWithContent(ContentState.createFromBlockArray(currentBlockMap))),
      new: new Text(EditorState.createWithContent(ContentState.createFromBlockArray(newBlockMap)))
    }
  }

  merge(text) {
    if (!(text instanceof Text)) 
      throw new RangeError("text must be Text object");

    const editorState = this.getEditorState()
    const currentContent = editorState.getCurrentContent()
    const refContent = text.getEditorState().getCurrentContent()
      
    const blocks = currentContent.getBlockMap().toList().toArray().concat(refContent.getBlockMap().toList().toArray())
    return new Text(EditorState.createWithContent(ContentState.createFromBlockArray(blocks)))
  }

  toRaw() {
    let value = convertToRaw(this.getEditorState().getCurrentContent())
    if (!Object.keys(value.entityMap).length) delete value.entityMap
    value.blocks.map(block => {
      delete block.depth
      delete block.key
      if (block.inlineStyleRanges && !block.inlineStyleRanges.length) delete block.inlineStyleRanges
      if (block.entityRanges && !block.entityRanges.length) delete block.entityRanges
      if (!Object.keys(block.data).length) delete block.data
      if (block.type == 'unstyled') delete block.type
      return block
    })
    return value
  }

  static fromRaw(raw) {
    let clone = JSON.parse(JSON.stringify(raw))
    if (!clone.hasOwnProperty('entityMap')) clone.entityMap = {}
    return new Text(EditorState.createWithContent(convertFromRaw(clone)))
  }
}