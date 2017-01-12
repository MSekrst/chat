import React, {Component} from 'react';
import EmojiPicker from 'emojione-picker';

import Dropzone from 'react-dropzone';

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
    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    scroll();
  }

  componentDidUpdate() {
    scroll();
  }

  sendMessage() {
    if (this.state.text) {
      this.props.sender(this.state.text);
      this.setState({text: ''});
    }
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

  onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length) {
      this.props.uploadFile(acceptedFiles[0], acceptedFiles[0].name);
      $('#myModal2').modal('hide');
    } else {
      var modal = $('#myModal2');
      modal.find('.modal-body div').text('Error occured during the uploading of the file. Maximum length you can upload is 16MB. Try again. ');
      console.log("error");
    }
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
          <img src="./images/file.png" width="25px" height="25px" id="fileButton" data-toggle="modal" data-target="#myModal2"
               />
          <img src="./images/send.png" width="35px" height="35px" id="sendButton"
               onClick={this.sendMessage}/>
        </form>

        <div className="modal fade" id="myModal2" tabIndex="-1" role="dialog"
             aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" id="myModalLabel">Upload files</h4>
              </div>
              <div className="modal-body">
                <Dropzone onDrop={this.onDrop} multiple={false} maxSize={16777216} className="fileDrop" activeClassName="fileDropActive">
                  <div>Try dropping some files here, or click to select files to upload.</div>
                  <br/>
                  <img src="./images/upload.png" width="150px" height="150px" />
                </Dropzone>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
