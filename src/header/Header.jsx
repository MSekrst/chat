import React from 'react';
import Select from 'react-select';
import { Redirect } from 'react-router';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.ccUsername = undefined;
    localStorage.ccToken = undefined;

    this.setState({redirect: true});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/"/>
    }

    return (<div><nav className={"navbar navbar-default"+" "+this.props.styleName} style={{ "zIndex": 99 }}>
      <div className={"container-fluid navBackground"+" "+this.props.styleName}>
        <div className="navbar-header">
          <button type="button" className={"navbar-toggle collapsed navCollapsedButton"+ " "+this.props.styleName}
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
            <li className="rightAligned"><a className="navButton" href="/profile"><span
              className="glyphicon glyphicon-user"/>&nbsp;&nbsp;Profile</a></li>
            <li className="rightAligned"><a className="navButton" href="/chat"><span
              className="glyphicon glyphicon-envelope"/>&nbsp;&nbsp;Chat</a></li>
            <li className="rightAligned" data-target="#myModal3" type="button" data-toggle="modal"><a className="navButton"><span
              className="glyphicon glyphicon-lock navIcon" />&nbsp;&nbsp;Private Messages</a></li>
            <li className="rightAligned"><a className="navButton" href=""
                                            onClick={this.logout}><span
              className="glyphicon glyphicon-log-out navIcon"/>&nbsp;&nbsp;Logout
              as {this.props.username}</a></li>
          </ul>
        </div>
      </div>
    </nav>
      <div className="modal fade" id="myModal3" tabIndex="-1" role="dialog"
           aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="myModalLabel"><span
                className="glyphicon glyphicon-search talkIcon"/>&nbsp;&nbsp;&nbsp;&nbsp;Choose a friend for private chat</h4>
            </div>
            <div className="modal-body">
              <Select
                name="users"
                options={this.props.users}
                onChange={this.props.open}
              />
            </div>
          </div>
        </div>
      </div>
  </div>);
  }
}
