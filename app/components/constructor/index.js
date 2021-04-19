import React from 'react'
import createBlock, {ViewBlock, hasPageBreak, hasPageOrientation} from './block'
import Toolbar from './toolbar'
import Document from './document'
import Questionnaire from './questionnaire'
import Handle from './handlers'
import {Modal} from '../common'

export default class Constructor extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      _ref: null,
      editPageNum: null,
      waitUserAction: null
    }
    this.focusIn = undefined
    this.focusInEnd = undefined

    this.addBlock = Handle.Block.add.bind(this)
    this.insertBlock = Handle.Block.insert.bind(this)
    this.insertBlockToPage = Handle.Block.insertToPage.bind(this)
    this.handleRemoveBlock = Handle.Block.remove.bind(this)
    this.handleRemoveNextBlock = Handle.Block.removeNext.bind(this)

    this.handleFocusBlock = Handle.Block.focus.bind(this)
    this.handleChangeBlock = Handle.Block.change.bind(this)
    this.handleClick = Handle.Block.clickPage.bind(this)
    this.handleChangeQuestionnaire = Handle.Block.changeQuestionnaire.bind(this) //questionnaire => this.props.onChange({questionnaire})
    this.handleCancelWaitUserAction = () => this.setState({waitUserAction: null})
    this.handleAcceptWaitUserAction = Handle.Block.applyChangeQuestionnaire.bind(this)

    this.undoRedo = key => this.props.onChange({document: Document[key](this.props.template.get('document'))})

    this.ToolBarHandlers = {
      add: (state) => this.addBlock(createBlock({state})),
      insert: (id, state) => this.insertBlock(id, createBlock({state})),
      pageBreak: Handle.Block.pageBreak.bind(this),
      undo: this.undoRedo.bind(this),
      getQuestionnaire: () => this.props.template.get('questionnaire'),
      isUndo: () => this.props.template.get('document').isUndo(),
      isRedo: () => this.props.template.get('document').isRedo(),
      datatype: props.directory.datatype,
      getOrientationPage: Handle.orientationPage.get.bind(this),
      setOrientationPage: Handle.orientationPage.set.bind(this)
    }

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

  componentDidUpdate() {
    let ref = undefined, end = false
    if (this.focusIn && !!this.refs['block'+this.focusIn]) {
      ref = 'block'+this.focusIn
      this.focusIn = undefined
      this.focusInEnd = undefined
    } else if (this.focusInEnd && !!this.refs['block'+this.focusInEnd]) {
      ref = 'block'+this.focusInEnd
      this.focusInEnd = undefined
      end = true
    }

    if (ref) this.refs[ref].setFocus(end)
  }

  render () {
    const {template, directory} = this.props
    const document = template.get('document')
    const pages = document.getPages()
    const content = document.getContent()

    let landscape = false

    return (
      <div className="document-constructor">
        <div className="document-constructor-pages p-sm" onScroll={this.handleScroll}>
          {
              pages.map(
                (page, num) => {
                  let blockOrientation = document.getOrientationPage(num)
                  if (blockOrientation) landscape = blockOrientation.state.hasLandscape()
                  
                  return (
                  <div key={"document-constructor-page-" + num} className={"document-constructor-page page-" + num + (" "+(landscape ? "landscape" : ""))}>
                    <div className="document-constructor-page-header"></div>
                    <div className="document-constructor-page-body" data-page={num} onClick={this.handleClick}>
                      {page.map(
                        (blockId, i) => {
                          const block = content.get(blockId)
                          return !hasPageBreak(block) && !hasPageOrientation(block) && (
                            <ViewBlock key={"document-block-" + i} ref={'block'+blockId}
                              {...block.toJSON()}
                              onFocus={this.handleFocusBlock}
                              onChange={this.handleChangeBlock}
                              onRemove={this.handleRemoveBlock}
                              onRemoveNext={this.handleRemoveNextBlock}
                              pageNum={num}
                              directory={directory}
                            />
                          )
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
        <div className="document-constructor-toolbar">
          <Toolbar {...this.state._ref} constructor={this.ToolBarHandlers} />
        </div>
        <div className="document-constructor-question-list bg-white border-right">
          <Questionnaire list={template.get('questionnaire')} onChange={this.handleChangeQuestionnaire} />
        </div>
        <Modal
          isActive={this.state.waitUserAction}
          clickClose={this.handleCancelWaitUserAction}
          title={'Подтвердите, пожалуйста, действие!'}
          buttons={[
            {label: 'Отменить', className: 'btn-secondary', handle: this.handleCancelWaitUserAction},
            {label: 'Подтвердить', handle: this.handleAcceptWaitUserAction}
          ]}>
            <div className="row">
              <div className="col-2 d-flex align-items-center justify-content-center"><i className="fa fa-warning h1 text-warning"></i></div>
              <div className="col-10 d-flex align-items-center">
                <p>Это действие приведет к изменению в содержимом данного шаблона и его <b>нельзя будет отменить</b>.<br/>Если Вы уверены, нажмите &laquo;Подтвердить&raquo;.</p>
              </div>
            </div>
        </Modal>
      </div>
    )
  }
}