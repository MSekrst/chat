import React from 'react';
import 'whatwg-fetch';
import { Redirect } from 'react-router';

import { checkStatus } from '../helpers';

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      repeated: '',
    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleRepeated = this.handleRepeated.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  handleUsername(e) {
    this.setState({ ...this.state, username: e.target.value });
  }

  handlePassword(e) {
    this.setState({ ...this.state, password: e.target.value });
  }

  handleRepeated(e) {
    this.setState({ ...this.state, repeated: e.target.value });
  }

  register() {
    const send = {
      username: this.state.username,
      password: this.state.password,
    };

    fetch('./api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(send)
    }).then(checkStatus)
      .then((res) => {
        console.log('proslo');
        this.setState({ redirect: true });
    }).catch(err => {
      $('#registerModal').modal('show');
    });
  }

  renderButton() {
    if (this.state.username !== '' && this.state.password !== '' && this.state.password === this.state.repeated) {
      return <input className="formButton" type="submit" value="Register" onClick={() => { this.register() }}/>
    }

    if (!this.state.username) {
      return <h3 className="validation">Please enter username</h3>;
    }

    if (!this.state.password) {
      return <h3 className="validation">Please enter password</h3>;
    }

    if (!this.state.repeated) {
      return <h3 className="validation">Please enter repeated password</h3>;
    }

    return <h3 className="validation">Passwords are not equal!</h3>;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />
    }

    return <div>
      <div className="panelDiv" style={{height: "70%"}}>
        <h1>Register to <span className="appName">Chit Chat</span></h1>
        <br />
        <p className="infoText"><span className="appName">Chit Chat</span> is chatting app which provides encrypted communication between all participants.
          It also enables easy file sending and private messages via P2P.</p>
        <div className="loginFlow">
          <h4 className="loginSubtitle">Register</h4>
          <form onSubmit={(e) => { e.preventDefault() }}>
            <input className="formInput" value={this.state.username} name="username" type="text" placeholder="Username" onChange={this.handleUsername}/><br/>
            <input className="formInput" value={this.state.password} name="password" type="password" placeholder="Password" onChange={this.handlePassword}/><br/>
            <input className="formInput" value={this.state.repeated} type="password" placeholder="Repeat Password" onChange={this.handleRepeated}/><br/>
            {this.renderButton()}
          </form>
        </div>
      </div>
      <div id="registerModal" className="modal fade bs-example-modal-sm" role="dialog" aria-labelledby="mySmallModalLabel">
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content registrationModal">
            Sorry the username is already taken!
          </div>
        </div>
      </div>
    </div>
  }
}
