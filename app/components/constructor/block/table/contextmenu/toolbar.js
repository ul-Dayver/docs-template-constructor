import React, {Suspense} from 'react'
import {Dropdown, ComponentSpinner} from '../../../../common'
import {getBorderSize, getUsefulness} from './validators'
import {Map} from "immutable"

const Icon = React.lazy(() => import ("../../../../../icon"))

const side = Map({
  top: "Верхняя граница",bottom: "Нижняя граница",left: "Левая граница",right: "Правая граница",
  none: 'Нет границы',all: 'Все границы', outer: 'Внешние границы', inner:'Внутренние границы'
})

const iconBorderProps = {raw: !0, width: 24, height: 24, className: 'mr-1'}
const wrapCls = "d-flex flex-row"
const lblCls = "ml-2 text-nowrap"
const bttnClassName ="btn btn-white border-0 m-r-sm"

export default ({handle, model, selection, directory}) => {
  let usefulness = getUsefulness(model, selection)
  return (
  <div className="container-fluid" style={{padding: '0'}}>
    <div className={wrapCls}>
      <Suspense fallback={<ComponentSpinner />}>
      <Dropdown
        title="Строки"
        byHover={true}
        bttnClassName={bttnClassName}
        label={(<Icon src="table-row"/>)}
        options={
          [
            {label: <span className={wrapCls}><Icon src={"table-row-down"}/><span className={lblCls}>Вставить строку снизу</span></span>, handle: handle.addRowAfter},
            {label: <span className={wrapCls}><Icon src={"table-row-up"}/><span className={lblCls}>Вставить строку сверху</span></span>, handle: handle.addRowBefore},
            {label: <span className={wrapCls}><Icon src={"table-row-delete"}/><span className={lblCls}>Удалить строки</span></span>, handle: handle.delRow}
          ]
        }
      />
      <Dropdown
        title="Столбцы"
        byHover={true}
        bttnClassName={bttnClassName}
        label={(<Icon src="table-column"/>)}
        options={
          [
            {label: <span className={wrapCls}><Icon src={"table-column-right"}/><span className={lblCls}>Вставить столбец справа</span></span>, handle: handle.addColAfter},
            {label: <span className={wrapCls}><Icon src={"table-column-left"}/><span className={lblCls}>Вставить столбец слева</span></span>, handle: handle.addColBefore},
            {label: <span className={wrapCls}><Icon src={"table-column-delete"}/><span className={lblCls}>Удалить столбецы</span></span>, handle: handle.delCol}
          ]
        }
      />
      {
        (handle.merge || handle.split) && (
          <button type="button" className={bttnClassName} onClick={handle.merge || handle.split} title={handle.merge ? "Объединить" : "Разбить"}>
            <Icon src={"table-cells-"+(handle.merge ?"":"un" )+"merge"} />
          </button>
        )
      }
      <Dropdown
        title="Граници"
        byHover={true}
        bttnClassName={bttnClassName}
        label={(<Icon {...Object.assign({src: 'border-all'}, iconBorderProps)}/>)}
        onSelect={handle.setBorder}
        options={
          side.map(
            (label, name) => {
              let value = getBorderSize(model, selection, name)
              let props = Object.assign({src: 'border-'+name}, iconBorderProps)
              return {
                value: +!value, name, active: !!value,
                label: <span className={wrapCls}><Icon {...props}/><span className={lblCls}>{label}</span></span>
              }
            }
          ).toList().toArray()
        }
      />
      <Dropdown
        title="Тип данных"
        byHover={true}
        bttnClassName={bttnClassName}
        label={(<i className="fa fa-th align-middle" style={{fontSize: '22px'}}></i>)}
        onSelect={handle.setUsefulness}
        options={
          directory.datatype.map(
            datatype => {
              return {
                label: datatype.get('description'),
                value: datatype.get('name'),
                active: !!usefulness && usefulness.get('datatype') == datatype.get('name')
              }
            }
          ).toList().toArray()
        }
      />
      {
        !!handle.dropTable && (
          <button type="button" className="btn btn-white border-0" onClick={handle.dropTable} title={"Удалить"}>
            <i className={"fa fa-trash-o text-primary align-bottom"} style={{fontSize: '22px', padding:'1px 0'}}></i>
          </button>
        )
      }
      </Suspense>
    </div>
  </div>
)}
/*
<button type="button" className={bttnClassName} onClick={handle.openProperties} title={"Свойства таблицы"}>
        <i className={"fa fa-cog text-primary align-bottom"} style={{fontSize: '22px', padding:'1px 0'}}></i>
      </button>
*/