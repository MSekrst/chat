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

        <div className="modal fade" id="myModal5" tabIndex="-1" role="dialog"
             aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" id="myModalLabel"><span
                  className="glyphicon glyphicon-search talkIcon"/>&nbsp;&nbsp;&nbsp;&nbsp;You have private chat request</h4>
              </div>
              <div className="modal-body noAvailableModal">
                  <button type="button" className="btn btn-success" data-dismiss="modal" aria-label="Close">Accept</button>
                &nbsp;&nbsp;&nbsp;
                <a href="/chat">
                  <button className="btn btn-danger">Decline</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>,
  document.getElementById('app')
);
