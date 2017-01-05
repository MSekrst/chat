import React, {Component} from 'react';
import EmojiPicker from 'emojione-picker';

import CurrentConversation from './CurrentConversation.jsx';

function scroll() {
  const element = document.getElementById("currentConversation");
  element.scrollTop = element.scrollHeight;
}

export default class ConversationContainer extends Component{
  constructor(props){
    super(props);

    this.state = {
      text: '',
      emojiShow: false,
    };

    this.handleText = this.handleText.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.renderEmoji = this.renderEmoji.bind(this);
    this.emojiShow = this.emojiShow.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
  }

  componentDidMount() {
    scroll();
  }

  componentDidUpdate() {
    scroll();
  }

  sendMessage() {
    this.props.sender(this.state.text);
    this.setState({ text: '' });
  }

  handleText(e) {
    this.setState({ text: e.target.value });
  }

  addEmoji(emoji){
    this.setState({ text: this.state.text + " " + emoji});
  }

  renderEmoji(){
    if(this.state.emojiShow === true){
      return (<div style={{ position: "absolute", left: "0", bottom: "50px"}}>
        <EmojiPicker onChange={(data) => {
                this.addEmoji(data.shortname);
          }} onBlur={() => {
          this.setState({ emojiShow: false });
        }} />
      </div>);
    }
  }

  emojiShow(){
    console.log("event");
    this.setState({
      emojiShow: !this.state.emojiShow,
    });
  }

  render() {
    return (
      <div id="talk">{this.renderEmoji()}
        <CurrentConversation active={this.props.active}/>
        <form id="talkInput" className="inputForm" onSubmit={(e) => {
          e.preventDefault()
        }}>
          <img src="./images/smileyButton.png" width="35px" height="35px" id="smileyButton"
              onBlur={this.emojiShow} onClick={this.emojiShow}/>
          <input className="talkInput" type="text" value={this.state.text}
                 onChange={this.handleText}/>
          <input type="submit" hidden="true" onClick={this.sendMessage}/>
          <img src="./images/file.png" width="25px" height="25px" id="fileButton"
               />
          <img src="./images/send.png" width="35px" height="35px" id="sendButton"
               onClick={this.sendMessage}/>
        </form>
      </div>
    );
  }
}
