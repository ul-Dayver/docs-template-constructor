import React from 'react'

export default ({theme, constructor}) => [
  (
    <div key="toolbar-button-undo" className={theme.buttonWrapper}>
      <button className={theme.button} disabled={!constructor.isUndo()} onClick={() => constructor.undo('undo')} title="Отменить">
        <i className="icon-undo"></i>
      </button>
    </div>
  ),
  (
    <div key="toolbar-button-redo" className={theme.buttonWrapper}>
      <button className={theme.button} disabled={!constructor.isRedo()}  onClick={() => constructor.undo('redo')} title="Повторить">
        <i className="icon-redo"></i>
      </button>
    </div>
  )
]