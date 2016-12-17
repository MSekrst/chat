import React from 'react';

export default class Login extends React.Component {
  render() {
    return <div className="panelDiv">
      <h1>Welcome to <span className="appName">Chit Chat</span></h1>
      <br />
      <div className="loginFlow">
        <h4 className="loginSubtitle">Login</h4>
        <input className="inputLogin" name="username" type="text" placeholder="Username"/><br/>
        <input className="inputLogin" name="password" type="passport" placeholder="Password"/><br/>
        <input className="loginButton" type="submit" value="Login" />
      </div>
      <div className="socialMedia">
        <h5 style={{ marginLeft: '18%' }}>or login with social media:</h5>
        <div className="fblogin">
          <div className="imgFb">
            <img src="https://jobs.teleperformance.pt/bbimagehandler.ashx?File=Portals/0/Clients/icon-facebook.png&width=226&height=226&ResizeMode=FitSquare" width="35px" height="35px" />
          </div>
          <div className="textFb">
            Login with Facebook
          </div>
          </div>
      </div>
      <h4>if you don't have an account sign up <span id="signUpHere">here</span></h4>
    </div>
  }
}
