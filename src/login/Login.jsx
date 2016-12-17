import React from 'react';

export default class Login extends React.Component {
  render() {
    return <div className="container centered login">
      <h1>Welcome to <span className="appName">Chit Chat</span></h1>
      <br />
      <h3 className="loginSubtitle">Login</h3>
      <div className="loginFlow">
        <input name="username" type="text" placeholder="Username"/>
        <input name="password" type="passport" placeholder="Password"/>
      </div>
    </div>
  }
}
