import React from 'react'
import {Map, List} from 'immutable'
import Document from '../constructor/document'
import {hasTableBlock, hasTextBlock} from '../constructor/block'
import Questionnaire from './questionnaire'
import Text from "./text"
import Table from "./table"

const toMap = obj => {
  return obj !== Object(obj) ? obj : Map(
    Array.isArray(obj) ? obj.map((child, i) => [i+"", child]) : obj
  ).map(toMap)
}

const init = function (props) {
  const {document} = props
  const {template, data} = document
  let ret = {document, template: Document.createWithMeta(template.metadata), questionnaire: Map(), placeholders: Map(), tables: Map()}
  if (!!document) {
    ret.questionnaire = Map(data.questionnaire)
    !!data.placeholders && (ret.placeholders = toMap(data.placeholders))
    ret.tables = Map(data.tables).map(rows => Map(rows).mapEntries(([k,v]) => [k|0, v]).map(list => List(list).map(row => Map(row).mapEntries(([k,v]) => [k|0, v]))))
  } else if (template.questionnaire) { 
    ret.questionnaire = Map(template.questionnaire.map(item => [item.key, Array.isArray(item.children) ? item.children[0].key : false]))
  }
  
  return ret
}

export default class Reader extends React.Component {
  constructor(props){
    super(props)
    this.state = init(props)
    
    this.onChangeQuestionnaire = (key, value) => this.setState({questionnaire: this.state.questionnaire.set(key, value)})
    this.onChangePlaceholders = (path, value) => this.setState({placeholders: this.state.placeholders.setIn(path, value)})
    this.onChangeTable = (id, value) => this.setState({tables: this.state.tables.set(id, value)})

    this.handleScroll = () => {
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent("scroll", true, true);
      } else {
        event = document.createEventObject();
        event.eventType = "scroll";
      }
      event.eventName = 'scroll'
      if (window.dispatchEvent) {
        window.dispatchEvent(event)
      } else if (window.fireEvent) {
        window.fireEvent("on" + event.eventType, event)
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.document.uid != state.document.uid) {
      return Object.assign({},state, init(props))
    }

    return null
  }

  render () {
    const {template, questionnaire, placeholders, tables, document} = this.state
    const content = template.getContent()
    const pages = template.getPages()
    
    let landscape = false
    return (
      <div className="document-constructor">
        <div className="document-constructor-pages p-sm" onScroll={this.handleScroll}>
          {
              pages.map(
                (page, num) => {
                  let blockOrientation = template.getOrientationPage(num)
                  if (blockOrientation) landscape = blockOrientation.state.hasLandscape()

                  return (
                    <div key={"document-constructor-page-" + num} className={"document-constructor-page page-" + num + (" "+(landscape ? "landscape" : ""))}>
                      <div className="document-constructor-page-header"></div>
                      <div className="document-constructor-page-body" data-page={num} onClick={this.handleClick}>
                        {page.map(
                          (blockId, i) => {
                            const block = content.get(blockId)
                            const ViewBlock = hasTextBlock(block) ? Text : (hasTableBlock(block) ? Table : null)
                            if (ViewBlock) {
                              return <ViewBlock
                                key={"document-block-" + i}
                                {...block.toJSON()}
                                questionnaire={questionnaire}
                                placeholders={placeholders}
                                userData={tables && tables.size && tables.has(blockId) ? tables.get(blockId) : null}
                                onChangePlaceholder={this.onChangePlaceholders}
                                onChangeTable={this.onChangeTable}
                                datatype={this.props.directory.datatype}
                              />
                            }
                          }
                        ).toArray()}
                      </div>
                      <div className="document-constructor-page-footer"></div>
                    </div>
                  )
                }
              ).toArray()
          }
        </div>
        <div className="document-constructor-question-list bg-white border-right">
          <Questionnaire list={document.template.questionnaire} map={questionnaire} onChange={this.onChangeQuestionnaire} />
        </div>
      </div>
    )
  }
}