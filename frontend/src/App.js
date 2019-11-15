import React, { Component } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Header from "./Layout/Header";
import Sidebar from "./Layout/Sidebar";
import HomePage from "./Pages/HomePage";
import LabsPage from "./Pages/LabsPage";
import Announcements from "./Pages/Announcements";
import Discussion from "./Pages/Discussion";
import Grade from "./Pages/Grade";
import Makelab from "./Lab/Makelab";
import Dolab from "./Lab/Dolab";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import "./Layout/Header.css";
import ResetPassword from "./Pages/ResetPassword";

class App extends Component {
  state = {
    user: null,
    loggedIn: true,
    underCourse: false
  };

  login = user => {
    this.setState({ user: user });
  };

  showbar = val => {
    this.setState({ loggedIn: val });
  };

  showCourseContent = val => {
    console.log("appjs under course: ", val);
    this.setState({ underCourse: val });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Route
            render={props => (
              <Header
                showCourseContent={this.showCourseContent}
                loggedIn={this.state.loggedIn}
                underCourse={this.state.underCourse}
              />
            )}
          />
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
              path="/resetpassword"
              render={props => (
                <React.Fragment>
                  <ResetPassword />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/home"
              render={props => (
                <React.Fragment>
                  <HomePage user={this.state.user} underCourse={this.showCourseContent} />
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
