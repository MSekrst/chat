import React, { Component } from 'react';

import Profile from './Profile.jsx';
import { checkStatus } from '../helpers';

export default class ProfileContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: []
    }
  }

  componentWillMount() {
    fetch('/api/users/profile', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      }
    }).then(checkStatus)
      .then(res => {
        res.json().then(profile => {
          this.setState({...this.state, profile});
        });
      }).catch(err => {
      // profile not fetched
    });

    fetch('/api/users/active', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.ccToken,
      }
    }).then(checkStatus)
      .then(res => {
        res.json().then(activeUsers => {
          activeUsers = activeUsers.map(u => {
            return {label: u, value: u}
          });

          this.setState({...this.state, activeUsers});
        });
      }).catch(err => {
      // error while fetching active users
    });
  }

  render() {
    return <Profile activeUsers={this.state.activeUsers} open={this.openConversation}
                    profile={this.state.profile}/>;
  }
}
