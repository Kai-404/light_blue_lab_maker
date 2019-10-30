import React from 'react';
import Login from "./Login";
import Register from "./Register";
import axios from "axios";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  login = (user) => {
    this.setState({ user: user });
  };

  render() {
    return (
      <Router>

        /* Login component */
        <Route
          exact
          path="/login"
          render={props => (
            <React.Fragment>
              <Login login={this.login} />
            </React.Fragment>
          )}
        />

          /* Register component */
        <Route
            exact
            path="/register"
            render={props => (
                <React.Fragment>
                    <Register/>
                </React.Fragment>
            )}
        />

      </Router>
    )
  }

}

export default App;
