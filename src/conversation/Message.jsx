import React from 'react';
import emojione from 'emojione';

export default class Message extends React.Component {

  constructor(props){
    super(props);

    this.renderEmojis = this.renderEmojis.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
  }

  messageClass(sender) {
    if (!sender || localStorage.ccUsername === sender) {
      return 'message sender';
    } else {
      return 'message reciver';
    }
  }

  renderMessage() {
    const message = <div className={this.messageClass(this.props.sender)} dangerouslySetInnerHTML={this.renderEmojis()}></div>;

    if (this.props.fileId) {
      const link = './api/messages/getFile/' + this.props.fileId + '?token=' + localStorage.ccToken;
      return <a href={link}>{message}</a>
    }

    return message;
  }

  renderEmojis() {
    if (this.props.children) {
      return {__html: emojione.shortnameToImage(this.props.children)};
    }
  }

  render() {
    return this.renderMessage()
  }
}
