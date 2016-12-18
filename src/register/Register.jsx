import React from 'react';

export default class Register extends React.Component {
  render() {
    return <div className="panelDiv">
      <h1>Welcome to <span className="appName">Chit Chat</span></h1>
      <br />
      <p className="infoText"><span className="appName">Chit Chat</span> is chatting app which provides encrypted communication between all participants.
        It also enables easy file sending and private messages via P2P.</p>
      <div className="loginFlow">
        <h4 className="loginSubtitle">Login</h4>
        <input className="inputLogin" name="username" type="text" placeholder="Username"/><br/>
        <input className="inputLogin" name="password" type="passport" placeholder="Password"/><br/>
        <input className="loginButton" type="submit" value="Login" />
      </div>
    </div>
  }
}
