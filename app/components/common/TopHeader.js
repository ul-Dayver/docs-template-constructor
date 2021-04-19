import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { smoothlyMenu, documentBody } from '../layouts/Helpers';

class TopHeader extends React.Component {

    toggleNavigation(e) {
        e.preventDefault();
        //$("body").toggleClass("mini-navbar");
        if (documentBody.className.indexOf("mini-navbar") >= 0) {
          documentBody.className = documentBody.className.replace("mini-navbar",'').trim()
        } else {
          documentBody.className += ' mini-navbar'
        }
        smoothlyMenu();
    }
	
    render() {
        return (
            <div className="row border-bottom">
                <nav className="navbar navbar-static-top" role="navigation" style={{marginBottom: 0}}>
                    <div className="navbar-header">
                        <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
                    </div>
                    <ul className="nav navbar-top-links navbar-right">
                        <li>
                            <a href="/logout">
                                <i className="fa fa-sign-out"></i> Выход
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default TopHeader