import React from 'react';

export default class TMP extends React.Component {
  constructor(props) {
    super(props);

    this.state = { text: '' };

    this.handleText = this.handleText.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage() {
    this.props.sender(this.state.text);
    this.setState({ text: '' });
  }

  handleText(e) {
    this.setState({ text: e.target.value });
  }

  render() {
    return <form className="inputForm" onSubmit={(e) => { e.preventDefault() }}>
      <input className="inputMessage" type="text" name="message" value={this.state.text} onChange={this.handleText}/>
      <input type="submit" hidden="true" onClick={this.sendMessage}/>
    </form>
  }
}
