import React, {Component} from 'react';
var EmojiPicker = require('emojione-picker');

class Talk extends Component{

  constructor(props){
    super(props);

    this.state = {
      "emojiShow": false,
    }

    this.renderEmoji = this.renderEmoji.bind(this);
    this.emojiShow = this.emojiShow.bind(this);

  }

  renderEmoji(){
    if(this.state.emojiShow === true){
      return (<div style={{ position: "absolute", left: "0", bottom: "50px"}}>
        <EmojiPicker onChange={function(data){
              console.log("Emoji chosen", data);
          }} />
      </div>);
    }
  }

  emojiShow(){
    console.log("u show");
    this.setState({
      "emojiShow": !this.state.emojiShow,
    });
  }
  render(){
    return(

      <div id="talk">Talks {this.renderEmoji()}
        <div id="talkInput">
          <img src="./images/smiley.png" width="35px" height="35px" id="smileyButton" onClick={this.emojiShow}/>
          <input type="text" className="talkInput"/>
        </div>
      </div>
    );
  }
}

export default Talk;
