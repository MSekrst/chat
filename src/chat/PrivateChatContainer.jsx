import React from 'react';
import { Redirect } from 'react-router';

import Chat from './Chat.jsx';
import { checkStatus, zeroPad } from '../helpers';

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {received: []};

    this.openPrivate = this.openPrivate.bind(this);
  }

  openPrivate(){
    $('#myModal3').modal('hide');
    this.setState({
      ...this.state, private: true
    });
  }

  render() {
    console.log("priv", this.state);
    if (this.state && this.state.private) {
      return <Redirect to="/private"/>
    }

    return <div className="container centered chat">
      <Chat active={this.state.active}
            received={this.state.received} openPrivate={this.openPrivate}
            private={true}
      />
    </div>;
  }
}
