import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import 'whatwg-fetch';

import NotFound from './not-found/NotFound.jsx';
import Header from './header/Header.jsx';

export class App extends React.Component {
  render() {
    return <div className="container centered">
      <Header />
      <a href="/api/auth/facebook">FB LOGIN</a>
    </div>;
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="*" component={NotFound} />
  </Router>,
  document.getElementById('app')
);
