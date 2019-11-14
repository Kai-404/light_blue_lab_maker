import React, { Component } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
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
    axios
      .post("http://localhost:8080/register", {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        userType: this.state.UserType
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
        <Form className="form">
          <p className="header">Register</p>
          <p className="errmsg">{this.state.errmsg}</p>
          <Form.Group controlId="formGridState">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select">
              <option>Choose...</option>
              <option>Student</option>
              <option>Professor</option>
            </Form.Control>
          </Form.Group>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="email" placeholder="Enter username" />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Re-Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={this.onChange}
              />
            </Form.Group>
          </Form.Row>
          <button type="submit" className="submitButton">
            Submit
          </button>
          {"  "}
          <LinkContainer to="/">
            <button className="submitButton" type="button">
              Cancel
            </button>
          </LinkContainer>
        </Form>
      </div>
    );
  }
}

export default withRouter(Register);
