import React from 'react';

import PrivateChat from '../chat/PrivateChatModals.jsx';
import { checkStatus } from '../helpers';

export default class PrivateChatContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {messages: null, activeUsers: null};

    this.openPrivate = this.openPrivate.bind(this);
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
    if (this.state.activeUsers && this.state.activeUsers.length) {
      $('#myModal3').modal('show');
      return;
    }

    if (this.state.activeUsers) {
      $('#myModal4').modal('show');
    }
  }

  openPrivate() {
    this.setState({ messages: [] });
  }

  render() {
    if (!this.state.activeUsers) {
      return <div></div>;
    }

    return <PrivateChatModals activeUsers={this.state.activeUsers} peer={this.props.peer}/>;
  }
}
