import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';
import 'whatwg-fetch';

import NotFound from './not-found/NotFound.jsx';
import Login from './login/Login.jsx';
import Register from './register/Register.jsx';
import MainContainer from './Containers/MainContainer.jsx';
import Logout from './logout/Logout.jsx';

ReactDOM.render(
    <BrowserRouter>
      <div id="mainDiv">
        <Match exactly pattern="/" component={Login} />
        <Match exactly pattern="/register" component={Register} />
        <Match exactly pattern="/chat" component={MainContainer} />
        <Match exactly pattern="/private" component={MainContainer} />
        <Match exactly pattern="/profile" component={MainContainer}  />
        <Match exactly pattern="/logout" component={Logout} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>,
  document.getElementById('app')
);
