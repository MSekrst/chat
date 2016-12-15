import React from 'react';

export default class Header extends React.Component {
  render() {
    return <nav className="navbar navbar-default color">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">
            <img alt="Chat" src="../images/favicon.ico" />
          </a>
        </div>
        <p className="navbar-text navbar-right navName">Signed in as <a href="#" className="navbar-link">Mark Otto</a></p>
      </div>
    </nav>;
  }
}
