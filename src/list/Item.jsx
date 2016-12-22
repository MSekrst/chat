import React, {Component} from 'react';

class Item extends Component {
  render() {
    return (
      <div>
        <div className="item" onClick={this.props.click}>
          <div className="imageItem">
            <img src={this.props.picture} className="img-circle profileImage" alt="Cinque Terre"
                 width="50px" height="50px"/>
          </div>
          <div className="nameItem">
            {this.props.name}
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
