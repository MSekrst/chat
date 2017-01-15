import React, { Component } from 'react';

import Profile from '../profile/Profile.jsx';
import { checkStatus } from '../helpers';

export default class ProfileContainer extends Component {
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
  }

  render() {
    if (this.state && this.state.profile) {
      return <Profile profile={this.state.profile}/>;
    }

    return <div></div>;
  }
}
