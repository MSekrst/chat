import React from 'react';
import { Redirect } from 'react-router';

import Chat from './Chat.jsx';
import { checkStatus } from '../helpers';

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props);

    localStorage['ccToken'] = this.props.location.query ? this.props.location.query.token || '' : '';

    this.state = {}
  }

  componentWillMount() {
    fetch('/api/messages', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      }
    }).then(checkStatus)
      .then(res => {
        res.json().then(messages => {
          this.setState({ messages });
        });
      }).catch(() => {
        this.setState({ redirect: true });
    });
  }

  render() {
    console.log('', this.state);

    if (this.state && this.state.redirect) {
      return <Redirect to="/"/>
    }

    if (this.state.messages) {
      return (
        <div style={{width: "100%", height: "100%"}}>
          <div className="container centered chat">
            <Chat messages={this.state.messages}/>
          </div>
        </div>
      );
    }

    return <div></div>
  }
}
