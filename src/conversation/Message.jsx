import React from 'react';
import emojione from 'emojione';

export default class Message extends React.Component {

  constructor(props){
    super(props);

    this.renderEmojis = this.renderEmojis.bind(this);
  }

  messageClass(sender) {
    if (!sender || localStorage.ccUsername === sender) {
      return 'message sender';
    }

    return 'message reciver';
  }

  renderEmojis() {
    return {__html: emojione.shortnameToImage(this.props.children)};
  }

  render() {
    return <div className={this.messageClass(this.props.sender)} dangerouslySetInnerHTML={this.renderEmojis()}>
    </div>
  }
}
