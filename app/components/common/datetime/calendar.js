import React, {Component} from 'react'
import {getAttr} from '../../layouts/Helpers'
import moment from 'moment'
import momentRu from 'moment/locale/ru'
import DatetimeFieldYears from './years'

const daysOfWeek = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

export default class DatetimeFieldCalendar extends Component {
  constructor (props){
    super(props)
    let currentMoment = props.value ? moment(props.value) : moment()
    
    this.state = {
      selectorYearOpened: false,
      value: props.value
    }
    this.handlerToggleMonth = this.handlerToggleMonth.bind(this)
    this.handlerClickOnDay = this.handlerClickOnDay.bind(this)
    this.applyChangeYearMonth = this.applyChangeYearMonth.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.value !== newProps.value) {
      this.setState({value: newProps.value})
    }
  }

  handlerToggleMonth(method, event) {
    this.setState({
      value: moment(this.state.value)[method](1, 'months')
    })
  }

  handlerClickOnDay(event) {
    const {value} = this.state
    let day = moment(getAttr(event.target, 'data-value'),'D-M-YY').hour(value.hour()).minute(value.minute())
    
    this.props.onChangeDay(day)
  }

  applyChangeYearMonth(selectedMonth, selectedYear) {
    this.setState({
      selectorYearOpened: false,
      value: moment(this.state.value).year(selectedYear).month(selectedMonth)
    })
  }

  render() {
    const {value, selectorYearOpened} = this.state
    let currentDay = moment(value).date(1).startOf('week')
    let endDay = moment(value).endOf('month').endOf('week')
    let matrixDays = []

    while (currentDay.isBefore(endDay,'day')) {
      let week = [],currentDayOfWeek = 0
      for(currentDayOfWeek; currentDayOfWeek < daysOfWeek.length; currentDayOfWeek++) {
        week.push(
          <td 
            className={"datetime-field-calendar-day p-xs"+((currentDay.month() === value.month())?(currentDay.isSame(value, 'day')?' bg-primary':' white-bg'):' text-muted')}
            key={currentDay.format('DMYY')}
            data-value={currentDay.format('D-M-YY')}
            onClick={this.handlerClickOnDay}>
            {currentDay.date()}
          </td>
        )
        currentDay.add(1, 'd')
      }
      matrixDays.push(<tr key={currentDay.format('WMYY')}>{week}</tr>)
    } 

    return (
      <div>
        <table className="text-center full-width">
          <thead>
            <tr>
              <td className="datetime-field-calendar-head bg-primary" colSpan={daysOfWeek.length}>
                <table className="full-width">
                  <tbody>
                    <tr>
                      <td width="50px" className="text-right">
                        <button type="button" className="no-borders bg-primary p-xs" onClick={(event) => this.handlerToggleMonth('subtract', event)}>
                          <i className="fa fa-angle-left"></i>
                        </button>
                      </td>
                      <td>
                        <div className="datetime-selectyear" onClick={() => this.setState({selectorYearOpened: true})}>
                          <span>{value.format('MMMM YYYY')}</span>
                          <span><i style={{verticalAlign: 'top'}} className="fa fa-sort-down m-l-sm"></i></span>
                        </div>
                      </td>
                      <td width="50px" className="text-left">
                        <button type="button" className="no-borders bg-primary p-xs" onClick={(event) => this.handlerToggleMonth('add', event)}>
                          <i className="fa fa-angle-right"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              {daysOfWeek.map((dayOfWeek,i) => (<th key={'w-'+i} className="datetime-field-calendar-day-of-week text-center p-xs">{dayOfWeek}</th>))}
            </tr>
          </thead>
          <tbody className="gray-bg">
            <tr>
              <td colSpan={daysOfWeek.length}>
                <div className="clear">
                  <table className="full-width">
                    <tbody>{matrixDays}</tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <DatetimeFieldYears
          opened={selectorYearOpened}
          selectedYear={value.get('year')}
          selectedMonth={value.get('month')}
          apply={this.applyChangeYearMonth}
          cancel={() => this.setState({selectorYearOpened: false})}
        />
      </div>
    )
  }
}