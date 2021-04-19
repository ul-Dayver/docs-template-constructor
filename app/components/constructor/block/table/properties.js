import React from 'react'
import {Map} from 'immutable'
import {Modal} from '../../../common'
import {Numeric, Layout} from '../../../datatype'

const СellMargin = {top: "Сверху",bottom: "Снизу",left: "Слева",right: "Справа"}
const pxToTwip = (px) => Math.round((px / 37.037) * 567)
const init = (prop) => {
  return {
    cellMargin: Map({
      twip: Map((prop.cellMargin && prop.cellMargin.twip) || {top: 0, left: 107, right: 107, bottom: 0}),
      px: Map((prop.cellMargin && prop.cellMargin.px) || {top: 0, left: 7, right: 7, bottom: 0})
    }),
    borderSize: prop.borderSize || 0
  }
}
export default class Props extends React.Component {
  constructor(prop){
    super(prop)
    this.state = init(prop)
    this.cancel = () => this.props.onCancel()
    this.accept = () => this.props.onAccept(Object.assign({}, this.state, {cellMargin: this.state.cellMargin.toJS()}))
    this.changeMode = (checked, mode) => !!checked && this.setState({mode})
    this.changeMargin = (name, value) => this.setState({
      cellMargin: this.state.cellMargin.setIn(['px',name.replace('cellMargin','')], value)
      .setIn(['twip',name.replace('cellMargin','')], pxToTwip(value))
    })
    this.change = (name, value) => this.setState({[name]: value})
  }

  static getDerivedStateFromProps(props, state) {
    return (
      !props.show && (props.borderSize != undefined && props.borderSize !== state.borderSize || (props.cellMargin && props.cellMargin.equals && !props.cellMargin.equals(state.cellMargin) ))
    ) ? init(props) : null
  }

  render() {
    const {borderSize, cellMargin} = this.state
    
    return (
      <Modal
        isActive={this.props.show}
        clickClose={this.cancel}
        title={'Свойства таблицы'}
        buttons={[
          {label: 'Отменить', className: 'btn-secondary', handle: this.cancel},
          {label: 'Применить', handle: this.accept}
        ]}
      >
        <Numeric name='borderSize' label="Размер границ" value={borderSize} onChange={this.change}/>
        <Layout label="Отступ ячейки">
          <div className="row">
          {
            cellMargin.get('px').map(
              (margin, key) => (
                <div key={key} className={"text-center m-b-sm col-" + (key === 'top' || key === 'bottom' ? '12' : '6') }>
                  <Numeric
                    helperText="px"
                    size='sm'
                    width="75px"
                    inLine={true}
                    name={'cellMargin'+key}
                    label={СellMargin[key]}
                    value={margin}
                    onChange={this.changeMargin}
                  />
                </div>
              )
            ).toList().toArray()
          }
          </div>
        </Layout>
      </Modal>
    )
  }
}