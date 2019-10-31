import React, { Component } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Header from "./Pages/Header";
import HomePage from "./Pages/HomePage";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

class App extends Component {
  state = {
    user: null
  };

  login = user => {
    this.setState({ user: user });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div className="Home">
            <Route
              exact
              path="/"
              render={props => (
                <React.Fragment>
                  <Login login={this.login} />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/login"
              render={props => (
                <React.Fragment>
                  <Login login={this.login} />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/home"
              render={props => (
                <React.Fragment>
                  <HomePage />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/register"
              render={props => (
                <React.Fragment>
                  <Register />
                </React.Fragment>
              )}
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
