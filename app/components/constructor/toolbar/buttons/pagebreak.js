import React from 'react'

export default ({theme, constructor}) => (
  <div className={theme.buttonWrapper}>
    <button className={theme.button} type="button" onClick={constructor.pageBreak} title="Разделить страницу">
      <i className="icon-page-break"></i>
    </button>
  </div>
)