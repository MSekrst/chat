import React from 'react';

export default class Message extends React.Component {
  messageClass(sender) {
    console.log('', sender, localStorage.ccUsername);

    if (!sender || localStorage.ccUsername === sender) {
      return 'message sender';
    }

    return 'message reciver';
  }

  render() {
    return <div className={this.messageClass(this.props.sender)}>
      {this.props.children}
    </div>
  }
}
