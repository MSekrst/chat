import React from 'react';

import Message from './Message.jsx';

export default class Conversation extends React.Component {
  render() {
    return <div className="messageContainer">
      {this.props.active.messages.map(m => <Message sender={m.sender} key={m.date + '_' + m.time}>{m.text}</Message>)}
    </div>
  }
}
