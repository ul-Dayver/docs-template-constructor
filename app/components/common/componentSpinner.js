import React from 'react'

export default () => (
  <div className={"modal waiting-spinner animated fadeIn"}>
    <div className="waiting-spinner-bg"></div>
    <div className="waiting-spinner-body">
      <div className="alert alert-success">
        <div className="sk-spinner sk-spinner-rotating-plane pull-left "></div>
        <p className="m-l-xl">Пожалуйста, подождите...</p>
      </div>
    </div>
  </div>
)