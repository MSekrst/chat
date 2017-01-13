import React from 'react';

import Message from './Message.jsx';

export default class CurrentConversation extends React.Component {
  render() {
    return <div id="currentConversation" className="messageContainer">
      {this.props.active.messages.map(m => <Message sender={m.sender}
                                                    key={m.date + '_' + m.time}
                                                    fileId={m.fileId} >{m.text}</Message>)}
    </div>
  }
}
