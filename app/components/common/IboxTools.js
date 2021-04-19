import React from 'react';
import {closest, removeAttribute} from '../layouts/Helpers'

const COLLAPSED = 'collapsed'
const COLLAPSING = 'collapsing'

class IboxTools extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        status: null
      }
      this.ibox = null
      this.content = null
      this.contentHeight = null
    }

    componentDidMount () {
      this.ibox = closest(this.refs.tools, 'div.ibox')
      let divs = this.ibox.getElementsByTagName('div')
      for (let i=0; i<divs.length; i++) {
        if (divs[i].className.indexOf('ibox-content') >= 0) {
          this.content = divs[i]
          break
        }
      }
    }

    componentDidUpdate (prevProps, prevState) {
      if (this.state.status == prevState.status) return;
      switch (this.state.status) {
        case COLLAPSING:
          if (!prevState.status) {
            this.contentHeight = this.content.offsetHeight
            this.content.style.height = this.contentHeight + 'px'
            this.content.className += ' ' + COLLAPSING
            setTimeout(() => {
              this.content.style.height = '0px'
              this.setState({status: COLLAPSED})
              this.content.style.paddingBottom = this.content.style.paddingTop = '0px'
            }, 100)
          } else if (prevState.status === COLLAPSED) {
            this.ibox.className = this.ibox.className.replace('border-bottom','').replace(COLLAPSED, '').trim()
            this.content.style.paddingBottom = this.content.style.paddingTop = '0px'
            this.content.style.height = '0px'
            this.content.className += ' ' + COLLAPSING
            setTimeout(() => {
              this.content.style.height = this.contentHeight + 'px'
              this.setState({status: null})
              this.content.style.paddingBottom = this.content.style.paddingTop = null
            }, 100)
          }
        break
        case COLLAPSED:
          setTimeout(() => {
            this.content.className = this.content.className.replace(COLLAPSING, '').trim()
            this.ibox.className += ' ' + COLLAPSED + ' border-bottom'
            removeAttribute(this.content, 'style')
          }, 200)  
        break
        default:
          setTimeout(() => {
            this.content.className = this.content.className.replace(COLLAPSING, '').trim()
            removeAttribute(this.content, 'style')
          }, 200)
        break
      }
    }

    collapsePanel(e) {
        e.preventDefault();
        if (this.state.status !== COLLAPSING) {
          this.setState({status: COLLAPSING})
        }
    }
/*
    closePanel(e) {
        e.preventDefault();
        var element = $(e.target);
        var content = element.closest('div.ibox');
        content.remove();
    }
*/
    render() {
        return (
            <div className="ibox-tools" ref="tools">
                <a className="collapse-link" onClick={this.collapsePanel.bind(this)}>
                    <i className="fa fa-chevron-up"></i>
                </a>
            </div>
        )
    }
}

module.exports = IboxTools;