import React, {Component} from 'react'
import {getAttr} from '../../layouts/Helpers'
import moment from 'moment'
import momentRu from 'moment/locale/ru'

const OFF = 0
const ON = 1
const HIDDEN = 2
const SHOW = 3

const MONTHS = []
let tmpMoment = moment().startOf('year')
for (let i=0; i<12; i++) {
  MONTHS.push(tmpMoment.format('MMM'))
  tmpMoment.add(1,'M')
}

export default class DatetimeFieldYears extends Component {
  constructor (props){
    super(props)
    this.minYear = 1970
    this.state = {
      status: OFF,
      selectedYear: props.selectedYear,
      selectedMonth: props.selectedMonth,
      yearsCurrentPage: Math.ceil((props.selectedYear - this.minYear)/10)
    }
    this.timer
    this.yearsCountPages = 8 //(2050-1970)/10
    
    this.clickNextPageYears = this.clickNextPageYears.bind(this)
    this.clickPrevPageYears = this.clickPrevPageYears.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.status === prevState.status) return;
    if (this.timer) clearTimeout(this.timer)
    if (this.state.status === ON && prevState.status === OFF) {
      this.timer = setTimeout(() => this.setState({status: SHOW}), 100)
    } else if (this.state.status === HIDDEN && prevState.status === SHOW) {
      this.timer = setTimeout(() => this.setState({status: OFF}), 300)
    }
  }

  componentWillReceiveProps(newProps) {
    if (!!newProps.opened && this.state.status === OFF) {
      this.setState({status: ON})
    } else if (!newProps.opened && this.state.status === SHOW) {
      this.setState({status: HIDDEN})
    }
  }

  clickNextPageYears(){
    if (this.state.yearsCurrentPage < this.yearsCountPages) 
    this.setState({yearsCurrentPage: this.state.yearsCurrentPage + 1})
  }

  clickPrevPageYears(){
    if (this.state.yearsCurrentPage > 0)
    this.setState({yearsCurrentPage: this.state.yearsCurrentPage - 1})
  }

  handleClick(event) {
    let value = getAttr(event.currentTarget, 'data-value'),
    key = getAttr(event.currentTarget, 'data-key')
    
    this.setState({[key]: value})
  }

  render () {
    const {apply, cancel} = this.props
    const {selectedYear, selectedMonth} = this.state

    let yearList = []
    let year = this.minYear + ((this.state.yearsCurrentPage - 1) * 10)
    for (let i=0; i < 10; i++) {
      yearList.push(
        <div key={"selector-year-year-" + i} className="col-6 m-t-xs m-b-xs px-1">
          <button type="button" className={'btn btn-block btn-xs btn-'+(year == selectedYear ? 'success' : 'default')}
            data-value={year}
            data-key='selectedYear'
            onClick={this.handleClick}>
            <span>{year++}</span>
          </button>
        </div>
      )
    }
    let className = "animated faster white-bg datetime-field-calendar-selector-year border p-sm"
    switch(this.state.status) {
      case ON:
      case OFF: className = "d-none"; break;
      case HIDDEN: className += " fadeOut"; break;
      case SHOW: className += " fadeIn"; break;
      default: break;
    }

    return (
      <div className={className} style={{left:"-1px"}}>
        <div className="row">
          
            <div className="col-6">
              <div>
                <h4 className="text-center">Месяц</h4>
              </div>
              <div className="row">
                {
                  MONTHS.map((month,i) => (
                      <div key={"selector-year-month-" + i} className="col-6 m-t-xs m-b-xs px-1">
                        <button type="button" className={'m-r-xs btn btn-block btn-xs btn-'+(i == selectedMonth ? 'success' : 'default')}
                          data-value={i}
                          data-key={"selectedMonth"}
                          onClick={this.handleClick}>
                          <span>{month}</span>
                        </button>
                      </div>
                    )
                  )
                }
              </div>
            </div>
            <div className="col-6 border-left">
              <div>
                <h4 className="text-center">Год</h4>
              </div>
              <div className="row">
                <div className="col-12">
                  <button className="btn btn-xs btn-outline btn-block btn-primary" style={{lineHeight: 1, padding: 0}}
                    onClick={this.clickPrevPageYears}>
                    <i className="fa fa-sort-up mt-1"></i>
                  </button>
                </div>
                {yearList}
                <div className="col-12">
                  <button className="btn btn-xs  btn-outline btn-block btn-primary" style={{lineHeight: 1, paddingBottom: '5px'}}
                    onClick={this.clickNextPageYears}>
                      <i className="fa fa-sort-down"></i>
                  </button>
                </div>
              </div>
            </div>
          
        </div>
        <div className="text-center m-t-md m-b-xs">
          <button type="button" className="btn btn-sm btn-primary" onClick={() => apply(selectedMonth, selectedYear)}>
            <span>Применить</span>
          </button>
          <button type="button" className="btn btn-sm btn-white m-l-sm" 
            onClick={() => {this.setState({selectedMonth: this.props.selectedMonth, selectedYear: this.props.selectedYear},cancel)}}>
            <span>Отмена</span>
          </button>
        </div>
      </div>
    )
  }
}