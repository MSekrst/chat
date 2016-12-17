import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import 'whatwg-fetch';

import NotFound from './not-found/NotFound.jsx';
import Header from './header/Header.jsx';
import List from './list/List.jsx';
import Login from './login/Login.jsx';

export class App extends React.Component {

  render() {
    return (
      <div style={{width: "100%", height: "100%"}}>
        <div className="container centered chat">
          <Header />
          <List />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Login} />
    <Route path="/chat" componenet={App}/>
    <Route path="*" component={NotFound} />
  </Router>,
  document.getElementById('app')
);
