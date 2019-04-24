import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./components/App";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

const Root = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
