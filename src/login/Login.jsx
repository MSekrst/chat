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

    const ccToken = localStorage.ccToken || '';

    if (localStorage.ccToken) {
      fetch('/api/auth', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.ccToken,
        }
      }).then(checkStatus)
        .then((data) => {
          data.json().then(userData => {
            localStorage.ccUsername = userData.username;

            this.setState({token: localStorage.ccToken});
          });
        })
        .catch(err => {
          this.setState = ({
            username: '',
            password: '',
            wait: false,
          });
        });
    }

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.login = this.login.bind(this);
  }

  // handlers

  handlePassword(e) {
    this.setState({ ...this.state, password: e.target.value });
  }

  handleUsername(e) {
    this.setState({ ...this.state, username: e.target.value });
  }

  // data senders

  login() {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
    .then(checkStatus)
      .then((res) => {
        const dataPromise = res.json();

        dataPromise.then(token => {
          this.setState({ redirect: true , token });
        });
      })
      .catch(() => {
        $('#loginModal').modal('show');
    });
  }

  // renderers

  renderButton() {
    if (this.state.username !== '' && this.state.password) {
      return <input className="formButton" type="submit" value="Login" onClick={() => { this.login() }}/>
    }

    if (!this.state.username) {
      return <h3 className="validation">Please enter username</h3>;
    }

    return <h3 className="validation">Please enter password</h3>;
  }

  render() {
      console.log('state', this.state);

      if (this.state.token) {
      const link = 'chat?token=' + this.state.token;

      return <Redirect to={link}/>
    }

    if (this.state.wait) {
      return <div></div>;
    }

    return <div>
      <div className="panelDiv">
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
          <a href="/api/auth/facebook"><div className="fblogin">
            <div className="imgFb">
              <img src="./images/fbLogo.png" width="35px" height="35px"/>
            </div>
            <div className="textFb">
              Login with Facebook
            </div>
          </div></a>
        </div>
        <h4>if you don't have an account sign up <Link className="signUpHere" to="/register"><span>here</span></Link>
        </h4>
      </div>
      <div id="loginModal" className="modal fade bs-example-modal-sm" role="dialog" aria-labelledby="mySmallModalLabel">
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content authModal">
            Wrong username or password!
          </div>
        </div>
      </div>
    </div>
  }
}
