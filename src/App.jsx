import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import 'whatwg-fetch';

import NotFound from './not-found/NotFound.jsx';

export class App extends React.Component {
  render() {
    return <div>
      APP
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
