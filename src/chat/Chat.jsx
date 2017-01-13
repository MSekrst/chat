import React from 'react';

import Header from '../header/Header.jsx';
import List from '../list/List.jsx';
import Conversation from '../conversation/Conversation.jsx';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderActive = this.renderActive.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  renderHeader(){
    if(this.props.private){
      return(
        <Header username={localStorage.ccUsername} styleName={"backBackground"} users={this.props.users} open={this.props.openPrivate}/>
      );
    }
    return(
      <Header username={localStorage.ccUsername} users={this.props.users} open={this.props.openPrivate}/>
    );
  }

  renderList() {
    if (!this.props.private) {
      return <List messages={this.props.messages} received={this.props.received}
                   active={this.props.active } users={this.props.users}
                   open={this.props.open} click={this.props.click}/>;
    }
  }

  renderActive() {
    if(this.props.active && this.props.private){
      return <Conversation sender={this.props.sender} active={this.props.active} uploadFile={this.props.uploadFile} styleName={"darkInput"} resize={"fullScreen"}/>;
    }
    if (this.props.active) {
      return <Conversation sender={this.props.sender} active={this.props.active} uploadFile={this.props.uploadFile} />;
    }
  }

  render() {
    return <div>
      {this.renderHeader()}
      {this.renderList()}
      {this.renderActive()}
    </div>;
  }
}
