import React, { Component } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Header from "./Pages/Header";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Logo from "./Image/tran_logo.png";
import "./App.css";
import "./Pages/Header.css";

class App extends Component {
  state = {
    user: null,
    LoginFlag: false
  };

  login = user => {
    this.setState({ user: user });
  };

  render() {
    let header = <img src={Logo} className="Header"></img>;
    if (this.state.LoginFlag) {
      header = (
        <Route
          render={props => (
            <React.Fragment>
              <Header />
            </React.Fragment>
          )}
        />
      );
    }
    return (
      <Router>
        <div className="App">
          {header}
          <div className="Home">
            <Route
              exact
              path="/"
              render={props => (
                <React.Fragment>
                  <Login login={this.state.LoginFlag} />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/login"
              render={props => (
                <React.Fragment>
                  <Login login={this.state.LoginFlag} />
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
