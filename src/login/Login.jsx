import React from 'react';
import { Link, Redirect } from 'react-router';

import { checkStatus } from '../helpers';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.login = this.login.bind(this);
  }

  handlePassword(e) {
    this.setState({ ...this.state, password: e.target.value });
  }

  handleUsername(e) {
    this.setState({ ...this.state, username: e.target.value });
  }

  login() {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    }).then(checkStatus)
      .then((token) => {

      });



  }

  renderButton() {
    if (this.state.username !== '' && this.state.password) {
      return <input className="formButton" type="submit" value="Register" onClick={() => { this.login() }}/>
    }

    if (!this.state.username) {
      return <h3 className="validation">Please enter username</h3>;
    }

    return <h3 className="validation">Please enter password</h3>;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/chat"/>
    }

    return <div className="panelDiv">
      <h1>Welcome to <span className="appName">Chit Chat</span></h1>
      <br />
      <div className="loginFlow">
        <h4 className="loginSubtitle">Login</h4>
        <form onSubmit={ (e) => e.preventDefault() }>
        <input className="formInput" value={this.state.username} name="username" type="text"
               placeholder="Username" onChange={this.handleUsername}/><br/>
        <input className="formInput" value={this.state.password} name="password" type="password"
               placeholder="Password" onChange={this.handlePassword}/><br/>
        {this.renderButton()}
        </form>
      </div>
      <div className="socialMedia">
        <h5 style={{marginLeft: '18%'}}>or login with social media:</h5>
        <div className="fblogin">
          <div className="imgFb">
            <img src="./images/fbLogo.png" width="35px" height="35px"/>
          </div>
          <div className="textFb">
            Login with Facebook
          </div>
        </div>
      </div>
      <h4>if you don't have an account sign up <Link className="signUpHere" to="/register"><span>here</span></Link>
      </h4>
    </div>
  }
}
