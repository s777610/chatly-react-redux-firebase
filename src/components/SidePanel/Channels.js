import React, { Component } from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

class Channels extends Component {
  state = {
    activeChannel: "",
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    modal: false,
    firstLoad: true
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  // listener on channels collection of database, like axios get
  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => {
        this.setFirstChannels();
      });
    });
  };

  // remove listener to prevent memory leak
  removeListeners = () => {
    this.state.channelsRef.off();
  };

  setFirstChannels = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(this.state.channels[0]);
      this.setActiveChannel(this.state.channels[0]);
    }
    this.setState({ firstLoad: false });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  isFormValid = ({ channelName, channelDetails }) => {
    return channelName && channelDetails;
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createBy: {
        name: this.props.currentUser.displayName,
        avatar: this.props.currentUser.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.toggleModal();
        console.log("channel added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  displayChannels = channels => {
    return (
      channels.length > 0 &&
      channels.map(channel => {
        return (
          <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
            active={channel.id === this.state.activeChannel}
          >
            # {channel.name}
          </Menu.Item>
        );
      })
    );
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal,
      channelName: "",
      channelDetails: ""
    });
  };

  render() {
    const { channels, modal } = this.state;

    return (
      <React.Fragment>
        <Menu.Menu>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}){" "}
            <Icon
              name="add"
              onClick={this.toggleModal}
              style={{ cursor: "pointer" }}
            />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.toggleModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>

            <Button color="red" inverted onClick={this.toggleModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser
  };
};

export default connect(
  mapStateToProps,
  { setCurrentChannel }
)(Channels);
