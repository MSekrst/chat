import React from 'react';

import Header from '../header/Header.jsx';
import List from '../list/List.jsx';
import CurrentConversation from '../conversation/Conversation.jsx';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderActive = this.renderActive.bind(this);
  }

  renderActive() {
    if (this.props.active) {
      return <CurrentConversation sender={this.props.sender} active={this.props.active}/>;
    }
  }

  render() {
    return <div>
      <Header username={localStorage.ccUsername}/>
      <List messages={this.props.messages} received={this.props.received}
            active={this.props.active } users={this.props.users}
            open={this.props.open} click={this.props.click}/>
      {this.renderActive()}
    </div>;
  }
}
