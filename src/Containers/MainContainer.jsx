import React from 'react';
import { Redirect } from 'react-router';

import HeaderContainer from './HeaderContainer.jsx';
import ChatContainer from './ChatContainer.jsx';
import PrivateChatContainer from './PrivateChatContainer.jsx';
import ProfileContainer from './ProfileContainer.jsx';

export default class MainContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      peer: null,
      socketIo: null,
    };

    if (this.props.location.query) {
      localStorage['ccToken'] = this.props.location.query ? this.props.location.query.token || '' : '';
      localStorage['ccUsername'] = this.props.location.query.username || '';
    }

    if (!localStorage.ccToken || !localStorage.ccUsername) {
      this.state = { redirect: true }
    }

    this.renderContainersByRoute = this.renderContainersByRoute.bind(this);
  }

  componentDidMount() {
    const username = localStorage.ccUsername;
    const socketIo = window.io.connect();
    this.setState({...this.state, socketIo });

    const peer = new window.Peer({host: '/', port: 9000, secure: true});
    peer.on('open', peerId => {
      socketIo.emit('user', {
        username, peerId
      });

      this.setState({...this.state, peer});
    });
  }

  // getPrivateUsers() {
  //    fetch('/api/users/active', {
  //      headers: {
  //        'Authorization': 'Bearer ' + localStorage.ccToken,
  //      }
  //    }).then(checkStatus)
  //      .then(res => {
  //        res.json().then(activeUsers => {
  //          activeUsers = activeUsers.map(u => { return { label: u, value: u } });
  //          this.setState({ ...this.state, activeUsers });
  //        });
  //      }).catch(err => {
  //      // error while getting active users
  //    });
  // }

  // openPrivate() {
  //   $('#myModal3').modal('hide');
  //   this.setState({
  //     ...this.state, private: true
  //   });
  // }

  renderContainersByRoute() {
    const currentPath = this.props.location.pathname || '';

    switch (currentPath) {
      case '/chat' :
        return <div>
          <HeaderContainer/>
          <ChatContainer socket={this.state.socketIo}/>
        </div>;

      case '/private' :
        return <div>
          <HeaderContainer styleName="privateChat"/>
          <PrivateChatContainer socket={this.state.socketIo} peer={this.state.peer}/>
        </div>;

      case '/profile' :
        return <div>
          <HeaderContainer/>
          <ProfileContainer/>
        </div>;
      default:
        return <Redirect to="/logout"/>
    }
  }

  render() {
    if (this.state && this.state.redirect) {
      return <Redirect to="/logout"/>
    }

    return this.renderContainersByRoute();
  }
}
