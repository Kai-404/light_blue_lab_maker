import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";
import "../App.css";

class Login extends Component {
  /* States */
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errmsg: ""
    };
  }

  /* Change page to registration page */
  routeRegister = () => {
    this.props.history.push("/register");
  };

  /* Change page to homepage */
  routeHome = () => {
    this.props.history.push("/home");
  };

  routeResetPassword = () => {
    this.props.history.push("/resetpassword");
  };

  componentDidMount() {
    if (sessionStorage.getItem("loggedin") != null) {
      this.routeHome();
    }
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  /* When login button is clicked, retrieve user info from database */
  onSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email === "" || password === "") {
      this.setState({ errmsg: "fill in all blanks" });
    } else {
      axios
        .get("/login", {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          params: { email: email, password: password }
        })
        .then(res => {
          if (res.data != "") {
            if (!res.data.active) {
              this.setState({ errmsg: "Please verify your email"});
            } else {
              sessionStorage.setItem("username", res.data.username);
              sessionStorage.setItem("userType", res.data.userType);
              sessionStorage.setItem("userID", res.data.id);
              sessionStorage.setItem("loggedin", "true");
              this.setState({
                email: "",
                password: "",
                errmsg: ""
              });
              this.routeHome();
            }
          } else {
            this.setState({ errmsg: "Invalid username/email or password" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <div>
        <p className="errmsg">{this.state.errmsg}</p>
        <form className="form" onSubmit={this.onSubmit}>
          <p className="header">Login</p>
          Username or Email:
          <input
            className="input"
            value={this.state.email}
            type="text"
            name="email"
            onChange={this.onChange}
          />
          <br />
          <br />
          Password:
          <input
            className="input"
            value={this.state.password}
            type="password"
            name="password"
            onChange={this.onChange}
          />
          <br />
          <br />
          <button type="submit" className="submitButton">
            Login
          </button>
          {"  "}
          <button
            type="button"
            className="submitButton"
            onClick={this.routeRegister}
          >
            Register
          </button>
          {"  "}
          <button
            type="button"
            className="submitButton"
            onClick={this.routeResetPassword}
          >
            Reset Password
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
