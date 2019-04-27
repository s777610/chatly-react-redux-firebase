import React, { Component } from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

class Channels extends Component {
  state = {
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    modal: false
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
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

  isFormValid = ({ channelName, channelDetails }) => {
    return channelName && channelDetails;
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

export default connect(mapStateToProps)(Channels);
