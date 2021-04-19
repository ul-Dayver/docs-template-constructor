import React from 'react'

export default class Trow extends React.Component {
  render() {
    return (
      <tr>
        {this.props.children}
      </tr>
    )
  }
}