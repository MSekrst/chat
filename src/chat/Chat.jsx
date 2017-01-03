import React from 'react';

import Header from '../header/Header.jsx';
import List from '../list/List.jsx';
import CurrentConversation from '../conversation/Conversation.jsx';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return <div>
      <Header/>
      <List messages={this.props.messages} click={this.props.click}/>
      <CurrentConversation sender={this.props.sender} active={this.props.active}/>
    </div>;
  }
}
