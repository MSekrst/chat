import React from 'react';

import Chat from './Chat.jsx'

export default class ChatContainer extends React.Component {
  componentWillMount() {
    if (!this.props.location.query) {
      return this.setState({ redirect: true });
    }

    const token = this.props.location.query.token || '';

    if (!token) {
      return this.setState({ redirect: true });
    }

    localStorage['ccToken'] = token;
  }

  render() {
    if (this.state && this.state.redirect) {
      return <Redirect to="/"/>
    }

    return (
      <div style={{width: "100%", height: "100%"}}>
        <div className="container centered chat">
          <Chat />
        </div>
      </div>
    );
  }
}
