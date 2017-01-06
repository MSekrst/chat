import React, {Component} from 'react';

class Item extends Component {
  renderImage() {
    console.log('renderIMAGE');
  }

  render() {
    return (
      <div>
        <div className="item" onClick={this.props.click}>
          <div className="imageItem">
            {this.renderImage()}
            <img src="./images/profilePlaceholder.jpg" className="img-circle profileImage" alt="Cinque Terre"
                 width="50px" height="50px"/>
          </div>
          <div className="nameItem">
            {this.props.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase()+ txt.substr(1)})}
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
