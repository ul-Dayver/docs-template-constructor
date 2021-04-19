import React from 'react'

const DatetimeFieldTime = ({value, onChange, icon}) => {
  return (
    <div className="form-inline">
      <div className="d-flex ">
        {!!icon && (<span className="form-control-plaintext m-l-xs"><i className="fa fa-clock-o"></i></span>)}
        <input type="number" max="24" min="0" className="form-control m-l-xs m-r-xs" style={{width: '60px'}}
          value={value.format('HH')}
          onChange={e => {
            const tergetValue = e.target.value;
            (isFinite(tergetValue) && tergetValue < 25 && tergetValue > -1) && onChange(tergetValue, 'hour')
          }}
        />
        <span className="form-control-plaintext">:</span>
        <input type="number" max="60" min="0" className="form-control m-l-xs m-r-xs" style={{width: '60px'}}
          value={value.format('mm')}
          onChange={e => {
            const tergetValue = e.target.value;
            (isFinite(tergetValue) && tergetValue < 61 && tergetValue > -1) && onChange(tergetValue, 'minute')
          }}
        />
      </div>
    </div>
  )
}

export default DatetimeFieldTime