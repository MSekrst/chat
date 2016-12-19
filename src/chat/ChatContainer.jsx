import React from 'react';

import Chat from './Chat.jsx';
import { checkStatus } from '../helpers';

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props);

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
          console.log(messages);
          this.state = messages;
        });
      }).catch(() => {
        this.setState({ redirect: true });
    });
  }

  render() {
    if (this.state && this.state.redirect) {
      return <Redirect to="/"/>
    }

    return (
      <div style={{width: "100%", height: "100%"}}>
        <div className="container centered chat">
          <Chat messages={this.state.messages}/>
        </div>
      </div>
    );
  }
}
