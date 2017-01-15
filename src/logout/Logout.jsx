import React from 'react';
import { Redirect } from 'react-router';

export default class Logout extends React.Component {
  render() {
    localStorage.clear('ccToken');
    localStorage.clear('ccUsername');

    return <Redirect to="/"/>
  }
}
