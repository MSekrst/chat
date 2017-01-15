import React from 'react';

import Header from '../header/Header.jsx';

export default class HeaderContainer extends React.Component {
  render() {
    return <Header styleName={this.props.styleName}/>;
  }
}
