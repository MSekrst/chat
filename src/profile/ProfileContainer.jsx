import React, { Component } from 'react';
import Profile from './Profile.jsx';

export default class ProfileContainer extends Component{

  constructor(props){
    super(props);

    if (this.props.location.query) {
      localStorage['ccToken'] = this.props.location.query ? this.props.location.query.token || '' : '';
      localStorage['ccUsername'] = this.props.location.query.username;
    }

    this.state={
      users: []
    }
  }

  render(){
    return <Profile users={this.state.users} open={this.openConversation} />;
  }
}
