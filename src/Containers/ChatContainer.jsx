import React from 'react';

import { checkStatus, zeroPad } from '../helpers';
import Chat from '../chat/Chat.jsx';

let io = null;

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { updateConversation:[], conversations: [], active: null, users: [] };

    this.clickHandler = this.clickHandler.bind(this);
    this.generateMessage = this.generateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.openConversation = this.openConversation.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.listenOnSocket = this.listenOnSocket.bind(this);
  }

  componentWillMount() {
    fetch('/api/messages', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      }
    }).then(checkStatus)
      .then(res => {
        res.json().then(conversations => {
          this.setState({conversations, active: conversations[0]});
        });
      }).catch(() => {
      this.setState({redirect: true});
    });

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

  listenOnSocket() {
    io.on('message', received => {
      const state = {...this.state};
      for (const m of state.conversations) {
        if (m._id === received.chatId) {
          m.messages.push(received);

          if (state.active._id !== received.chatId) {
            state.updateConversation.push(received.chatId);
          }

          break;
        }
      }

      this.setState(state);
    });
  }

  /**
   * HANDLERS FOR LIST
   */

  clickHandler(id) {
    // [0] to extract matching object from array
    this.setState({...this.state, active: this.state.conversations.filter(c => c._id === id)[0]});
  }

  generateMessage() {
    const now = new Date();

    return {
      date: zeroPad(now.getDate()) + '.' + zeroPad(now.getMonth() + 1) + '.' + now.getFullYear(),
      time: zeroPad(now.getHours()) + ':' + zeroPad(now.getMinutes()) + ':' + zeroPad(now.getSeconds()),
      chatId: this.state.active._id,
    };
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
          const conversations = this.state.conversations;
          let contains = false;
          conversations.filter(m => {console.log(m._id, conversation._id); if (m._id === conversation._id) contains = true; });
          if (!contains) {
            conversations.push(conversation);
          }

          // close add chat modal
          $('#myModal').modal('hide');

          this.setState({
            ...this.state,
            conversations,
            active: conversation,
          });
        });
      })
      .catch(() => {
        // conversation not opened
      });
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
          }).then(checkStatus)
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


  render() {
    if (!io && this.props.socket) {
      io = this.props.socket;
      this.listenOnSocket();
    }

    return <Chat conversations={this.state.conversations} active={this.state.active}
                 updateConversation={this.state.updateConversation} users={this.state.users}

                 click={this.clickHandler} open={this.openConversation} send={this.sendMessage}
                 upload={this.uploadFile}
    />;
  }
}
