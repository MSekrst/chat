import React from 'react';
import { Link } from 'react-router';

export default class NotFound extends React.Component {
  render() {
    return <div>
      <div className="container pagePadding centered picture404">
        <h1>Sorry page not found!</h1>
        <h3>Click <Link className="link404" to="/">here</Link> to return.</h3><br />
      </div>
    </div>;
  }
}
