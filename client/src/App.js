import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import axios from "axios";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Register2 from "./components/auth/Register2";

import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dash from "./components/dashboard/Dash.js";
import Accounts from "./components/dashboard/Accounts";
import Template from "./components/dashboard/Template";
import Alerts from "./components/dashboard/Alerts";
import Choose from "./components/dashboard/Choose";
import "./App.css";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/tranx" component={Template} />
            <Route exact path="/choose" component={Choose} />
            <Route exact path="/Alerts" component={Alerts} />
            <Route exact path="/register2" component={Register2} />
            <Switch>
              <PrivateRoute exact path="/dash" component={Accounts} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
