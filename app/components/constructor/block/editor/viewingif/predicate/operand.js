import React from 'react'
import {Switch} from '../../../../../common'

export default ({index, value, onChange}) => {
  return (
    <div style={{position: 'relative', paddingTop: '30px'}}>
      <div style={{borderTop: '2px dashed #454545', paddingTop: '30px'}}></div>
      <div className="mx-auto bg-white position-absolute" style={{top: '18px', bottom: '18px', width: '116px', left: 0, right: 0, paddingLeft: '8px'}}>
        <Switch on={!!value} onChange={value => onChange(index, !!value ? 1 : 0)} labels={['ИЛИ', 'И']}/>
      </div>
    </div>
  )
}