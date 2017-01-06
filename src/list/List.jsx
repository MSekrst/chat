import React, {Component} from 'react';
import Item from './Item.jsx';

class List extends Component {
  render() {
    return (
      <div id="talkList">
        <button id="newTalk" type="button" data-toggle="modal" data-target="#myModal">
          <div ><span className="glyphicon glyphicon-plus talkIcon"/>&nbsp;&nbsp;Add new talk</div>
        </button>
        <div id="list">
          {this.props.messages.map(m => {
            const reciver = m.users.filter(u => u.username !== localStorage.ccUsername)[0];
            return <Item key={m._id}
                         name={reciver.username}
                         picture={reciver.image || ''}
                         click={() => this.props.click(m._id)}/>
          })}
        </div>

        <div className="modal fade" id="myModal" tabIndex="-1" role="dialog"
             aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" id="myModalLabel"><span
                  className="glyphicon glyphicon-search talkIcon"/>&nbsp;&nbsp;&nbsp;&nbsp;Find
                  friend</h4>
              </div>
              <div className="modal-body">
                ...
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default List;
