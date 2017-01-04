import React, {Component} from 'react';
import Item from './Item.jsx';

class List extends Component {
  render() {
    return (
      <div id="talkList">
        <div id="newTalk"><span className="glyphicon glyphicon-plus navIcon" />&nbsp;&nbsp;Add new talk</div>
        <div id="list">
          {this.props.messages.map(m => { return <Item key={m._id} name={m.title}  click={() => this.props.click(m._id)} /> })}
        </div>
      </div>
    );
  }
}

export default List;
