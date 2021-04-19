import React from 'react'

const layout = ({id, label, helperText, helperType, inLine, children}) => (
  <div className={inLine ? "form-check-inline" : "form-group"}>
    {!!label && (<label htmlFor={id} className={inLine ? "m-r-sm" : "control-label"}>{label}</label>)}
    {children}
    {
      helperText && helperText.length
      ? (
        inLine
        ? <p className={"helper-block p-w-xs" + (helperType && helperType.length ? ' text-' + helperType : '')}>{helperText}</p>
        : <span className={"helper-block" + (helperType && helperType.length ? ' text-' + helperType : '')}>{helperText}</span>
      )
      : null
    }
  </div>
)

export default layout