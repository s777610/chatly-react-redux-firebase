import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";

import FileModal from "./FileModal";

class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: [],
    modal: false
  };

  toggleModal = () => this.setState({ modal: !this.state.modal });

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

  uploadFile = (file, metadata) => {
    console.log(file, metadata);
  };

  createMessage = () => {
    const { uid, displayName, photoURL } = this.props.user;
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
    const { errors, message, loading, modal } = this.state;

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
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
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            onClick={this.toggleModal}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />

          <FileModal
            modal={modal}
            closeModal={this.toggleModal}
            uploadFile={this.uploadFile}
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
