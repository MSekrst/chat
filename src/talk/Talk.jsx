import React, {Component} from 'react';
var EmojiPicker = require('emojione-picker');

class Talk extends Component{
  render(){
    return(
      <div style={{ position: "absolute", left: "70%", top: "70%"}}>
      <EmojiPicker onChange={function(data){
  console.log("Emoji chosen", data);
}} />
        </div>
    );
  }
}

export default Talk;
