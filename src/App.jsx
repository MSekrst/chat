import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';
import 'whatwg-fetch';

import NotFound from './not-found/NotFound.jsx';
import Login from './login/Login.jsx';
import Register from './register/Register.jsx';
import ChatContainer from './chat/ChatContainer.jsx';
import PrivateChatContainer from './chat/PrivateChatContainer.jsx';
import ProfileContainer from './profile/ProfileContainer.jsx';

ReactDOM.render(
    <BrowserRouter>
      <div id="mainDiv">
        <Match exactly pattern="/" component={Login} />
        <Match exactly pattern="/register" component={Register} />
        <Match exactly pattern="/chat" component={ChatContainer} />
        <Match exactly pattern="/private" component={PrivateChatContainer} />
        <Match exactly pattern="/profile" component={ProfileContainer} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>,
  document.getElementById('app')
);
