import React from 'react';
import { Redirect } from 'react-router';

import Chat from './Chat.jsx';
import { checkStatus, zeroPad } from '../helpers';

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.location.query) {
      localStorage['ccToken'] = this.props.location.query ? this.props.location.query.token || '' : '';
      localStorage['ccUsername'] = this.props.location.query.username;
    }

    this.state = {};

    this.clickHandler = this.clickHandler.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    fetch('/api/messages', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      }
    }).then(checkStatus)
      .then(res => {
        res.json().then(messages => {
          this.setState({ messages, active: messages[0] });
        });
      }).catch(() => {
        this.setState({ redirect: true });
    });

    const socketIo = window.io.connect();
    socketIo.emit('user', {
      username: localStorage.ccUsername,
    });
    this.setState({ ...this.state, socketIo });
  }

  componentDidMount() {
    const io = this.state.socketIo;
    io.on('message', m => {
      console.log('m', m);
    });
  }

  // passed as click prop
  clickHandler(id) {
    // [0] to extract matching object from array
    this.setState({ ...this.state, active: this.state.messages.filter(c => c._id === id )[0]});
  }

  sendMessage(text) {
    const now = new Date();
    const message = {
      date: now.getFullYear() + '.' + zeroPad(now.getMonth() + 1) + '.' + zeroPad(now.getDate()),
      time: zeroPad(now.getHours()) + ':' + zeroPad(now.getMinutes()) + ':' + zeroPad(now.getSeconds()),
      text,
      title: this.state.active.title,
    };

    console.log('', message);

    fetch('/api/messages/' + this.state.active._id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.ccToken,
      },
      body: JSON.stringify({ message }),
    }).then(checkStatus)
      .then(() => {
        const active = this.state.active;
        active.messages.push(message);

        this.setState({ ...this.state, active });
      })
      .catch(err => {
        // message not saved
      });
  }

  render() {
    if (this.state && this.state.redirect) {
      return <Redirect to="/"/>
    }

    if (this.state.messages) {
      return (
        <div style={{width: "100%", height: "100%"}}>
          <div className="container centered chat">
            <Chat messages={this.state.messages} active={this.state.active} click={this.clickHandler} sender={this.sendMessage}/>
          </div>
        </div>
      );
    }

    return <div></div>
  }
}
