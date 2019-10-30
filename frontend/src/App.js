import React from 'react';
import Login from "./Login";
import Login from "./Home";
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
      <div>

        <Route
          exact
          path="/"
          render={props => (
            <Home user={this.state.user} />
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

      </div>
    )
  }

}

export default App;
