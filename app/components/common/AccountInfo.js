import React, { Component } from 'react';
import {IboxTools} from './index';
import {formatMoney} from '../layouts/Helpers'
import { BASE_PATH } from '../../constants'
import moment from 'moment';
import momentRu from 'moment/locale/ru';

export default class AccountInfo extends Component {
  rndPrintLink(key, text, invoice){
    return (<a key={key} className="btn btn-link btn-sm" target="_blank" type="application/pdf" href={BASE_PATH + "/billing/invoice/"+ key + "/" + invoice.uid + "/" + invoice.numeric_uid}><i className="fa fa-print m-r-sm text-navy"></i>Распечатать {text}</a>)
  }
  render() {
    let invoice = null;
    let print = [];
    
    if (this.props.invoice) {
      if (this.props.invoice.external && this.props.invoice.paid_at) {
        invoice = (<p>Последний платеж на сумму <span className="text-success">{Math.ceil(this.props.invoice.amount)}</span> от <span className="text-success">{moment(this.props.invoice.issue_date).format("DD MMMM YYYY")}</span></p>)
      } else if (!this.props.invoice.external) {
        
        let end = null
        if (this.props.invoice.paid_at) {
          print.push({key : 'act', text: 'Акт' })
          end = (<span>оплачен <span className="text-success">{moment(this.props.invoice.paid_at).format("DD MMMM YYYY")}</span></span>)
        } else {
          print.push({key : 'print', text: 'Счет' })
          end = (<span>крайний срок оплаты <span className="text-danger">{moment(this.props.invoice.due_date).format("DD MMMM YYYY")}</span></span>)
        }
        print.push({key : 'order', text: 'Договор' })

        invoice = (
          <p>Последний счет №&nbsp;
            <span className="text-success">{this.props.invoice.numeric_uid}</span>
            &nbsp;на сумму&nbsp;
            <span className="text-success">{formatMoney(Math.ceil(this.props.invoice.amount))}</span> руб., {end}
          </p>
        )
      }
    }

    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h5>Аккаунт</h5>
          <IboxTools />
        </div>
        <div className="ibox-content">
          <p>Пользователь: <span className="text-success">{this.props.username}</span></p>
          <p>Тарифный план: <span className="text-success">{this.props.plan.title}</span></p>
          <p>Организаций: <span className="text-success">{this.props.subscription.companies_count} из {this.props.plan.maximum_companies_count}</span></p>
          {
            this.props.plan.trial 
            ? (<p className="text-danger">Доступ ограничен</p>)
            : (
              <p>Подписка истек{this.props.subscription.isActive?'ает':'ла'}:&nbsp;
                <span className={this.props.subscription.isActive?"text-success":"text-danger"}>
                  {moment(this.props.subscription.next_billing_date).format("DD MMMM YYYY")}
                </span>
              </p>
            )
          }
          <div className="border-left border-size-sm p-w-sm" style={{borderColor: '#1c84c6'}}>
            {invoice}
            {print.map((prnt) => this.rndPrintLink(prnt.key, prnt.text, this.props.invoice))}
          </div>
          {this.props.children ? this.props.children : null}
        </div>
      </div>
    )
  }
}