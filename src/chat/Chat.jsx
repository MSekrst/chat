import React from 'react';

import List from '../list/List.jsx';
import ConversationArea from '../conversation/ConversationArea.jsx';

export default class Chat extends React.Component {
  render() {
    return <div>
      <List conversations={this.props.conversations}
            updatedConversation={this.props.updatedConversation} active={this.props.active }

            users={this.props.users} open={this.props.open} click={this.props.click}
      />
      <ConversationArea active={this.props.active}

                    send={this.props.send} upload={this.props.upload} file={this.props.file}
      />
    </div>;
  }
}
