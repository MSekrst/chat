import React from 'react';

import PrivateChatModals from '../chat/PrivateChatModals.jsx';
import ConversationArea from '../conversation/ConversationArea.jsx';
import { checkStatus } from '../helpers';

let peerConnection = null;

export default class PrivateChatContainer extends React.Component {
  constructor(props) {
    super(props);

    this.openPrivate = this.openPrivate.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.waitForPeer = this.waitForPeer.bind(this);
    this.saveMessage = this.saveMessage.bind(this);

    if (this.props.con) {
      this.state = {setup: false, active: { messages: []}};

      this.waitForPeer(this.props.con);
    } else {
      this.state = {setup: true, active: null, activeUsers: null};
    }
  }

  componentWillMount() {
    fetch('/api/users/active', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      }
    }).then(checkStatus)
      .then(res => {
        res.json().then(activeUsers => {
          activeUsers = activeUsers.map(u => {
            return {label: u.username, value: u.peerId}
          });
          this.setState({...this.state, activeUsers});
        })
      })
      .catch(err => {

      });
  }

  componentDidUpdate() {
    if (!this.state.activeUsers) {
      return;
    }

    if (this.state.activeUsers.length) {
      $('#myModal3').modal('show');
    } else {
      $('#myModal4').modal('show');
    }
  }

  openPrivate(user) {
    $('#myModal3').modal('hide');

    const peer = this.props.peer;

    if (peer) {
      peerConnection = peer.connect(user.value);

      peerConnection.on('data', this.saveMessage);

      this.setState({setup: false, active: {messages: []}});
    }
  }

  sendMessage(text) {
    const message = {
      text,
      sender: localStorage.ccUsername,
    };

    peerConnection.send(message);

    const active = this.state.active;
    active.messages.push(message);

    this.setState({ ...this.state, active });
  }

  saveMessage(data) {
    const active = this.state.active;
    active.messages.push(data);

    this.setState({ ...this.state, active });
  }

  waitForPeer(con) {
    if (!peerConnection) {
      peerConnection = con;
    }

    peerConnection.on('data', this.saveMessage);
  }

  render() {
    if (this.state.setup && !this.state.activeUsers) {
      return <div></div>;
    }

    if (this.state.setup) {
      return <PrivateChatModals activeUsers={this.state.activeUsers}

                                open={this.openPrivate}
      />;
    }

    return <ConversationArea active={this.state.active} styleName="privateChat" stretch="stretchDiv"

                             send={this.sendMessage}
    />;
  }
}
