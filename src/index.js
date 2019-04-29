import React, { Component } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import App from "./components/App";
import Login from "./components/auth/Login";
import Spinner from "./Spinner";
import Register from "./components/auth/Register";
import firebase from "./firebase";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { setUser, clearUser } from "./actions";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
  componentDidMount() {
    // onAuthStateChanged is a listener in app, detect if user has logged in
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // use history within withRouter()
        this.props.setUser(user); // setUser() is action creater
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.user.isLoading
  };
};

// we should use withRouter() inside BrowserRouter
const RootwithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser }
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootwithAuth />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
