import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";

class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: []
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  sendMessage = () => {
    const { messagesRef, channel } = this.props;
    const { message } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: [...this.state.errors, err]
          });
        });
    } else {
      this.setState({
        errors: [...this.state.errors, { message: "Add a message" }]
      });
    }
  };

  createMessage = () => {
    const { uid, displayName, photoURL } = this.props.user;
    console.log("TCL: MessageForm -> createMessage -> photoURL", photoURL);
    console.log(
      "TCL: MessageForm -> createMessage -> displayName",
      displayName
    );
    console.log("TCL: MessageForm -> createMessage -> uid", uid);

    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: uid,
        name: displayName,
        avatar: photoURL
      },
      content: this.state.message
    };

    return message;
  };

  render() {
    const { errors } = this.state;

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          className={
            errors.some(err => err.message.includes("message")) ? "error" : ""
          }
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = state => {
  return {
    channel: state.channel.currentChannel,
    user: state.user.currentUser
  };
};

export default connect(mapStateToProps)(MessageForm);
