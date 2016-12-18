import React from 'react';
import { Link } from 'react-router';

export default class Login extends React.Component {
  render() {
    return <div className="panelDiv">
      <h1>Welcome to <span className="appName">Chit Chat</span></h1>
      <br />
      <div className="loginFlow">
        <h4 className="loginSubtitle">Login</h4>
        <input className="formInput" name="username" type="text" placeholder="Username"/><br/>
        <input className="formInput" name="password" type="password" placeholder="Password"/><br/>
        <input className="formButton" type="submit" value="Login" />
      </div>
      <div className="socialMedia">
        <h5 style={{ marginLeft: '18%' }}>or login with social media:</h5>
        <div className="fblogin">
          <div className="imgFb">
            <img src="./images/fbLogo.png" width="35px" height="35px" />
          </div>
          <div className="textFb">
            Login with Facebook
          </div>
          </div>
      </div>
      <h4>if you don't have an account sign up <Link className="signUpHere" to="/register"><span>here</span></Link></h4>
    </div>
  }
}
