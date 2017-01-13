import React from 'react';
import { Redirect } from 'react-router';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem('ccUsername');
    localStorage.removeItem('ccToken');

    this.setState({redirect: true});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/"/>
    }

    return <nav className="navbar navbar-default">
      <div className="container-fluid navBackground">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed navCollapsedButton"
                  data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
                  aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar navCollapsedButtonItem"/>
            <span className="icon-bar navCollapsedButtonItem"/>
            <span className="icon-bar navCollapsedButtonItem"/>
          </button>
          <span className="header">Chit Chat</span>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li className="rightAligned"><a className="navButton" href="/private"><span
              className="glyphicon glyphicon-lock navIcon"/>&nbsp;&nbsp;Private Messages</a></li>
            <li className="rightAligned"><a className="navButton" href=""
                                            onClick={this.logout}><span
              className="glyphicon glyphicon-log-out navIcon"/>&nbsp;&nbsp;Logout
              as {this.props.username}</a></li>
          </ul>
        </div>
      </div>
    </nav>;
  }
}
