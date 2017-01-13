import React from 'react';

import Chat from './Chat.jsx';
import { checkStatus } from '../helpers';

export default class ChatContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {received: []};

    this.openPrivate = this.openPrivate.bind(this);
  }

  componentWillMount() {
    fetch('/api/users/private', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      }
    }).then(checkStatus)
      .then(res => {
        res.json().then(users => {
          console.log('users', users);
        })
      })
      .catch(err => {
        // users error
      });

  }

  openPrivate(){
    $('#myModal3').modal('hide');
    this.setState({
      ...this.state, private: true
    });
  }

  render() {
    return <div className="container centered chat">
      <Chat active={this.state.active}
            received={this.state.received} openPrivate={this.openPrivate}
            private={true}
      />
    </div>;
  }
}
