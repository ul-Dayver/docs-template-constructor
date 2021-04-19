import React from 'react'

export default ({x, y, active, onSelect}) => <div
  className={"table-insert-helper-grid-cell" + (active ? " active": '')}
  onMouseMove={() => onSelect(x, y)}
  ></div>