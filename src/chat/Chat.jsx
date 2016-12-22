import React from 'react';

import Header from '../header/Header.jsx';
import List from '../list/List.jsx';
import Talk from '../talk/Talk.jsx';
import Conversation from '../conversation/Conversation.jsx';
import TMP from '../talk/TMP.jsx';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return <div>
      <Header/>
      <List messages={this.props.messages} click={this.props.click}/>
      <Conversation active={this.props.active} />
      {/*<Talk />*/}
      <TMP sender={this.props.sender} />
    </div>;
  }
}
