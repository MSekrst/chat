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
    this.openPrivate = this.openPrivate.bind(this);
    this.generateMessage = this.generateMessage.bind(this);
    this.getPrivateUsers = this.getPrivateUsers.bind(this);
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

    const username = localStorage.ccUsername;

    const socketIo = window.io.connect();

    this.setState({...this.state, socketIo});

    const peer = new window.Peer({host: '/', port: 9000, secure: true});
    peer.on('open', peerId => {
      socketIo.emit('user', {
        username, peerId
      });

      this.setState({...this.state, peer});
    });
  }

  componentDidMount() {
    const io = this.state.socketIo;

    this.getUsers();
    this.getPrivateUsers();

    io.on('message', received => {
      const state = { ...this.state };
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
        const reader = new FileReader();
        reader.addEventListener("loadend", loadedFile => {
          const toSend = loadedFile.currentTarget.result;
          const message = this.generateMessage();
          message.bin = Array.apply(null, new Uint8Array(toSend));
          message.text = title;
          fetch('/api/messages/uploadFile/' + this.state.active._id, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.ccToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({message}),
          })
            .then(checkStatus)
            .then(res => {
              res.json().then(data => {
                const active = this.state.active;
                active.messages.push(data);

                this.setState({...this.state, active});
              })
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

          this.setState({ ...this.state, users });
        });
      })
      .catch(err => {
        // message not saved
      });
  }

  getPrivateUsers() {
     fetch('/api/users/active', {
       headers: {
         'Authorization': 'Bearer ' + localStorage.ccToken,
       }
     }).then(checkStatus)
       .then(res => {
         res.json().then(activeUsers => {
           activeUsers = activeUsers.map(u => { return { label: u, value: u } });
           this.setState({ ...this.state, activeUsers });
         });
       }).catch(err => {
       // error while getting active users
     });
  }

  openConversation(rec) {
    const users = [{
      image: rec.image,
      username: rec.label,
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

  openPrivate() {
    $('#myModal3').modal('hide');
    this.setState({
      ...this.state, private: true
    });
  }

  render() {
    if (this.state && this.state.redirect) {
      return <Redirect to="/"/>
    }

    if (this.state && this.state.private){
      return <Redirect to="/private" />
    }

    if (this.state.messages) {
      return (
        <div className="container centered chat">
          <Chat messages={this.state.messages} active={this.state.active}
                received={this.state.received} open={this.openConversation} openPrivate={this.openPrivate}
                uploadFile={this.uploadFile} private={false} activeUsers={this.state.activeUsers}
                click={this.clickHandler} sender={this.sendMessage} users={this.state.users}/>
        </div>
      );
    }

    return <div></div>
  }
}
