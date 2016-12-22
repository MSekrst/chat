import React from 'react';

export default class Header extends React.Component {
  render() {
    return <nav className="navbar navbar-default">
      <div className="container-fluid navBackground">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed navCollapsedButton" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar navCollapsedButtonItem" />
            <span className="icon-bar navCollapsedButtonItem" />
            <span className="icon-bar navCollapsedButtonItem" />
          </button>
          <img className="navLogo" alt="Chit Chat" src="./images/smiley.png" height="50px" width="50px"/>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li className="rightAligned"><a className="navButton" href="/private"><span className="glyphicon glyphicon-lock navIcon" />&nbsp;&nbsp;Private Messages</a></li>
            <li className="rightAligned"><a className="navButton" href="/profile"><span className="glyphicon glyphicon-user navIcon" />&nbsp;&nbsp;Profile</a></li>
          </ul>
        </div>
      </div>
    </nav>;
  }
}
