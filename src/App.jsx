import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';
import 'whatwg-fetch';

import NotFound from './not-found/NotFound.jsx';
import Login from './login/Login.jsx';
import Register from './register/Register.jsx';
import ChatContainer from './chat/ChatContainer.jsx';

ReactDOM.render(
  <div>
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={Login} />
        <Match exactly pattern="/register" component={Register} />
        <Match exactly pattern="/chat" component={ChatContainer} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  </div>,
  document.getElementById('app')
);
