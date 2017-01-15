import React from 'react';
import Select from 'react-select';

export default class PrivateChatModals extends React.Component {
  render() {
    return <div>
      <div className="modal fade" id="myModal3" tabIndex="-1" role="dialog"
           aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="myModalLabel"><span
                className="glyphicon glyphicon-search talkIcon"/>&nbsp;&nbsp;&nbsp;&nbsp;Choose a
                friend for a private chat</h4>
            </div>
            <div className="modal-body">
              <Select
                name="users"
                options={this.props.activeUsers}
                onChange={this.props.open}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="myModal4" tabIndex="-1" role="dialog"
           aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="myModalLabel"><span
                className="glyphicon glyphicon-remove talkIcon"/>&nbsp;&nbsp;&nbsp;&nbsp;No users
                available</h4>
            </div>
            <div className="modal-body noAvailableModal">
              <a href="/chat">
                <button className="btn btn-danger">Go back</button>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>;
  }
}
