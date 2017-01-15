import React, { Component } from 'react';

import Header from '../header/Header.jsx';

export default class ConversationContainer extends Component {

  constructor(props) {
    super(props);

    this.renderPersonal = this.renderPersonal.bind(this);
    this.renderStatistic = this.renderStatistic.bind(this);
    this.renderFavourites = this.renderFavourites.bind(this);
    this.addFavourite = this.addFavourite.bind(this);
  }

  renderPersonal(img) {
    return <div className="personalData">
      <img src={ img || "./images/profilePlaceholder.jpg"}
           className="img-circle favouriterImage myProfileImage" alt="IMG"
           width="50px" height="50px"/>
      <div style={{width: "70%"}} className="userName">{this.props.profile.username}</div>
    </div>

  }

  renderStatistic() {
    return <div>
      <div className="profileRow">
        <div className="profileLabel">Number of open chats:</div>
        <div className="profileValue">{this.props.profile.numberOfConversations}</div>
      </div>
      <div className="profileRow">
        <div className="profileLabel">Number of sent messages</div>
        <div className="profileValue">{this.props.profile.totalSendMessages}</div>
      </div>
      <div className="profileRow">
        <div className="profileLabel">Number of received messages:</div>
        <div className="profileValue">{this.props.profile.totalReceivedMessages}</div>
      </div>
    </div>
  }

  renderFavourites() {
    return <div>
      <div className="profileRow">
        <div className="profileLabel" style={{color: "#fc7575", fontSize: "25px"}}>Favourites</div>
      </div>
      {this.props.profile.favourites.map(f => this.addFavourite(f))}
    </div>
  }

  addFavourite(f) {
    return <div className="favouritesRow" key={f.username}>
      <img src={ f.img || "./images/profilePlaceholder.jpg"}
           className="img-circle favouriterImage " alt="Cinque Terre"
           width="50px" height="50px"/>
      <div className="profileLabel favouritesRowPart">{f.username}</div>
      <div className="profileLabel favouritesRowPart" style={{textAlign: "center"}}>
        received:&nbsp;&nbsp;&nbsp;&nbsp;<span className="favouritesNumber">{f.receivedMessages}</span></div>
      <div className="profileLabel favouritesRowPart" style={{textAlign: "right"}}>
        sent:&nbsp;&nbsp;&nbsp;&nbsp;<span className="favouritesNumber">{f.sendMessages}</span></div>
    </div>;
  }

  render() {
    if (!this.props.profile) {
      return <div></div>
    }

    return (
      <div>
        <Header username={localStorage.ccUsername} activeUsers={this.props.activeUsers}
                open={this.props.openPrivate}/>
        <div className="profile">
          {this.renderPersonal(this.props.profile.image)}
          <hr className="divider"/>
          {this.renderStatistic()}
          <hr className="divider"/>
          {this.renderFavourites()}
        </div>
      </div>
    );
  }
}
