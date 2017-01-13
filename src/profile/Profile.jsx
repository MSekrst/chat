import React, {Component} from 'react';

import Header from '../header/Header.jsx';

export default class ConversationContainer extends Component{

  constructor(props){
    super(props);

    this.renderPersonal = this.renderPersonal.bind(this);
    this.renderStatistic = this.renderStatistic.bind(this);
    this.renderFavourites = this.renderFavourites.bind(this);
  }

  renderPersonal(img){
    if(!img){
      return <div className="personalData">
                <div style={{ width: "100%"}} className="userName">Bruna</div>
             </div>;
    }
    return <div className="personalData">
              <div className="userPic"></div>
              <div style={{ width: "70%"}} className="userName">Bruna</div>
           </div>

  }

  renderStatistic(){
      return <div>
                <div className="profileRow">
                  <div className="profileLabel">Number of open chats:</div>
                  <div className="profileValue">8</div>
                </div>
                <div className="profileRow">
                  <div className="profileLabel">Number of sent messages</div>
                  <div className="profileValue">258</div>
                </div>
                <div className="profileRow">
                  <div className="profileLabel">Number of received messages:</div>
                  <div className="profileValue">578</div>
                </div>
            </div>
  }

  renderFavourites(){
    return <div>
              <div className="profileRow">
                <div className="profileLabel" style={{ color: "#fc7575", fontSize: "25px"}}>Favourites</div>
              </div>
              <div className="favouritesRow">
                <img src={ this.props.picture || "./images/profilePlaceholder.jpg"} className="img-circle favouriterImage " alt="Cinque Terre"
                     width="50px" height="50px"/>
                <div className="profileLabel favouritesRowPart">Bruna</div>
                <div className="profileLabel favouritesRowPart" style={{ textAlign: "center"}}>received:&nbsp;&nbsp;&nbsp;&nbsp;<span className="favouritesNumber">2</span></div>
                <div className="profileLabel favouritesRowPart" style={{ textAlign: "right"}}>sent:&nbsp;&nbsp;&nbsp;&nbsp;<span className="favouritesNumber">2</span></div>
              </div>
              <div className="favouritesRow">
                <img src={ this.props.picture || "./images/profilePlaceholder.jpg"} className="img-circle favouriterImage " alt="Cinque Terre"
                     width="50px" height="50px"/>
                <div className="profileLabel favouritesRowPart">Marko</div>
                <div className="profileLabel favouritesRowPart" style={{ textAlign: "center"}}>received:&nbsp;&nbsp;&nbsp;&nbsp;<span className="favouritesNumber">3</span></div>
                <div className="profileLabel favouritesRowPart" style={{ textAlign: "right"}}>sent:&nbsp;&nbsp;&nbsp;&nbsp;<span className="favouritesNumber">9</span></div>
              </div>
           </div>
  }

  render(){
    return (
      <div>
        <Header username={localStorage.ccUsername} users={this.props.users} open={this.props.openPrivate}/>
        <div className="profile">
          {this.renderPersonal(this.props.img)}
          <hr className="divider"/>
          {this.renderStatistic()}
          <hr className="divider"/>
          {this.renderFavourites()}
        </div>
      </div>
    );
  }
}
