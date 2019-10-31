import React, { Component } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Header from "./Pages/Header";
import HomePage from "./Pages/HomePage";
import LabsPage from "./Pages/LabsPage";
import Announcements from "./Pages/Announcements";
import Discussion from "./Pages/Discussion";
import Grade from "./Pages/Grade";
import Makelab from "./Lab/Makelab";
import Dolab from "./Lab/Dolab";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Logo from "./Image/tran_logo.png";
import "./App.css";
import "./Pages/Header.css";

class App extends Component {
  state = {
    user: null,
    showSidebar: false
  };

  login = user => {
    this.setState({ user: user });
  };

  showbar = val => {
    this.setState({ showSidebar: val });
  };

  render() {
    //let header = <img src={Logo} className="Header"></img>;
    let header = null;
    if (this.state.showSidebar) {
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
          <img src={Logo} className="Header"></img>
          {header}
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
              path="/register"
              render={props => (
                <React.Fragment>
                  <Register />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/home"
              render={props => (
                <React.Fragment>
                  <HomePage bar={this.showbar} />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/labspage"
              render={props => (
                <React.Fragment>
                  <LabsPage />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/dolab"
              render={props => (
                <React.Fragment>
                  <Dolab />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/discussion"
              render={props => (
                <React.Fragment>
                  <Discussion />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/announcements"
              render={props => (
                <React.Fragment>
                  <Announcements />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/makelab"
              render={props => (
                <React.Fragment>
                  <Makelab />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/grade"
              render={props => (
                <React.Fragment>
                  <Grade />
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
