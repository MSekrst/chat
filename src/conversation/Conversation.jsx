import React from 'react';

import Message from './Message.jsx';

let i = 0;

export default class Conversation extends React.Component {
  render() {
    if (this.props.active) {
      return <div id="currentConversation" className="messageContainer">
        {this.props.active.messages.map(m => <Message sender={m.sender}
                                                      key={i++}
                                                      fileId={m.fileId} >{m.text}</Message>)}
      </div>;
    }

    return <div></div>
  }
}
