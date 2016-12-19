import React from 'react';
import { Redirect } from 'react-router';

import Header from '../header/Header.jsx';
import List from '../list/List.jsx';
import Talk from '../talk/Talk.jsx';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return <div>
      <Header/>
      <List/>
      <Talk />
    </div>;
  }
}
