import React, { Component } from "react";
import MessagesHeader from "./MessagesHeader";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import MessagesForm from "./MessagesForm";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("message")
  };

  render() {
    const { messagesRef } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages" />
        </Segment>
        <MessagesForm messagesRef={messagesRef} />
      </React.Fragment>
    );
  }
}

export default Messages;
