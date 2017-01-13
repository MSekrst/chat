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

    this.state = {received: []};

    this.clickHandler = this.clickHandler.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.openConversation = this.openConversation.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.generateMessage = this.generateMessage.bind(this);
  }

  componentWillMount() {
    fetch('/api/messages', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      }
    }).then(checkStatus)
      .then(res => {
        res.json().then(messages => {
          this.setState({messages, active: messages[0]});
        });
      }).catch(() => {
      this.setState({redirect: true});
    });

    const socketIo = window.io.connect();
    socketIo.emit('user', {
      username: localStorage.ccUsername,
    });

    this.setState({...this.state, socketIo});
  }

  componentDidMount() {
    const io = this.state.socketIo;

    this.getUsers();

    io.on('message', received => {
      const state = {...this.state};
      for (const m of state.messages) {
        if (m._id === received.chatId) {
          m.messages.push(received);

          if (state.active._id !== received.chatId) {
            state.received.push(received.chatId);
          }

          break;
        }
      }

      this.setState(state);
    });
  }

  generateMessage() {
    const now = new Date();

    return {
      date: zeroPad(now.getDate()) + '.' + zeroPad(now.getMonth() + 1) + '.' + now.getFullYear(),
      time: zeroPad(now.getHours()) + ':' + zeroPad(now.getMinutes()) + ':' + zeroPad(now.getSeconds()),
      chatId: this.state.active._id,
    };
  }

  // passed as click prop
  clickHandler(id) {
    // [0] to extract matching object from array
    this.setState({...this.state, active: this.state.messages.filter(c => c._id === id)[0]});
  }

  uploadFile(file, title) {
    fetch(file.preview).then(res => {
      res.blob().then(data => {
        console.log('data', data);
        const reader = new FileReader();
        reader.addEventListener("loadend", loadedFile => {
          const toSend = loadedFile.currentTarget.result;
          console.log('lf', loadedFile);
          console.log('ts', toSend);
          const message = this.generateMessage();
          message.bin = toSend;
          message.text = title;
          fetch('/api/messages/uploadFile/' + this.state.active._id, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.ccToken,
              'Content-Type': "application/json",
            },
            body: JSON.stringify({bin: toSend}),
          });
        });
        reader.readAsArrayBuffer(data);
      })
    });
  }

  sendMessage(text) {
    const message = this.generateMessage();
    message.text = text;

    fetch('/api/messages/' + this.state.active._id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.ccToken,
      },
      body: JSON.stringify({message}),
    }).then(checkStatus)
      .then(() => {
        const active = this.state.active;
        active.messages.push(message);

        this.setState({...this.state, active});
      })
      .catch(err => {
        // message not saved
      });
  }

  getUsers() {
    fetch('/api/users', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      },
    }).then(checkStatus)
      .then(res => {
        res.json().then(users => {
          users = users.map(u => {
            return {label: u.username, image: u.image, value: u._id}
          });

          this.setState({...this.state, users});
        });
      })
      .catch(err => {
        // message not saved
      });
  }

  openConversation(rec) {
    const users = [{
      username: rec.label,
      image: rec.image,
    }];

    fetch('/api/messages/init', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.ccToken,
      },
      body: JSON.stringify({ users }),
    }).then(checkStatus)
      .then(res => {
        res.json().then(conversation => {
          const messages = this.state.messages;
          let contains = false;
          messages.filter(m => {console.log(m._id, conversation._id); if (m._id === conversation._id) contains = true; });
          if (!contains) {
            messages.push(conversation);
          }

          // close add chat modal
          $('#myModal').modal('hide');

          this.setState({
            ...this.state,
            messages,
            active: conversation,
          });
        });
      })
      .catch(() => {
        // conversation not opened
      });
  }

  render() {
    if (this.state && this.state.redirect) {
      return <Redirect to="/"/>
    }

    if (this.state.messages) {
      return (
        <div className="container centered chat">
          <Chat messages={this.state.messages} active={this.state.active}
                received={this.state.received} open={this.openConversation}
                uploadFile={this.uploadFile}
                click={this.clickHandler} sender={this.sendMessage} users={this.state.users}/>
        </div>
      );
    }

    return <div></div>
  }
}
