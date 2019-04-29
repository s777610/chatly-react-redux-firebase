import React, { Component } from "react";
import MessagesHeader from "./MessagesHeader";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import MessagesForm from "./MessagesForm";
import { connect } from "react-redux";
import Message from "./Message";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("message"),
    messages: [],
    messagesLoading: true
  };

  componentWillReceiveProps(nextProps) {
    const { channel, user } = nextProps;
    if (channel && user) {
      console.log("componentWillReceiveProps ");
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListerner(channelId);
  };

  addMessageListerner = channelId => {
    let loadedMessages = [];
    this.setState({ messages: [] });
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = messages => {
    if (!messages.length) {
      return null;
    } else {
      return messages.map(message => {
        return (
          <Message
            key={message.timestamp}
            message={message}
            user={this.props.user}
          />
        );
      });
    }
  };

  render() {
    const { messagesRef, messages } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessagesForm messagesRef={messagesRef} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    channel: state.channel.currentChannel,
    user: state.user.currentUser
  };
};

export default connect(mapStateToProps)(Messages);
