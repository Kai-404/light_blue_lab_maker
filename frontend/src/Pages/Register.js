import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import axios from "axios";
import "../App.css";
import Login from "./Login";

class Register extends Component {
  /* States */
  state = {
    username: "",
    email: "",
    password: "",
    password2: "",
    UserType: "",
    errmsg: ""
  };

  /* Change page to homepage */
  routeChange = () => {
    this.props.history.push("/");
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  /* adds user info to database */
  register = (username, email, password, UserType) => {
    console.log(password.length);
    let data = JSON.stringify({
      username,
      email,
      password,
      UserType
    });
    axios
      .post("/register", data, {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        params: {
          username: username,
          email: email,
          password: password,
          UserType: UserType
        }
      })
      .then(res => {
        if (res.data === 0) {
          this.setState({
            errmsg: "Fail to create new Account, invalid email"
          });
        } else if (res.data === 1) {
          this.setState({
            errmsg: "Fail to create new Account, email already exists"
          });
        } else if (res.data === 2)
          this.setState({
            errmsg: "Fail to create new Account, username already exists"
          });
        else {
          this.setState({
            username: "",
            email: "",
            password: "",
            password2: "",
            UserType: ""
          });
          this.props.history.push("/");
        }
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  /* Does error checking, if everything is ok call register function */
  onSubmit = e => {
    e.preventDefault();
    const { username, email, password, password2, UserType } = this.state;
    if (
      username === "" ||
      email == "" ||
      password === "" ||
      password2 === "" ||
      UserType === ""
    ) {
      this.setState({ errmsg: "fill in all fields" });
    } else if (/\S+@\S+\.\S+/.test(email) == false) {
      this.setState({ errmsg: "invalid email" });
    } else if (password !== password2) {
      this.setState({
        errmsg: "Fail to create new Account, password don't match"
      });
    } else if (password.length < 8) {
      this.setState({
        errmsg: "password needs to be at least 8 characters long"
      });
    }
    this.register(username, email, password, UserType);
  };

  render() {
    return (
      <div>
        <p className="errmsg">{this.state.errmsg}</p>
        <form className="form" onSubmit={this.onSubmit}>
          <Form.Check
            custom
            type="radio"
            label="Student"
            name="UserType"
            id="Stu"
            value="Student"
            onChange={this.onChange}
          />
          <Form.Check
            custom
            type="radio"
            label="Professor"
            name="UserType"
            id="Prof"
            value="Professor"
            onChange={this.onChange}
          />
          User Name:
          <input
            className="input"
            value={this.state.username}
            type="text"
            name="username"
            onChange={this.onChange}
          />
          <br />
          <br />
          Email:
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
          Reenter Password:
          <input
            className="input"
            value={this.state.password2}
            type="password"
            name="password2"
            onChange={this.onChange}
          />
          <br />
          <br />
          <button type="submit" className="submitButton">
            Submit
          </button>
          {"  "}
          <button
            type="button"
            className="submitButton"
            onClick={this.routeChange}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(Register);
