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
    messagesLoading: true,
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: []
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
      this.countUniqueUsers(loadedMessages);
    });
  };

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi"); // globally, case insensitively
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniqueUsers });
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

  displayChannelName = channel => {
    return channel ? `#${channel.name}` : "";
  };

  render() {
    const {
      messagesRef,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading
    } = this.state;
    const { channel } = this.props;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessagesForm
          messagesRef={messagesRef}
          isProgressBarVisible={this.isProgressBarVisible}
        />
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
