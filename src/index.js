import React, { Component } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import App from "./components/App";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import firebase from "./firebase";

class Root extends Component {
  state = {};

  componentDidMount() {
    // onAuthStateChanged is a listener in app, detect if user has logged in
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // use history within withRouter()
        this.props.history.push("/");
      }
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

// we should use withRouter() inside BrowserRouter
const RootwithAuth = withRouter(Root);

ReactDOM.render(
  <BrowserRouter>
    <RootwithAuth />
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
